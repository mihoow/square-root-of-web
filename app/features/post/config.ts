import type { PostTag } from "./type"

type TagConfig = {
    label: string;
    color: string;
}

export const TAGS_CONFIG: Record<PostTag, TagConfig> = {
    "java-script": {
        label: 'JavaScript',
        color: 'warning'
    },
    'web-development': {
        label: 'web development',
        color: 'info'
    }
}
