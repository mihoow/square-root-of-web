import { Link, isRouteErrorResponse, useRouteError } from '@remix-run/react';

import { Button } from 'flowbite-react/components/Button';
import { ExternalLink } from '~/features/post/components/Link';
import { HomeIcon } from '@radix-ui/react-icons';
import { Image } from './Image';
import { component } from '~/utils/component';
import { image } from 'remix-utils/responses';

const DragonflyImage = component('DragonflyImage', function ({ className }) {
    const AUTHOR_LINK =
        'https://pixabay.com/users/storme22k-4337202/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7913415';
    const PROVIDER_LINK =
        'https://pixabay.com?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7913415';

    const imageClasses = [
        'w-full max-h-[50vh] object-cover',
        'sm:w-auto sm:max-h-[640px] sm:h-full',
        'md:max-h-none',
        '2xl:h-fit',
    ];

    return (
        <div className={this.mcn(className, 'relative', ...imageClasses)}>
            <Image
                source={['/images/dragonfly-mobile.jpg', '/images/dragonfly.jpg']}
                alt='dragonfly'
                className={this.cn(...imageClasses)}
            />
            <div
                className={this.cn(
                    'absolute top-0 left-0 px-1 py-1 bg-white border-2 border-t-0 border-l-0 rounded-ee-md',
                    'sm:px-3 sm:py-2',
                    'dark:bg-darkBackground dark:text-gray-200 dark:border-primary'
                )}
            >
                Image by{' '}
                <ExternalLink
                    to={AUTHOR_LINK}
                    className={this.cn('underline')}
                >
                    Storme
                </ExternalLink>{' '}
                from{' '}
                <ExternalLink
                    to={PROVIDER_LINK}
                    className={this.cn('underline')}
                >
                    Pixabay
                </ExternalLink>
            </div>
            <Button
                color='gray'
                as={ExternalLink}
                to='https://www.youtube.com/watch?v=edW30jsCy6M'
                className={this.cn('absolute bottom-2 right-2', 'sm:bottom-3 sm:bottom-3')}
            >
                Learn more about dragonflies
            </Button>
        </div>
    );
});

//  href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7913415"

export const ErrorPage = component('ErrorPage', function () {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        const { status, statusText, data } = error;

        return (
            <div
                className={this.mcn(
                    'min-h-[calc(100vh-48px)] flex flex-col',
                    'sm:flex-row',
                    'md:min-h-[calc(100vh-80px)]',
                    'xl:max-h-none xl:max-w-[1440px] xl:mx-auto xl:my-auto',
                    '2xl:items-center'
                )}
            >
                <aside className={this.cn('sm:basis-1/2 sm:shrink-0')}>
                    <DragonflyImage />
                </aside>
                <main className={this.cn('my-8 px-4', 'md:my-12 md:px-8', 'lg:my-24')}>
                    <div className={this.cn('prose dark:prose-invert')}>
                        <h1 className={this.cn('mb-6 flex flex-col items-center gap-1', 'md:items-start')}>
                            <span className={this.cn('text-8xl font-semibold text-gray-500 dark:text-red-400')}>
                                {status}
                            </span>
                            <span className={this.cn('text-center', 'md:text-left')}>{statusText}</span>
                        </h1>
                        {data && <p className={this.cn('mb-6 text-center', 'md:text-left')}>{data}</p>}
                    </div>
                    <Button
                        as={Link}
                        to='/'
                        prefetch='intent'
                        className={this.cn('mx-auto max-w-72', 'md:mx-0')}
                    >
                        <span className={this.cn('flex items-center gap-3')}>
                            <HomeIcon className={this.cn('w-5 h-5')} />
                            <span>Home</span>
                        </span>
                    </Button>
                </main>
            </div>
        );
    }

    if (error instanceof Error) {
        return (
            <div className={this.mcn('mt-10 px-4 w-fit mx-auto')}>
                <h1>Error</h1>
                <p>{error.message}</p>
                <p>The stack trace is:</p>
                <pre>{error.stack}</pre>
            </div>
        );
    }

    return (
        <div className={this.mcn()}>
            <h1>Unknown error</h1>
        </div>
    );
});
