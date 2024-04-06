import type { LoaderFunctionArgs } from '@remix-run/node';
import { component } from '~/utils/component';
import { json } from '@remix-run/server-runtime';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ context: { payload } }: LoaderFunctionArgs) => {
    const users = await payload.find({
        collection: 'users',
    });

    return json({ userCount: users.totalDocs }, { status: 200 });
};

export default component('HomePage', function () {
    const { userCount } = useLoaderData<typeof loader>();
    console.log(userCount);

    return (
        <div className={this.mcn('my-6 contain prose dark:prose-invert')}>
            <h1>Welcome to RePay</h1>
            <p>Hello, this is some test text</p>
            <ul className='list-disc'>
                <li>
                    <a
                        target='_blank'
                        href='/admin'
                        rel='noreferrer'
                    >
                        Admin Interface
                    </a>
                </li>
                <li>
                    <a
                        target='_blank'
                        href='https://remix.run/docs'
                        rel='noreferrer'
                    >
                        Remix Docs
                    </a>
                </li>
                <li>
                    <a
                        target='_blank'
                        href='https://payloadcms.com/docs'
                        rel='noreferrer'
                    >
                        Payload Docs
                    </a>
                </li>
            </ul>
        </div>
    );
});
