import type { CollectionConfig } from "payload/types";

const Thumbnails: CollectionConfig = {
    slug: 'thumbnails',
    auth: false,
    access: {
        read: () => true
    },
    upload: {
        staticURL: '/media/thumbnails',
        staticDir: 'media/thumbnails',
        imageSizes: [
            {
                name: 'fallback',
                width: 20,
                height: 12,
                position: 'centre'
            }
        ],
        adminThumbnail: ({ doc: { videoId } }) => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        mimeTypes: ['image/*'],
    },
    fields: [
        {
            name: 'videoId',
            type: 'text',
            required: true,
            index: true,
            unique: true
        }
    ]
}

export default Thumbnails;
