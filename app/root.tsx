//css should be imported as an side effect for Vite
import './styles/index.css';

import { Links, Meta, Outlet, Scripts, ScrollRestoration, json, useLoaderData } from '@remix-run/react';
import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';

import { Header } from './components/Header';
import { Theme } from './features/theme/config';
import { ThemeProvider } from './features/theme/contexts/Theme.provider';
import { getThemeSession } from './features/theme/service.server';
import { useTheme } from './features/theme/contexts/Theme.context';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const themeSession = await getThemeSession(request);

    return json({
        theme: themeSession.getTheme(),
    });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    const defaultMeta = [
        { title: 'Welcome to RePay!' },
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ]

    if (!data?.theme) {
        return defaultMeta
    }

    return [
        ...defaultMeta,
        { name: 'color-scheme', content: data.theme === 'light' ? 'light dark' : 'dark light' }
    ]
};

export const links: LinksFunction = () => {
    const icons = ['16x16', '32x32', '128x128', '180x180', '192x192'].map((size) => ({
        rel: 'icon',
        type: 'image/x-icon',
        sizes: size,
        href: `/favicons/favicon-${size}.ico`,
    }));

    return [...icons];
};

function App() {
    const [theme] = useTheme()

    return (
        <html
            lang='en'
            className={ theme === Theme.DARK ? 'dark' : '' }
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

export default function Root() {
    const { theme } = useLoaderData<typeof loader>();

    return (
        <ThemeProvider themeFromCookie={theme}>
            <App />
        </ThemeProvider>
    );
}
