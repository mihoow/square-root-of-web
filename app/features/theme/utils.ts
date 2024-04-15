import { PREFERS_DARK_MODE, THEMES, Theme } from './config';

export function isTheme(theme: unknown): theme is Theme {
    return typeof theme === 'string' && THEMES.includes(theme as Theme);
}

export function getPreferredTheme(): Theme {
    return window.matchMedia(PREFERS_DARK_MODE).matches ? Theme.DARK : Theme.LIGHT;
}
