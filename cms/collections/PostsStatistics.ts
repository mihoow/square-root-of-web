import type { CollectionAfterDeleteHook, CollectionBeforeChangeHook, CollectionConfig, Field } from 'payload/types';

import type { PostStatistic } from 'payload/generated-types';
import { invalidateCache } from '../utils/cache';

const NUMERIC_FIELDS: Readonly<string[]> = ['totalViews', 'likes', 'dislikes'];

const beforeChangeHook: CollectionBeforeChangeHook<PostStatistic> = async ({ originalDoc, data }) => {
    if (!originalDoc) {
        return data;
    }

    await invalidateCache('post.postStats', { postId: originalDoc.postId });

    return data;
};

const afterDeleteHook: CollectionAfterDeleteHook<PostStatistic> = async ({ doc: { postId } }) => {
    await invalidateCache('post.postStats', { postId });
};

const PostsStatistics: CollectionConfig = {
    slug: 'post-statistics',
    auth: false,
    admin: {
        useAsTitle: 'postId',
    },
    access: {
        read: () => true,
        create: () => false,
        update: () => false,
    },
    fields: [
        {
            name: 'postId',
            type: 'text',
            required: true,
            index: true,
            admin: {
                readOnly: true,
                width: '400px',
            },
        },
        ...NUMERIC_FIELDS.map<Field>((fieldName) => ({
            name: fieldName,
            type: 'number',
            min: 0,
            defaultValue: 0,
            required: true,
            admin: {
                readOnly: true,
                width: '250px',
            },
        })),
    ],
    hooks: {
        beforeChange: [beforeChangeHook],
        afterDelete: [afterDeleteHook],
    },
};

export default PostsStatistics;
