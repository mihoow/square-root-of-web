import type { CollectionConfig } from 'payload/types';
import blocksField from '../posts/blocks';
import { cacheHooks } from '../posts/hooks/cache';
import fields from '../posts/fields';
import { mergeHooks } from '../utils/mergeHooks';
import { postStatsHooks } from '../posts/hooks/postStats';
import { publishedDateFieldHooks } from '../posts/hooks/publishedDateField';

const Posts: CollectionConfig = {
    slug: 'posts',
    auth: false,
    admin: {
        useAsTitle: 'title',
    },
    fields: [...fields, blocksField],
    hooks: mergeHooks(publishedDateFieldHooks, postStatsHooks, cacheHooks),
    versions: {
        drafts: {
            autosave: false
        }
    }
};

export default Posts;
