export enum Theme {
    DARK = 'dark',
    LIGHT = 'light'
}

export const THEMES: Readonly<Theme[]> = Object.values(Theme);

export const PREFERS_DARK_MODE = "(prefers-color-scheme: dark)";
