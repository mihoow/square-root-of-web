import { json, redirect } from '@remix-run/node';

import type { ActionFunctionArgs } from '@remix-run/node';
import { isObject } from '~/utils/misc';
import { cacheConfig as postCacheConfig } from '~/features/post/services/cache.server';

type ValidData = {
    name: string;
};

function isValidData(data: unknown): data is ValidData {
    return isObject(data) && 'name' in data;
}

function isPostNamespace(data: ValidData): boolean {
    return data.name.startsWith('post');
}

function isPostCache(data: ValidData): data is { name: 'post.post'; pageSlug: string } {
    return data.name === 'post.post' && 'pageSlug' in data && typeof data.pageSlug === 'string';
}

function isPostStatsCache(data: ValidData): data is { name: 'post.postCache'; postId: string } {
    return data.name === 'post.postCache' && 'postId' in data && typeof data.postId === 'string';
}

export const action = async ({ request, context: { cache, payload } }: ActionFunctionArgs) => {
    const data = await request.json();

    if (!isValidData(data)) {
        throw json({ ok: false, message: 'Incorrect cache name provided' });
    }

    const { name } = data;

    try {
        if (isPostNamespace(data)) {
            const postCache = cache.configure(postCacheConfig);

            if (isPostCache(data)) {
                const { pageSlug } = data;

                await postCache.invalidate('post', { payload, slug: pageSlug });
            } else if (isPostStatsCache(data)) {
                const { postId } = data;

                await postCache.invalidate('postStats', { payload, postId });
            } else {
                return json({ ok: false, message: `Unsupported cache name: ${name}` });
            }
        } else {
            return json({ ok: false, message: `Unsupported cache name: ${name}` });
        }
    } catch (error) {
        if (error instanceof Error) {
            throw json({ ok: false, message: error.message });
        }

        throw json({ ok: false, message: 'Unknown error' });
    }

    return { ok: true };
};

export const loader = () => redirect('/', { status: 404 });
