import { afterChangeHook, afterDeleteHook, beforeChangeHook } from '../posts/hooks'

import type { CollectionConfig } from 'payload/types';
import blocksField from '../posts/blocks';
import fields from '../posts/fields';

const Posts: CollectionConfig = {
    slug: 'posts',
    auth: false,
    admin: {
        useAsTitle: 'title',
    },
    fields: [...fields, blocksField],
    hooks: {
        beforeChange: [beforeChangeHook],
        afterChange: [afterChangeHook],
        afterDelete: [afterDeleteHook]
    },
    versions: {
        drafts: {
            autosave: false
        }
    }
};

export default Posts;
