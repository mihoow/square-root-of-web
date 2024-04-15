import Posts from './cms/collections/Posts';
import Users from './cms/collections/Users';
import { buildConfig } from 'payload/config';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import path from 'path';
import { viteBundler } from '@payloadcms/bundler-vite';

export default buildConfig({
    admin: {
        user: Users.slug,
        bundler: viteBundler(),
        vite: (incomingViteConfig) => ({
            ...incomingViteConfig,
            build: {
                ...incomingViteConfig.build,
                emptyOutDir: false,
            },
        }),
    },
    editor: lexicalEditor({}),
    db: mongooseAdapter({
        url: process.env.MONGODB_URI ?? false,
    }),
    collections: [Users, Posts],
    typescript: {
        outputFile: path.resolve(__dirname, 'cms/payload-types.ts'),
    },
});
