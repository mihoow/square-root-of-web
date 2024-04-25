import type { CollectionAfterDeleteHook, FieldHook } from "payload/types";
import type { Post, YoutubeVideoData } from "payload/generated-types";

import type { File as PayloadFile } from "payload/dist/uploads/types";

export const afterFieldChange: FieldHook =  async ({ previousDoc, siblingData, value: videoId, req, req: { payload } }) => {
    const prevVideoId = previousDoc.sections?.find((section: { id: string }) => section.id === siblingData.id)?.videoId

    if (!videoId || videoId === prevVideoId) {
        return
    }

    if (prevVideoId) {
        await payload.delete({
            req,
            collection: 'thumbnails',
            where: { videoId: { equals: prevVideoId } }
        })

    }

    const response = await fetch(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`)
    const imageBuffer = Buffer.from(await response.arrayBuffer())
    const file: PayloadFile = {
        data: imageBuffer,
        mimetype: 'image/jpeg',
        name: videoId,
        size: Buffer.byteLength(imageBuffer)
    }

    await payload.create({
        req,
        collection: 'thumbnails',
        data: { videoId },
        file
    })
}

export const afterCollectionDelete: CollectionAfterDeleteHook<Post> = async ({ doc: { sections }, req, req: { payload } }) => {
    const isYoutubeVideo = (section: { blockType: string; }): section is YoutubeVideoData => {
        return section.blockType === 'YoutubeVideo'
    }
    const allVideoIds = sections.filter(isYoutubeVideo).map(({ videoId }) => videoId)

    if (allVideoIds.length === 0) return

    await payload.delete({
        req,
        collection: 'thumbnails',
        where: { videoId: { in: allVideoIds } }
    })
}

