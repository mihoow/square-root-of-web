import { type PropsWithChildren } from 'react';
import { component } from '~/utils/component';
import { HashLink } from './Link';

export const PostSection = component<
    PropsWithChildren<{
        id: string;
        title: string;
        connector: (id: string, node: HTMLElement | null) => void;
    }>
>('PostSection', function ({ className, id, title, connector, children }) {
    return (
        <div
            id={id}
            className={this.mcn(className)}
            ref={(node) => connector(id, node)}
        >
            <h2>
                <HashLink
                    id={id}
                    className={this.cn('relative not-prose group')}
                >
                    {title}
                    <span
                        className={this.cn(
                            'absolute top-1/2 -left-9 -translate-y-1/2',
                            'opacity-0 group-hover:opacity-100 group-focus:opacity-100'
                        )}
                    >
                        <span
                            className={this.cn(
                                'w-7 h-7 mr-2 rounded-md border-2',
                                'flex items-center justify-center text-base text-gray-500 transition-colors',
                                'hover:border-gray-400 hover:text-gray-800',
                                'dark:border-gray-500 dark:text-gray-400 dark:hover:border-primary dark:hover:text-primary'
                            )}
                        >
                            #
                        </span>
                    </span>
                </HashLink>
            </h2>
            {children}
        </div>
    );
});
