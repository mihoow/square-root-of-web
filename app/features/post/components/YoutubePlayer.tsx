import { ExternalLink } from './Link';
import { component } from '~/utils/component';

export const YoutubePlayer = component<{ videoId: string }>('YoutubePlayer', function ({ className, videoId }) {
    return (
        <section className={this.mcn(className)}>
            <p>
                <span className={this.cn('block')}>You can watch the complementary video, if it helps you:</span>
                <ExternalLink to={`https://www.youtube.com/watch?v=${videoId}`}>Open in a new tab</ExternalLink>
            </p>
            <div className={this.cn('w-full aspect-w-16 aspect-h-9')}>
                <iframe
                    className={this.cn('rounded-md')}
                    src={`https://www.youtube.com/embed/${videoId}`}
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    title='Embedded youtube'
                />
            </div>
        </section>
    );
});
