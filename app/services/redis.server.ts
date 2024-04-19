import { createClient } from 'redis';

function initialize() {
    return createClient({
        url: 'rediss://default:1bd3b48c20814e599090598ed68e9c66@hot-tapir-31832.upstash.io:31832',
    })
        .on('error', (err) => {
            console.log('Redis Server Error ', err);
        })
        .connect();
}

export async function getRedisClient() {
    const g = global as { __redis?: ReturnType<typeof initialize> };

    if (!g.__redis) {
        g.__redis = initialize();
    }

    return g.__redis;
}
