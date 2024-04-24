import type {
    CacheConfig,
    CacheFallback,
    CacheKey,
    CacheOptions,
    CacheType,
    ConfigRecord,
    ICache,
    PromiseOrNot,
} from '../types/cache.server';
import { isObject, isPrimitive } from '../utils/misc';

import { TimeInMs } from '../config/misc';
import crypto from 'node:crypto';
import type { getRedisClient } from './redis.server';

abstract class AbstractCache {
    protected abstract readonly namespace?: string;

    protected prefix(key: CacheKey) {
        if (this.namespace) return `${this.namespace}:${String(key)}`;

        return String(key);
    }

    hash(...args: unknown[]): string {
        const serializedData = args.reduce<string>((key, value) => {
            if (isPrimitive(value)) {
                return key ? `${key}:${value}` : String(value);
            }

            if (isObject(value) || Array.isArray(value)) {
                return key ? `${key}:${JSON.stringify(value)}` : JSON.stringify(value);
            }

            return key;
        }, '');

        return crypto.createHash('sha256').update(serializedData).digest('hex');
    }
}

class InMemoryCache extends AbstractCache implements ICache {
    protected readonly namespace?: string;

    protected readonly MAX_ENTRIES = 240;

    protected entries: Map<CacheKey, string>;

    constructor() {
        super();

        const glob = global as { __cacheEntries?: Map<CacheKey, string> };

        if ('__cacheEntries' in glob && glob.__cacheEntries) {
            this.entries = glob.__cacheEntries;
        } else {
            this.entries = new Map();
            glob.__cacheEntries = this.entries;
        }
    }

    get<T>(key: CacheKey): T | null {
        const data = this.entries.get(key);

        return data ? (JSON.parse(data) as T) : null;
    }

    set(key: CacheKey, data: unknown): PromiseOrNot<void> {
        this.entries.set(key, JSON.stringify(data));

        if (this.entries.size >= this.MAX_ENTRIES) {
            const totalKeysToRemove = this.entries.size - Math.ceil(this.MAX_ENTRIES * (5 / 6));
            const keysToRemove = Array.from(this.entries.keys()).slice(0, totalKeysToRemove);
            keysToRemove.forEach((key) => this.entries.delete(key));
        }
    }

    invalidate(key: CacheKey): void {
        this.entries.delete(key);
    }

    flush(namespace?: string): void {
        if (!namespace) {
            this.entries.clear();

            return;
        }

        Array.from(this.entries.keys()).forEach((key) => {
            if (String(key).startsWith(namespace)) {
                this.entries.delete(key);
            }
        });
    }
}

class RedisCache extends AbstractCache implements ICache {
    protected readonly namespace = 'cache';

    protected redis: Awaited<ReturnType<typeof getRedisClient>>;

    constructor(redis: Awaited<ReturnType<typeof getRedisClient>>) {
        super();

        this.redis = redis;
    }

    async get<T>(key: CacheKey, msToLive = TimeInMs.MONTH): Promise<T | null> {
        const data = await this.redis.get(this.prefix(key));

        if (data) {
            const parsedData = JSON.parse(data) as T;

            // reset the expiration to the initial value
            this.redis.pExpire(this.prefix(key), msToLive);

            return parsedData;
        }

        return null;
    }

    async set<T>(key: CacheKey, data: T, msToLive = TimeInMs.MONTH): Promise<void> {
        await this.redis.set(this.prefix(key), JSON.stringify(data), { PX: msToLive });
    }

    async invalidate(key: CacheKey): Promise<void> {
        await this.redis.unlink(this.prefix(key));
    }

    async flush(namespace?: string, cursor = 0): Promise<void> {
        const match = namespace ? `${this.namespace}:${namespace}:*` : `${this.namespace}:*`;
        const { cursor: nextCursor, keys } = await this.redis.scan(cursor, { MATCH: match });

        await Promise.all(keys.map(async (key) => this.redis.unlink(key)));

        if (nextCursor === 0) {
            return;
        }

        await this.flush(namespace, nextCursor);
    }
}

class ConfiguredCache<R extends ConfigRecord> extends AbstractCache {
    protected namespace: string;

    protected cache: Cache;

    protected configs: CacheConfig<CacheKey, CacheFallback>[];

    constructor(cache: Cache, namespace: string, configs: CacheConfig<CacheKey, CacheFallback>[]) {
        super();

        this.cache = cache;
        this.namespace = namespace;
        this.configs = configs;
    }

    protected getCacheType<K extends keyof R>(config: CacheConfig<K, R[K]>, args?: Parameters<R[K]>): CacheType {
        const { type } = config;

        if (typeof type === 'function' && args) {
            return type(...args);
        }

        const cacheType = typeof type === 'function' ? config.usedTypes : type;

        return cacheType === undefined ? 'all' : cacheType;
    }

