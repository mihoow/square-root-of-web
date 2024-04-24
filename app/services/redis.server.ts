import { createClient } from 'redis';

function initialize() {
    return createClient({
        url: process.env.REDIS_URI!,
    })
        .on('error', (err) => {
            console.log('Redis Server Error ', err);
        })
        .connect();
}

export type RedisClient = Awaited<ReturnType<typeof initialize>>

export async function getRedisClient() {
    const g = global as { __redis?: ReturnType<typeof initialize> };

    if (!g.__redis) {
        g.__redis = initialize();
    }

    return g.__redis;
}
