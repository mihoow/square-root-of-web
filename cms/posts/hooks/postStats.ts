import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig } from "payload/types"

const afterChangeHook: CollectionAfterChangeHook = async ({ operation, doc, req, req: { payload } }) => {
    if (operation !== 'create') {
        return
    }

    await payload.create({
        req,
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

const afterDeleteHook: CollectionAfterDeleteHook = async ({ id: postId, req, req: { payload } }) => {
    await payload.delete({
        req,
        collection: 'post-statistics',
        where: { postId: { equals: postId } }
    })
}

export const postStatsHooks: CollectionConfig['hooks'] = {
    afterChange: [afterChangeHook],
    afterDelete: [afterDeleteHook]
}
