import { createCookieSessionStorage, json } from '@vercel/remix'

import type { ActionFunctionArgs } from '@vercel/remix';
import type { Theme } from './config';
import { isTheme } from './utils';

const sessionSecret = process.env.SESSION_SECRET || 'UNSAFE_DEFAULT_SECRET';

const themeStorage = createCookieSessionStorage<{ theme: Theme }>({
    cookie: {
        name: 'sqrt_of_web_theme',
        secure: true,
        httpOnly: true,
        secrets: [sessionSecret],
        sameSite: 'lax',
        path: '/',
    },
});

export async function getThemeSession({ headers }: Request) {
    const session = await themeStorage.getSession(headers.get('Cookie'));

    return {
        getTheme() {
            const themeValue = session.get('theme');

            return isTheme(themeValue) ? themeValue : null;
        },
        setTheme(theme: Theme) {
            session.set('theme', theme);
        },
        commit() {
            return themeStorage.commitSession(session);
        },
    };
}

export const handleAction = async ({ request }: ActionFunctionArgs) => {
    const [themeSession, formData] = await Promise.all([
        getThemeSession(request),
        request.formData()
    ])
    const theme = formData.get('theme');

    if (!isTheme(theme)) {
        return json({
            ok: false,
            message: `theme value of ${theme} is not a valid theme`,
        });
    }

    themeSession.setTheme(theme);

    return json({ ok: true }, { headers: { 'Set-Cookie': await themeSession.commit() } });
};
