import { APP_NAME, TimeInSeconds } from '~/config/misc';
import type {
    ActionFunctionArgs,
    HeadersFunction,
    LoaderFunctionArgs,
    MetaDescriptor,
    MetaFunction,
} from '@remix-run/node';
import { ActionType, TIME_TO_INCREASE_VIEWS } from '~/features/post/config';
import { Await, useFetcher, useLoaderData } from '@remix-run/react';
import {
    DebugResponse,
    InvalidParamsResponse,
    NotAllowedResponse,
    NotFoundResponse,
    UnknownErrorResponse,
} from '~/features/post/services/errorResponse.server';
import { PostActions, PostActionsFallback } from '~/features/post/components/PostActions';
import { Suspense, useEffect } from 'react';
import { defer, json } from '@remix-run/node';
import { incrementViewsCount, updateUserRating } from '~/features/post/services/postStats.server';
import { isAdmin, isDevelopment, isError, isErrorResponse } from '~/services/util.server';

import { Breadcrumbs } from '~/features/post/components/Breadcrumbs';
import { ErrorPage } from '~/components/ErrorPage';
import { Media } from '~/features/media/components/Media';
import { OnThisPage } from '~/features/post/components/OnThisPage';
import { PostHeader } from '~/features/post/components/PostHeader';
import { PostSection } from '~/features/post/components/PostSection';
import { SectionRenderer } from '~/features/post/components/SectionRenderer';
import type { ShouldRevalidateFunction } from '@remix-run/react';
import type { UpdateFunctionArgs } from '~/features/post/services/postStats.server';
import { cacheConfig } from '~/features/post/services/cache.server';
import { cacheControl } from '~/services/cacheControl.server';
import { component } from '~/utils/component';
import { honeypot } from '~/services/honeypot.server';
import { isExpectedObject } from '~/utils/misc';
import { isUserRating } from '~/features/post/utils';
import { isbot } from 'isbot';
import { namedAction } from 'remix-utils/named-action';
import { useCachedData } from '~/hooks/useCachedData';
import { useMirrorRef } from '~/hooks/useMirrorRef';
import { useSectionsObserver } from '~/features/post/hooks/useSectionsObserver';

export const loader = async ({ request, context: { payload, cache, redis, user }, params }: LoaderFunctionArgs) => {
    if (!('id' in params) || !params.id) {
        throw new InvalidParamsResponse();
    }

    try {
        const postCache = cache.configure(cacheConfig);
        const post = await postCache.get('post', { payload, slug: params.id });

        if (!post) {
            throw new NotFoundResponse();
        }

        const { id: postId, title } = post;

        if (post._status === 'draft' && !isAdmin(user)) {
            throw new NotAllowedResponse(title);
        }

        return defer(
            {
                post,
                postStats: postCache.get('postStats', { payload, postId }),
                userActions: postCache.get('userActions', { request, redis, postId }),
            },
            {
                headers: {
                    'Cache-Control': cacheControl({
                        public: true,
                        "max-age": 5 * TimeInSeconds.MINUTE,
                        "s-maxage": TimeInSeconds.HOUR,
                        "stale-while-revalidate": TimeInSeconds.DAY,
                        "stale-if-error": TimeInSeconds.DAY
                    })
                },
            }
        );
    } catch (error) {
        if (isErrorResponse(error)) {
            throw error;
        }

        if (isDevelopment() && isError(error)) {
            throw new DebugResponse(error.message);
        }

        throw new UnknownErrorResponse();
    }
};

export const action = async ({ request, context: { payload, redis, cache } }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const postId = formData.get('postId');
    const postCache = cache.configure(cacheConfig)

    if (typeof postId !== 'string') {
        return json({ ok: false });
    }

    const args: UpdateFunctionArgs = {
        request,
        payload,
        redis,
        postId,
    };

    return namedAction(formData, {
        [ActionType.INCREMENT_VIEWS_COUNT]: async () => {
            const response = await incrementViewsCount(args);

            if (response.ok) {
                // Normally payload API invalidates cache automatically,
                // here we use mongoose API instead so it's needed to do it manually
                await postCache.invalidate('postStats', { payload, postId })
            }

            return json(response);
        },
        [ActionType.UPDATE_USER_RATING]: async () => {
            try {
                honeypot.check(formData);

                const rating = formData.get('rating') || null;

                if (!isUserRating(rating)) {
                    return json({ ok: false });
                }

                const response = await updateUserRating(args, rating);

                if (response.ok) {
                    await postCache.invalidate('postStats', { payload, postId })
                }

                return json(response);
            } catch (error) {
                return json({ ok: false });
            }
        }
    });
};

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
    'Cache-Control': loaderHeaders.get('Cache-Control')!,
});

