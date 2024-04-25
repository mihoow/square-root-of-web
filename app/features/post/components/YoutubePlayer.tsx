import { useRef, useState } from 'react';

import { ExternalLink } from './Link';
import { component } from '~/utils/component';
import { useInterval } from '~/hooks/useInterval';

export const YoutubePlayer = component<{ videoId: string; thumbnailUrl: string }>(
    'YoutubePlayer',
    function ({ className, videoId, thumbnailUrl }) {
        const iframeRef = useRef<HTMLIFrameElement>(null)
        const [isLoaded, setIsLoaded] = useState(false)

        const interval = useInterval((intervalId) => {
            const { current: iframe } = iframeRef

            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const _doc = iframe?.contentWindow?.document
            } catch (error) {
                // CORS are blocking access to iframe document, so once accessing it throws an error you can know it's loaded
                if (intervalId) clearInterval(intervalId)
                setIsLoaded(true);
            }
        }, 100)

        const handleIframeLoaded = () => {
            interval.cancel()
            setIsLoaded(true)
        }

        return (
            <section className={this.mcn(className)}>
                <p>
                    <span className={this.cn('block')}>You can watch the complementary video, if it helps you:</span>
                    <ExternalLink to={`https://www.youtube.com/watch?v=${videoId}`}>Open in a new tab</ExternalLink>
                </p>
                <div
                    className={this.cn('w-full aspect-w-16 aspect-h-9 bg-repeat bg-cover')}
                    style={{ backgroundImage: `url(${thumbnailUrl})` }}
                >
                    <iframe
                        ref={iframeRef}
                        className={this.cn('rounded-md transition-opacity', isLoaded ? 'opacity-100' : 'opacity-0')}
                        src={`https://www.youtube.com/embed/${videoId}`}
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                        title='Embedded youtube'
                        loading='lazy'
                        onLoad={handleIframeLoaded}
                    />
                </div>
            </section>
        );
    }
);
