import type { LoaderFunctionArgs, MetaDescriptor, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';

import { Breadcrumbs } from '~/features/post/components/Breadcrumbs';
import { Media } from '~/features/media/components/Media';
import { OnThisPage } from '~/features/post/components/OnThisPage';
import { PostHeader } from '~/features/post/components/PostHeader';
import { PostSection } from '~/features/post/components/PostSection';
import { SectionRenderer } from '~/features/post/components/SectionRenderer';
import type { ShouldRevalidateFunction } from '@remix-run/react';
import { component } from '~/utils/component';
import { getPostBySlug } from '~/features/post/service.server';
import { useLoaderData } from '@remix-run/react';
import { useSectionsObserver } from '~/features/post/hooks/useSectionsObserver';

export const loader = async ({ context: { payload }, params }: LoaderFunctionArgs) => {
    if (!('id' in params) || !params.id) {
        throw redirect('/404', { status: 404 });
    }

    const post = await getPostBySlug(payload, params.id);

    if (!post) {
        throw redirect('/404', { status: 404 });
    }

    return json({ post });
};

export const shouldRevalidate: ShouldRevalidateFunction = () => {
    // for now ensure the post is fetched only once (re-fetched only on refresh)
    return false
}

export const meta: MetaFunction<typeof loader> = ({ data, matches }) => {
    if (!data) {
        return [];
    }

    const {
        post: {
            advancedTitling: { metaTitle },
            meta: { description, keywords, author, allowSearchEngineIndexing },
            stats: { created },
            updatedAt,
        },
    } = data;

    const rootTitleDescriptor = matches.find(({ id }) => id === 'root')?.meta.find((item) => 'title' in item);
    const rootTitle = rootTitleDescriptor && 'title' in rootTitleDescriptor ? rootTitleDescriptor.title : '';

    const meta: MetaDescriptor[] = [
        { title: `${metaTitle}${rootTitle ? ` | ${rootTitle}` : ''}` },
        { name: 'robots', content: allowSearchEngineIndexing ? 'follow, index' : 'nofollow, noindex' },
        { name: 'dcterms.created', content: created },
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
            pageSlug,
            title,
            advancedTitling: { tabTitle },
            stats: { created, tags, totalViews },
            sections,
            layout,
        },
    } = useLoaderData<typeof loader>();

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
                    totalViews={totalViews}
                    created={created}
                />
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
