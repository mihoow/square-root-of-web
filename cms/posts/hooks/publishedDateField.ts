import type { CollectionBeforeChangeHook, CollectionConfig } from "payload/types"

import type { Post } from "payload/generated-types"

const beforeChangeHook: CollectionBeforeChangeHook<Post> = ({ data, originalDoc }) => {
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

export const publishedDateFieldHooks: CollectionConfig['hooks'] = {
    beforeChange: [beforeChangeHook]
}
