import { isCodePen, isQA, isTextBlock, isYoutubeVideo } from '../utils';

import CodePen from './CodePen';
import { HTMLParser } from '~/components/HTMLParser';
import { QuestionsAndAnswers } from './QA';
import type { SectionItem } from '../type';
import { YoutubePlayer } from './YoutubePlayer';
import { component } from '~/utils/component';

type SectionRendererProps = {
    data: SectionItem;
    connectToSection: (id: string, node: HTMLElement | null) => void;
};

export const SectionRenderer = component<SectionRendererProps>('SectionRenderer', function ({ className, data, connectToSection }) {
    if (isTextBlock(data)) {
        const { content } = data;

        return (
            <HTMLParser
                className={this.mcn(className)}
                content={content}
            />
        );
    }

    if (isYoutubeVideo(data)) {
        const { videoId } = data;

        return <YoutubePlayer videoId={videoId} />;
    }

    if (isQA(data)) {
        const { sectionId, items } = data;

        return (
            <QuestionsAndAnswers
                id={sectionId}
                connectToSection={connectToSection}
                items={items}
            />
        );
    }

    if (isCodePen(data)) {
        const { codePenUrl, penId, penTitle, iframeLazyLoading, clickToLoad, editable, defaultTab, showResultInitially } = data;

        return (
            <CodePen
                codePenUrl={codePenUrl}
                penId={penId}
                title={penTitle}
                iframeLoading={iframeLazyLoading ? 'lazy' : 'eager'}
                isClickToLoad={clickToLoad}
                isEditable={editable}
                defaultTab={defaultTab}
                isResultVisibleByDefault={showResultInitially}
            />
        );
    }

    return null;
});