    protected hashArguments<K extends keyof R>({ hashing }: CacheConfig<K, R[K]>, args?: Parameters<R[K]>): string {
        if (!args) {
            return '';
        }

        if (hashing) {
            return this.hash(hashing(...args));
        }

        return this.hash(...args);
    }

    protected findConfig<K extends keyof R>(key: K, args?: Parameters<R[K]>) {
        const config = this.configs.find(({ namespace }) => namespace === key) as CacheConfig<K, R[K]>;
        const cacheType = this.getCacheType(config, args);
        const hash = this.hashArguments<K>(config, args);
        const cacheKey = hash ? `${this.prefix(key)}:${hash}` : this.prefix(key);

        return {
            ...config,
            cacheKey,
            type: cacheType,
        };
    }

    protected toCacheKey(key: CacheKey, hash: string) {
        return hash ? `${this.prefix(key)}:${hash}` : this.prefix(key);
    }

    async get<K extends keyof R>(key: K, ...args: Parameters<R[K]>): Promise<Awaited<ReturnType<R[K]>>> {
        const { cacheKey, type, msToLive, fallback } = this.findConfig(key, args);

        // cache is disabled
        if (type === null) {
            const fromFallback = await fallback(...args);

            return fromFallback as Awaited<ReturnType<R[K]>>;
        }

        const options: CacheOptions = {
            type,
            msToLive,
        };

        const fromCache = await this.cache.get(cacheKey, options);

        if (fromCache === null) {
            const fromFallback = await fallback(...args);

            (async () => {
                try {
                    await this.cache.set(cacheKey, fromFallback, options);
                } catch (error) {
                    console.log(`Error updating cache `, error);
                }
            })();

            return fromFallback as Awaited<ReturnType<R[K]>>;
        }

        return fromCache as Awaited<ReturnType<R[K]>>;
    }

    async invalidate<K extends keyof R>(key: K, ...args: Parameters<R[K]>): Promise<void> {
        const { cacheKey, type } = this.findConfig(key, args);

        await this.cache.invalidate(cacheKey, { type });
    }

    async flushNamespace(type: CacheType = 'all'): Promise<void> {
        await this.cache.flush(this.namespace, { type });
    }
}

export class Cache extends AbstractCache {
    protected readonly namespace?: string;

    protected inMemoryStorage: InMemoryCache;

    protected redisStorage: RedisCache;

    constructor(redis: Awaited<ReturnType<typeof getRedisClient>>) {
        super();

        this.inMemoryStorage = new InMemoryCache();
        this.redisStorage = new RedisCache(redis);
    }

    async get(key: CacheKey, { type = 'all', msToLive = TimeInMs.MONTH }: CacheOptions = {}): Promise<unknown> {
        if (type === 'inMemory' || type === 'all') {
            const data = this.inMemoryStorage.get(key);

            if (data) return data
        }

        if (type === 'redis' || type === 'all') {
            try {
                const data = await this.redisStorage.get(key, msToLive);

                if (data) return data
            } catch (error) {
                console.log('Error getting data from redis cache ', error)

                return null;
            }
        }

        return null;
    }

    async set(
        key: CacheKey,
        data: unknown,
        { type = 'all', msToLive = TimeInMs.MONTH }: CacheOptions = {}
    ): Promise<void> {
        if (type === 'inMemory' || type === 'all') {
            this.inMemoryStorage.set(key, data);
        }

        if (type === 'redis' || type === 'all') {
            await this.redisStorage.set(key, data, msToLive);
        }
    }

    async invalidate(key: CacheKey, { type = 'all' }: CacheOptions = {}): Promise<void> {
        if (type === 'inMemory' || type === 'all') {
            this.inMemoryStorage.invalidate(key);
        }

        if (type === 'redis' || type === 'all') {
            await this.redisStorage.invalidate(key);
        }
    }

    async flush(namespace?: string, { type = 'all' }: CacheOptions = {}): Promise<void> {
        if (type === 'inMemory' || type === 'all') {
            this.inMemoryStorage.flush(namespace);
        }

        if (type === 'redis' || type === 'all') {
            await this.redisStorage.flush(namespace);
        }
    }

    configure<R extends ConfigRecord>(builder: CacheConfigBuilder<R>) {
        return builder.build(this);
    }
}

export class CacheConfigBuilder<R extends ConfigRecord = {}> {
    protected namespace: string;

    protected configs: CacheConfig<CacheKey, CacheFallback>[];

    constructor(namespace: string, configs: CacheConfig<CacheKey, CacheFallback>[] = []) {
        this.namespace = namespace;
        this.configs = configs;
    }

    add<K extends string, F extends CacheFallback>(config: CacheConfig<K, F>) {
        return new CacheConfigBuilder<R & Record<K, F>>(this.namespace, [
            ...this.configs,
            config as CacheConfig<CacheKey, CacheFallback>,
        ]);
    }

    build(cache: Cache) {
        return new ConfiguredCache<R>(cache, this.namespace, this.configs);
    }
}
