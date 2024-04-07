//css should be imported as an side effect for Vite
import './styles/index.css';

import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import type { LinksFunction, MetaFunction } from '@remix-run/node';

import { Header } from './components/Header';

export const meta: MetaFunction = () => [
    { title: 'Welcome to RePay!' },
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
];

export const links: LinksFunction = () => {
    const icons = ['16x16', '32x32', '128x128', '180x180', '192x192'].map((size) => ({
        rel: 'icon',
        type: 'image/x-icon',
        sizes: size,
        href: `/favicons/favicon-${size}.ico`,
    }));

    return [...icons];
};

export default function App() {
    return (
        <html
            lang='en'
            className=''
        >
            <head>
                <Meta />
                <Links />
            </head>
            <body className='dark:bg-darkBackground'>
                <div>
                    <Header />
                    <Outlet />
                </div>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}
