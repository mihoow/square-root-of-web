import type { PostTag } from "./type"
import { TimeInMs } from "~/config/util";

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

export enum ActionType {
    INCREMENT_VIEWS_COUNT = 'incrementViewsCount',
    UPDATE_USER_RATING = 'updateUserRating'
}

export const TIME_TO_INCREASE_VIEWS = 20 * TimeInMs.SECOND;