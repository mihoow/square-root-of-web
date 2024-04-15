import { Breadcrumb } from 'flowbite-react/components/Breadcrumb';
import { HomeIcon } from '@radix-ui/react-icons';
import { Link } from '@remix-run/react';
import type { PostTag } from '../type';
import { TAGS_CONFIG } from '../config';
import { component } from '~/utils/component';

type BreadcrumbsProps = {
    mainTag?: PostTag;
    pageSlug: string;
    title: string;
};

export const Breadcrumbs = component<BreadcrumbsProps>('Breadcrumbs', function ({ className, mainTag, pageSlug, title }) {
    const data = [
        { link: '/', content: <HomeIcon className={this.cn('w-4 h-4')} /> },
        { link: '/posts', content: 'Posts' },
    ];

    if (mainTag) {
        data.push({
            link: `/posts/${mainTag}`,
            content: TAGS_CONFIG[mainTag].label
        })
    }

    data.push({
        link: `/posts/${pageSlug}`,
        content: title
    })

    return (
        <Breadcrumb className={this.mcn(className)}>
            {data.map(({ link, content }, index) => {
                const isLast = index === data.length - 1;

                return (
                    <Breadcrumb.Item key={link}>
                        {isLast ? (
                            content
                        ) : (
                            <Link
                                to={link}
                                prefetch='intent'
                                className={this.cn('text-black dark:text-white hover:text-primary')}
                            >
                                {content}
                            </Link>
                        )}
                    </Breadcrumb.Item>
                );
            })}
        </Breadcrumb>
    );
});
