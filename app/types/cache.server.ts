export type PromiseOrNot<T> = Promise<T> | T;

export type CacheType = 'inMemory' | 'redis' | 'all' | null;

export type CacheFallback = (...args: any[]) => any;

export type CacheKey = string | number | symbol;

export type ConfigRecord = Record<CacheKey, CacheFallback>;

export type CacheOptions = {
    type?: CacheType;
    msToLive?: number;
};

export type CacheConfig<Key extends keyof ConfigRecord, Fallback extends ConfigRecord[Key]> = {
    namespace: Key;
    fallback: Fallback;
    msToLive?: number;
    hashing?: (...args: Parameters<Fallback>) => Record<string, unknown>;
} & ({ type?: CacheType } | { type?: (...args: Parameters<Fallback>) => CacheType; usedTypes: CacheType });

export interface ICache {
    hash(...args: unknown[]): string;

    get(key: CacheKey, msToLive?: number): PromiseOrNot<unknown | null>;

    set(key: CacheKey, data: unknown, msToLive?: number): PromiseOrNot<void>;

    invalidate(key: CacheKey): PromiseOrNot<void>;

    flush?(namespace?: string): PromiseOrNot<void>;
}
