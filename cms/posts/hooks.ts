import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload/types";

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
