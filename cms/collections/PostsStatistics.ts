import type { CollectionConfig, Field } from 'payload/types';

const NUMERIC_FIELDS: Readonly<string[]> = [
    'totalViews',
    'likes',
    'dislikes'
]

const PostsStatistics: CollectionConfig = {
  slug: 'post-statistics',
  auth: false,
  admin: {
    useAsTitle: 'postId',
  },
  access: {
    read: () => true,
    create: () => false,
    update: () => false
  },
  fields: [
    {
        name: 'postId',
        type: 'text',
        required: true,
        index: true,
        admin: {
            readOnly: true,
            width: '400px'
        }
    },
    ...(NUMERIC_FIELDS.map<Field>((fieldName) => ({
        name: fieldName,
        type: 'number',
        min: 0,
        defaultValue: 0,
        required: true,
        admin: {
            readOnly: true,
            width: '250px'
        }
    })))
  ],
};

export default PostsStatistics;
