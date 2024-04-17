import type { ActionFunctionArgs, LoaderFunctionArgs, MetaDescriptor, MetaFunction } from '@remix-run/node';
import { Await, useFetcher, useLoaderData } from '@remix-run/react';
import { PostActions, PostActionsFallback } from '~/features/post/components/PostActions';
import { Suspense, useEffect } from 'react';
import { defer, json, redirect } from '@remix-run/node';
import {
    getPostStats,
    getUserActions,
    incrementViewsCount,
    updateUserRating,
} from '~/features/post/services/postStats.server';

import { Breadcrumbs } from '~/features/post/components/Breadcrumbs';
import { Media } from '~/features/media/components/Media';
import { OnThisPage } from '~/features/post/components/OnThisPage';
import { PostHeader } from '~/features/post/components/PostHeader';
import { PostSection } from '~/features/post/components/PostSection';
import { SectionRenderer } from '~/features/post/components/SectionRenderer';
import type { ShouldRevalidateFunction } from '@remix-run/react';
import { TimeInMs } from '~/config/util';
import type { UpdateFunctionArgs } from '~/features/post/services/postStats.server';
import type { UserRating } from '~/features/post/type';
import { component } from '~/utils/component';
import { getPostBySlug } from '~/features/post/services/fetchPost.server';
import { isUserRating } from '~/features/post/utils';
import { namedAction } from 'remix-utils/named-action';
import { useMirrorRef } from '~/hooks/useMirrorRef';
import { useSectionsObserver } from '~/features/post/hooks/useSectionsObserver';

export const loader = async ({ request, context: { payload }, params }: LoaderFunctionArgs) => {
    if (!('id' in params) || !params.id) {
        throw redirect('/404', { status: 404 });
    }

    const post = await getPostBySlug(payload, params.id);

    if (!post) {
        throw redirect('/404', { status: 404 });
    }

    return defer({
        post,
        postStats: getPostStats(payload, post.id),
        userActions: getUserActions(request, post.id),
    });
};

export const shouldRevalidate: ShouldRevalidateFunction = () => {
    // for now ensure the post is fetched only once (re-fetched only on refresh)
    return false;
};

export const meta: MetaFunction<typeof loader> = ({ data, matches }) => {
    if (!data) {
        return [];
    }

    const {
        post: {
            createdAt,
            advancedTitling: { metaTitle },
            meta: { description, keywords, author, allowSearchEngineIndexing },
            updatedAt,
        },
    } = data;

    const rootTitleDescriptor = matches.find(({ id }) => id === 'root')?.meta.find((item) => 'title' in item);
    const rootTitle = rootTitleDescriptor && 'title' in rootTitleDescriptor ? rootTitleDescriptor.title : '';

    const meta: MetaDescriptor[] = [
        { title: `${metaTitle}${rootTitle ? ` | ${rootTitle}` : ''}` },
        { name: 'robots', content: allowSearchEngineIndexing ? 'follow, index' : 'nofollow, noindex' },
        { name: 'dcterms.created', content: createdAt },
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
        post: {
            id,
            createdAt,
            pageSlug,
            title,
            advancedTitling: { tabTitle },
            tags,
            sections,
            layout,
        },
        postStats,
        userActions,
    } = useLoaderData<typeof loader>();
    const fetcherRef = useMirrorRef(useFetcher());
    const userActionsRef = useMirrorRef(userActions);

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            const { isViewed } = await userActionsRef.current;

            if (isViewed) {
                return;
            }

            fetcherRef.current.submit(
                { intent: 'incrementViewsCount', postId: id },
                { method: 'PATCH', preventScrollReset: true }
            );
        }, 20 * TimeInMs.SECOND);

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
                    title={tabTitle}
                    mainTag={tags[0]}
                />
                <PostHeader
                    title={title}
                    tags={tags}
                    created={createdAt}
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

export const action = async ({ request, context: { payload } }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const postId = formData.get('postId');

    if (typeof postId !== 'string') {
        return json({ ok: false });
    }

    const args: UpdateFunctionArgs = {
        request,
        payload,
        postId,
    };

    return namedAction(formData, {
        async incrementViewsCount() {
            const response = await incrementViewsCount(args);

            return json(response);
        },
        async updateUserRating() {
            const rating = formData.get('rating') || null

            if (!isUserRating(rating)) {
                return json({ ok: false })
            }

            const response = await updateUserRating(args, rating);

            return json(response);
        },
    });
};
