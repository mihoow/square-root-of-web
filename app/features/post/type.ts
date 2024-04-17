import type { ArrayItem, Must, Override } from '~/types/util';
import type {
    PostStatistic,
    AdvancedTitling as RawAdvancedTitling,
    CodePenData as RawCodePenData,
    Post as RawPost,
    QAItems as RawQAItems,
    QuestionsAndAnswersData as RawQuestionsAndAnswers,
    TextBlockData as RawTextBlock,
    YoutubeVideoData as RawYoutubeVideo
} from 'payload/generated-types';

type CommonDocProperties = {
    id: string;
    createdAt: string;
    updatedAt: string;
}

type RawQAItem = ArrayItem<RawQAItems>;

export type QAItem = Omit<
    Override<RawQAItem, { id: string; question: string; shortQuestion: string; richTextAnswer?: string | null; }>,
    'questionHTML' | 'richTextAnswerHTML'
>

export type TextBlockData = Omit<RawTextBlock, 'content' | 'contentHTML'> & {
    content: string;
}

export interface CodePenData extends RawCodePenData {
    codePenUrl: string;
}

export interface YoutubeVideoData extends RawYoutubeVideo {
    thumbnailUrl: string;
}

export type QuestionsAndAnswersData = Omit<RawQuestionsAndAnswers, 'items'> & {
    items: QAItem[];
}

export type SectionItem =
    | TextBlockData
    | CodePenData
    | YoutubeVideoData
    | QuestionsAndAnswersData;

export type AdvancedTitling = Must<RawAdvancedTitling>;

export type PostTag = ArrayItem<Exclude<RawPost['tags'], null | undefined>>;

export type PageLayoutItem = {
    id: string;
    title: string;
    subsections?: PageLayoutItem[];
};

export type Post = Omit<RawPost, 'advancedTitling' | 'tags' | 'sections'> & {
    advancedTitling: AdvancedTitling;
    tags: PostTag[];
    sections: SectionItem[];
    layout: PageLayoutItem[];
}

export type PostStats = Omit<PostStatistic, keyof CommonDocProperties>;

export type UserRating = 'likes' | 'dislikes' | null;

export type UserPostActions = {
    isViewed: boolean;
    rating: UserRating;
}
