import type { ArrayItem, Must, Override } from '~/types/util';
import type {
    AdvancedTitling as RawAdvancedTitling,
    CodePenData as RawCodePenData,
    Post as RawPost,
    PostStats as RawPostStats,
    QAItems as RawQAItems,
    QuestionsAndAnswersData as RawQuestionsAndAnswers,
    TextBlockData as RawTextBlock,
    YoutubeVideoData as RawYoutubeVideo
} from 'payload/generated-types';

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

export type PostStats = Must<RawPostStats>;

export type PostTag = ArrayItem<PostStats['tags']>;

export type PageLayoutItem = {
    id: string;
    title: string;
    subsections?: PageLayoutItem[];
};

export type Post = Omit<RawPost, 'advancedTitling' | 'stats' | 'sections'> & {
    advancedTitling: AdvancedTitling;
    stats: PostStats;
    sections: SectionItem[];
    layout: PageLayoutItem[];
}
