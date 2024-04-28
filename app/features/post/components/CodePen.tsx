import { useState, type IframeHTMLAttributes } from 'react';
import { component } from '~/utils/component';
import { useTheme } from '~/features/theme/contexts/Theme.context';
import { ExternalLink } from './Link';

type EditorTab = 'html' | 'css' | 'js';

type Identifiers = {
    codePenUrl: string;
    penId: string;
}

type CodePenProps = Identifiers & {
    title: string;
    height?: number | null;
    iframeLoading?: IframeHTMLAttributes<HTMLIFrameElement>['loading'];
    isClickToLoad?: boolean;
    isEditable?: boolean;
    defaultTab?: EditorTab | null;
    isResultVisibleByDefault?: boolean;
};

const IframeFallback = component<Identifiers>(
    'IframeFallback',
    function ({ className, codePenUrl, penId }) {
        return (
            <div className={this.mcn(className)}>
                See the Pen{' '}
                <ExternalLink to={`${codePenUrl}/pen/${penId}`}>
                    Check if JavaScript value is of expected type
                </ExternalLink>{' '}
                by Michał Wieczorek (<ExternalLink to={codePenUrl}>@sqrt-of-web</ExternalLink>) on{' '}
                <ExternalLink to='https://codepen.io'>CodePen</ExternalLink>.
            </div>
        );
    }
);

export const CodePen = component<CodePenProps>(
    'CodePen',
    function ({
        className,
        codePenUrl,
        penId,
        height,
        title,
        iframeLoading = 'lazy',
        isClickToLoad = true,
        isEditable = false,
        defaultTab = 'js',
        isResultVisibleByDefault = true,
    }) {
        const [isLoadingError, setIsLoadingError] = useState(false);
        const [theme] = useTheme();

        const fullUrl = (() => {
            const url = `${codePenUrl}/embed/${isClickToLoad ? 'preview/' : ''}${penId}`;

            const searchParams = new URLSearchParams();

            if (isEditable) {
                searchParams.set('editable', 'true');
            }

            if (theme) {
                searchParams.set('theme-id', theme);
            }

            const defaultTabs = [defaultTab, isResultVisibleByDefault && 'result'].filter((val) => !!val);

            if (defaultTabs.length > 0) {
                searchParams.set('default-tab', defaultTabs.join(','));
            }

            return `${url}?${searchParams.toString()}`;
        })();

        if (isLoadingError) {
            return (
                <IframeFallback
                    codePenUrl={codePenUrl}
                    penId={penId}
                />
            );
        }

        return (
            <iframe
                title={title}
                src={fullUrl}
                loading={iframeLoading}
                allowFullScreen
                height={height ? height : undefined}
                className={this.mcn(className, 'w-full', !height && 'h-[calc(100vh-5.5rem)] md:h-[calc(100vh-7rem)]')}
                onError={() => setIsLoadingError(true)}
            />
        );
    }
);

export default CodePen;
