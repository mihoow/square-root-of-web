import type { PostStats, UserPostActions, UserRating } from '../type';

import type { CollectionModel } from '@payloadcms/db-mongodb/dist/types';
import type { Payload } from 'payload';
import type { RedisClient } from '~/services/redis.server';
import { TimeInMs } from '../../../config/misc';
import { getClientIPAddress } from 'remix-utils/get-client-ip-address'
import { isbot } from 'isbot';

export type UpdateFunctionArgs = {
    request: Request;
    payload: Payload;
    redis: RedisClient;
    postId: string;
};

export type UpdateFunctionReturnType = Promise<{ ok: false } | { ok: true; updated: boolean }>;

async function updateCounter(
    payload: Payload,
    postId: string,
    update: Partial<Record<keyof Pick<PostStats, 'totalViews' | 'likes' | 'dislikes'>, 1 | -1>>
) {
    const statsCollection = payload.db.collections['post-statistics'] as CollectionModel;

    const { modifiedCount } = await statsCollection.updateOne(
        { postId },
        {
            $inc: Object.entries(update).reduce((acc, [propertyName, value]) => {
                return {
                    ...acc,
                    [propertyName]: value,
                };
            }, {}),
        }
    );

    if (modifiedCount === 0) {
        throw new Error(`No post statistics for post of id: ${postId} were found.`);
    }
}

async function getClientIp(request: Request) {
    const clientIp = getClientIPAddress(request);

    if (!clientIp) {
        throw new Error('Impossible to detect client IP address');
    }

    return clientIp;
}

async function getUserActionsHandler(request: Request, redis: RedisClient, postId: string) {
    try {
        const clientIp = await getClientIp(request);

        console.log(`Client IP: ${clientIp}`);
        const key = `devices:${clientIp}:posts:${postId}`;

        return {
            async get(): Promise<UserPostActions> {
                const { isViewed, rating = null } = await redis.hGetAll(key);

                return {
                    isViewed: Number(isViewed) === 1,
                    rating: rating as UserRating,
                };
            },
            async set<P extends keyof UserPostActions>(prop: P, value: UserPostActions[P]) {
                const parsedValue: string | number | null = (() => {
                    if (typeof value === 'boolean') {
                        return value ? 1 : -1;
                    }

                    return value;
                })();

                if (!parsedValue) {
                    return redis.hDel(key, prop);
                }

                return Promise.all([
                    redis.hSet(key, { [prop]: parsedValue }),
                    redis.pExpire(key, TimeInMs.MONTH, 'NX'),
                ]);
            },
        };
    } catch (error) {
        console.log('>>IP error', error)
    }
}

async function handleUpdate(
    { request, redis, postId }: UpdateFunctionArgs,
    callback: (
        userActions: UserPostActions,
        handler: Awaited<ReturnType<typeof getUserActionsHandler>>
    ) => UpdateFunctionReturnType
): UpdateFunctionReturnType {
    const isDevelopment = process.env.NODE_ENV !== 'production';

    if (isDevelopment) {
        return { ok: true, updated: false };
    }

    try {
        const userActionsHandler = await getUserActionsHandler(request, redis, postId);
        const actions = await userActionsHandler.get();

        return callback(actions, userActionsHandler);
    } catch (error) {
        console.log(error);

        return { ok: false };
    }
}

export async function incrementViewsCount(args: UpdateFunctionArgs): UpdateFunctionReturnType {
    const { request, payload, postId } = args;

    if (isbot(request.headers.get('user-agent') || '')) {
        return { ok: false };
    }

    return handleUpdate(args, async ({ isViewed }, handler) => {
        if (isViewed) {
            return { ok: true, updated: false };
        }

        await updateCounter(payload, postId, { totalViews: 1 });
        await handler.set('isViewed', true);

        return { ok: true, updated: true };
    });
}

export async function updateUserRating(args: UpdateFunctionArgs, nextRating: UserRating): UpdateFunctionReturnType {
    const { payload, postId } = args;

    return handleUpdate(args, async ({ rating: currRating }, handler) => {
        const update = (() => {
            if (!currRating && nextRating) {
                return { [nextRating]: 1 };
            }

            if (currRating && !nextRating) {
                return { [currRating]: -1 };
            }

            if (currRating && nextRating) {
                return { [currRating]: -1, [nextRating]: 1 };
            }

            return null;
        })();

        if (!update) {
            return { ok: true, updated: false };
        }

        await updateCounter(payload, postId, update);
        await handler.set('rating', nextRating);

        return { ok: true, updated: true };
    });
}

export async function getPostStats({ payload, postId }: { payload: Payload; postId: string }): Promise<PostStats> {
    try {
        const {
            docs: [postStats],
        } = await payload.find({
            collection: 'post-statistics',
            where: {
                postId: { equals: postId },
            },
        });

        if (!postStats) {
            throw new Error('Not found');
        }

        return postStats;
    } catch (error) {
        console.log(error);

        return {
            postId,
            totalViews: 0,
            likes: 0,
            dislikes: 0,
        };
    }
}

export async function getUserActions({
    request,
    redis,
    postId,
}: {
    request: Request;
    redis: RedisClient;
    postId: string;
}): Promise<UserPostActions> {
    try {
        const { get } = await getUserActionsHandler(request, redis, postId);

        return get();
    } catch (error) {
        console.log('getUserActions', error);

        return {
            isViewed: true,
            rating: null,
        };
    }
}
