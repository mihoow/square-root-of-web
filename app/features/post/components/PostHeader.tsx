import { Badge } from 'flowbite-react/components/Badge';
import { CalendarIcon } from '@radix-ui/react-icons';
import type { PostTag } from '../type';
import { TAGS_CONFIG } from '../config';
import { component } from '~/utils/component';
import { toRelativeTime } from '~/utils/relativeTime';
import { useHydrated } from 'remix-utils/use-hydrated';

type PostHeaderProps = {
    title: string;
    tags: PostTag[];
    publishedAt: string;
    updatedAt: string;
};

const DateInfo = component<Pick<PostHeaderProps, 'publishedAt' | 'updatedAt'>>(
    'DateInfo',
    function ({ className, publishedAt, updatedAt }) {
        const isHydrated = useHydrated()

        const publishedDate = new Date(publishedAt);
        const updatedDate = new Date(updatedAt);

        const wasUpdatedAfterBeingPublished = updatedDate.getTime() > publishedDate.getTime();

        return (
            <div className={this.mcn(className, 'flex items-center flex-wrap gap-2 text-sm')}>
                <CalendarIcon className={this.cn('w-4 h-4')} />
                <time dateTime={publishedDate.toISOString()}>
                    {new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(publishedDate)}
                </time>
                {(isHydrated && wasUpdatedAfterBeingPublished) && (
                    <span>
                        (updated{' '}
                        <time dateTime={updatedDate.toISOString()}>
                            {toRelativeTime(updatedDate, new Intl.RelativeTimeFormat('en-US'))}
                        </time>
                        )
                    </span>
                )}
            </div>
        );
    }
);

export const PostHeader = component<PostHeaderProps>(
    'PostHeader',
    function ({ className, title, tags, publishedAt, updatedAt }) {
        return (
            <header className={this.mcn(className, 'mb-[0.8em]')}>
                {tags.length > 0 && (
                    <ul className={this.cn('mb-6 not-prose flex items-center gap-3 flex-wrap')}>
                        {tags.map((tag) => {
                            const { label, color } = TAGS_CONFIG[tag];

                            return (
                                <li key={tag}>
                                    <Badge color={color}>{label}</Badge>
                                </li>
                            );
                        })}
                    </ul>
                )}
                <h1 className={this.cn('mb-4')}>{title}</h1>
                <DateInfo
                    publishedAt={publishedAt}
                    updatedAt={updatedAt}
                />
            </header>
        );
    }
);
