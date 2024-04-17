import { Badge } from 'flowbite-react/components/Badge';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Image } from '~/components/Image';
import { Link } from '@remix-run/react';
import type { PostTag } from '../type';
import { TAGS_CONFIG } from '../config';
import { component } from '~/utils/component';

type PostHeaderProps = {
    title: string;
    tags: PostTag[];
    created: string;
};

export const PostHeader = component<PostHeaderProps>(
    'PostHeader',
    function ({ className, title, tags, created }) {
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
                <div className={this.cn('mb-4 flex gap-3 not-prose')}>
                    <div className={this.cn('w-14 h-14 flex items-center justify-center bg-gray-700 rounded-full overflow-hidden')}>
                        <Image
                            source='/images/snap.png'
                            alt="author's face"
                            width={60}
                            height={43}
                            className={this.cn()}
                        />
                    </div>
                    <div className={this.cn('flex flex-col justify-between')}>
                        <span>
                            by{' '}
                            <Link
                                to='/'
                                className={this.cn('underline hover:text-primary')}
                            >
                                Michał Wieczorek
                            </Link>
                        </span>
                        <div className={this.cn('flex items-center gap-2')}>
                            <CalendarIcon className={this.cn('w-4 h-4')} />
                            <span className={this.cn('text-sm')}>
                                {new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date(created))}
                            </span>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
);
