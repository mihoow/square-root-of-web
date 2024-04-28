import { Fragment } from 'react';
import { HashLink } from './Link';
import type { PageLayoutItem } from '../type';
import type { PropsWithChildren } from 'react';
import { TriangleRightIcon } from '@radix-ui/react-icons';
import { component } from '~/utils/component';
import { useSearchParams } from '@remix-run/react';

type LinkItemProps = PropsWithChildren<
    Omit<PageLayoutItem, 'title'> & {
        currentHash: string;
    }
>;

const LinkItem = component<LinkItemProps>('LinkItem', function ({ className, id, subsections, currentHash, children }) {
    const isCurrent = id === currentHash || subsections?.some(({ id: subId }) => subId === currentHash);

    return (
        <HashLink
            id={id}
            className={this.mcn(
                className,
                'hover:underline',
                !isCurrent && 'hover:text-dark dark:hover:text-gray-100',
                isCurrent && 'text-primary'
            )}
        >
            {children}
        </HashLink>
    );
});

export const OnThisPage = component<{ layout: PageLayoutItem[] }>('OnThisPage', function ({ className, layout }) {
    const [searchParams] = useSearchParams();
    const currentHash = searchParams.get('hash') || '';

    return (
        <aside className={this.mcn(className, 'border-2 rounded-md overflow-auto')}>
            <h5
                className={this.cn(
                    'sticky top-0 mb-4 pl-6 pr-8 py-4',
                    'font-bold text-lg bg-white dark:bg-darkBackground border-b-2'
                )}
            >
                On this page:
            </h5>
            <ol className={this.cn('pl-6 pr-8 pb-4 flex flex-col gap-1')}>
                {layout.map(({ id, title, subsections }) => {
                    return (
                        <Fragment key={id}>
                            <li>
                                <LinkItem
                                    id={id}
                                    subsections={subsections}
                                    currentHash={currentHash}
                                >
                                    {title}
                                </LinkItem>
                            </li>
                            {subsections?.map(({ id, title }) => {
                                return (
                                    <li key={id}>
                                        <LinkItem
                                            id={id}
                                            className={this.cn('ml-3 flex gap-1 items-center')}
                                            currentHash={currentHash}
                                        >
                                            <TriangleRightIcon />
                                            <span>{title}</span>
                                        </LinkItem>
                                    </li>
                                );
                            })}
                        </Fragment>
                    );
                })}
            </ol>
        </aside>
    );
});
