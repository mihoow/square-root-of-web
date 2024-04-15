import { CalendarIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import type { PostStats, PostTag } from '../type';

import { Badge } from 'flowbite-react/components/Badge';
import { TAGS_CONFIG } from '../config';
import { component } from '~/utils/component';

type PostHeaderProps = {
    title: string;
} & PostStats;

export const PostHeader = component<PostHeaderProps>(
    'PostHeader',
    function ({ className, title, tags, totalViews, created }) {
        return (
            <header className={this.mcn(className, 'mb-[0.8em]')}>
                <h1 className={this.cn('mb-2')}>{title}</h1>
                <div className={this.cn('flex items-center gap-x-6 gap-y-4 flex-wrap')}>
                    {tags.length > 0 && (
                        <ul className={this.cn('not-prose flex items-center gap-3')}>
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
                    <div className={this.cn('flex items-center gap-2')}>
                        <EyeOpenIcon className={this.cn('w-4 h-4')} />
                        <span className={this.cn('text-sm')}>{totalViews}</span>
                    </div>
                    <div className={this.cn('flex items-center gap-2')}>
                        <CalendarIcon className={this.cn('w-4 h-4')} />
                        <span className={this.cn('text-sm')}>
                            {new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date(created))}
                        </span>
                    </div>
                </div>
            </header>
        );
    }
);
