import type { CodePenData, QuestionsAndAnswersData, SectionItem, TextBlockData, UserRating, YoutubeVideoData } from "./type";

export function isTextBlock(data: SectionItem): data is TextBlockData {
    return data.blockType === 'TextBlock';
}

export function isYoutubeVideo(data: SectionItem): data is YoutubeVideoData {
    return data.blockType === 'YoutubeVideo';
}

export function isQA(data: SectionItem): data is QuestionsAndAnswersData {
    return data.blockType === 'QuestionsAndAnswers';
}

export function isCodePen(data: SectionItem): data is CodePenData {
    return data.blockType === 'CodePen';
}

export function isUserRating(value: unknown): value is UserRating {
    const possibleRatings: UserRating[] = ['likes', 'dislikes', null]

    return possibleRatings.includes(value as UserRating)
}