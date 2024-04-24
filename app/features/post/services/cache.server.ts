import { getPostStats, getUserActions } from "./postStats.server";

import { CacheConfigBuilder } from "../../../services/cache.server";
import { getPostBySlug } from "./fetchPost.server";

export const cacheConfig = new CacheConfigBuilder('post')
    .add({
        namespace: 'post',
        type: 'all',
        fallback: getPostBySlug,
        hashing: ({ slug }) => ({ slug })
    })
    .add({
        namespace: 'postStats',
        type: 'all',
        fallback: getPostStats,
        hashing: ({ postId }) => ({ postId })
    })
    .add({
        namespace: 'userActions',
        type: null, // disabled cache
        fallback: getUserActions,
        hashing: () => ({})
    });
