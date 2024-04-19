import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionBeforeChangeHook } from "payload/types";

import type { Post } from "payload/generated-types";

export const beforeChangeHook: CollectionBeforeChangeHook<Post> = ({ data, originalDoc }) => {
    const isBeingPublished = (!originalDoc || originalDoc._status === 'draft') && data._status === 'published'
    const hasNoPublishDate = !originalDoc?.publishedAt

    if (isBeingPublished && hasNoPublishDate) {
        return {
            ...data,
            publishedAt: new Date()
        }
    }

    return data
}

export const afterChangeHook: CollectionAfterChangeHook = async ({ operation, doc, req: { payload } }) => {
    if (operation !== 'create') {
        return
    }

    await payload.create({
        collection: 'post-statistics',
        data: {
            postId: doc.id,
            totalViews: 0,
            likes: 0,
            dislikes: 0
        }
    })

    return doc
}

export const afterDeleteHook: CollectionAfterDeleteHook = async ({ id: postId, req: { payload } }) => {
    await payload.delete({
        collection: 'post-statistics',
        where: { postId: { equals: postId } }
    })
}
