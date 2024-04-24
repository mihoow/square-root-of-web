import type { CollectionAfterDeleteHook, CollectionBeforeChangeHook, CollectionConfig } from 'payload/types';

import type { Post } from 'payload/generated-types';
import { invalidateCache } from '../../utils/cache';

const beforeChangeHook: CollectionBeforeChangeHook<Post> = async ({ originalDoc, data }) => {
    if (!originalDoc) {
        return data;
    }

    await invalidateCache('post.post', { pageSlug: originalDoc.pageSlug })

    return data
};

const afterDeleteHook: CollectionAfterDeleteHook<Post> = async ({ doc: { pageSlug } }) => {
    await invalidateCache('post.post', { pageSlug })
};

export const cacheHooks: CollectionConfig['hooks'] = {
    beforeChange: [beforeChangeHook],
    afterDelete: [afterDeleteHook],
};
