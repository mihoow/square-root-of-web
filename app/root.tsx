//css should be imported as an side effect for Vite
import './styles/index.css';

import { Links, Meta, Outlet, Scripts, ScrollRestoration, json, useLoaderData } from '@remix-run/react';
import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';

import { APP_NAME } from './config/misc';
import { Header } from './components/Header';
import { HoneypotProvider } from 'remix-utils/honeypot/react';
import { MediaProvider } from './features/media/contexts/Media.provider';
import { Theme } from './features/theme/config';
import { ThemeProvider } from './features/theme/contexts/Theme.provider';
import { getThemeSession } from './features/theme/service.server';
import { honeypot } from './services/honeypot.server';
import { useTheme } from './features/theme/contexts/Theme.context';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const themeSession = await getThemeSession(request);

    return json({
        theme: themeSession.getTheme(),
        honeypotInputProps: honeypot.getInputProps(),
    });
};

export const meta: MetaFunction<typeof loader> = () => {
    return [
        { title: APP_NAME },
        { name: 'description', content: 'The learning platform about the web development and more' },
        { name: 'keywords', content: ['web', 'web development', 'JavaScript', 'JS', 'react', 'course'].join(', ') },
    ];
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
    const { honeypotInputProps } = useLoaderData<typeof loader>();
    const [theme] = useTheme();

    return (
        <html
            lang='en'
            className={theme || ''}
        >
            <head>
                <meta charSet='utf-8' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                { theme && (<meta name='color-scheme' content={ theme === Theme.LIGHT  ? 'light dark' : 'dark light' } />) }
                <Meta />
                <Links />
            </head>
            <body className='dark:bg-darkBackground'>
                <HoneypotProvider {...honeypotInputProps}>
                    <div>
                        <Header />
                        <Outlet />
                    </div>
                </HoneypotProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function Root() {
    const { theme } = useLoaderData<typeof loader>();

    return (
        <MediaProvider>
            <ThemeProvider themeFromCookie={theme}>
                <App />
            </ThemeProvider>
        </MediaProvider>
    );
}