export const shouldRevalidate: ShouldRevalidateFunction = ({ actionResult }) => {
    return isExpectedObject(actionResult, { ok: true });
};

export const meta: MetaFunction<typeof loader> = ({ data, matches }) => {
    if (!data) {
        return [];
    }

    const {
        post: {
            publishedAt,
            advancedTitling: { metaTitle },
            meta: { description, keywords, author, allowSearchEngineIndexing },
            updatedAt,
        },
    } = data;

    const meta: MetaDescriptor[] = [
        { title: `${metaTitle} | ${APP_NAME}` },
        { name: 'robots', content: allowSearchEngineIndexing ? 'follow, index' : 'nofollow, noindex' },
        { name: 'dcterms.created', content: publishedAt },
        { name: 'dcterms.modified', content: updatedAt },
    ];

    if (description) {
        meta.push({ name: 'description', content: description });
    }

    if (keywords && keywords.length > 0) {
        meta.push({ name: 'keywords', content: keywords.join(', ') });
    }

    if (author) {
        meta.push({ name: 'author', content: author });
    }

    return meta;
};

export default component('PostPage', function () {
    const {
        post,
        postStats,
        userActions,
    } = useLoaderData<typeof loader>();
    const {
        id,
        publishedAt,
        updatedAt,
        pageSlug,
        title,
        advancedTitling: { breadcrumbTitle },
        tags,
        sections,
        layout,
    } = useCachedData(post)
    const fetcherRef = useMirrorRef(useFetcher());
    const userActionsRef = useMirrorRef(userActions);

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (isbot(navigator.userAgent)) {
                return;
            }

            const { isViewed } = await userActionsRef.current;

            if (isViewed) {
                return;
            }

            fetcherRef.current.submit(
                { intent: ActionType.INCREMENT_VIEWS_COUNT, postId: id },
                { method: 'PATCH', preventScrollReset: true }
            );
        }, TIME_TO_INCREASE_VIEWS);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [userActionsRef, fetcherRef, id]);

    const connectToSection = useSectionsObserver(layout);

    return (
        <main className={this.mcn('my-10 contain prose dark:prose-invert')}>
            <div className={this.cn('max-w-[768px] mx-auto')}>
                <Breadcrumbs
                    className={this.cn('not-prose mb-7')}
                    pageSlug={pageSlug}
                    title={breadcrumbTitle}
                    mainTag={tags[0]}
                />
                <PostHeader
                    title={title}
                    tags={tags}
                    publishedAt={publishedAt}
                    updatedAt={updatedAt}
                />
                <Suspense fallback={<PostActionsFallback />}>
                    <Await resolve={Promise.all([postStats, userActions])}>
                        {([{ totalViews, likes, dislikes }, { rating }]) => (
                            <PostActions
                                postId={id}
                                totalViews={totalViews}
                                likes={likes}
                                dislikes={dislikes}
                                userRating={rating}
                            />
                        )}
                    </Await>
                </Suspense>
                {sections.map((sectionData) => {
                    const { sectionId, title: sectionTitle } = sectionData;

                    return (
                        <PostSection
                            key={sectionId}
                            id={sectionId}
                            title={sectionTitle}
                            connector={connectToSection}
                        >
                            <SectionRenderer
                                data={sectionData}
                                connectToSection={connectToSection}
                            />
                        </PostSection>
                    );
                })}
                <Media match='gte:xl'>
                    <OnThisPage
                        className={this.cn(
                            'fixed top-[80px] mt-10 left-[calc((100vw-752px)/2+752px)] not-prose',
                            'xl:mx-6',
                            '2xl:ml-16'
                        )}
                        layout={layout}
                    />
                </Media>
            </div>
        </main>
    );
});

export const ErrorBoundary = ErrorPage;
