import { PREFERS_DARK_MODE, Theme } from "../config";
import type { ThemeContextType } from "./Theme.context";
import { ThemeContext } from "./Theme.context";
import { getPreferredTheme, isTheme } from "../utils";
import { useEffect, useMemo, useState } from "react";

import type { PropsWithChildren } from "react";
import { component } from "~/utils/component";
import { useFetcher } from "@remix-run/react";
import { useMirrorRef } from "~/hooks/useMirrorRef";

type ProviderProps = PropsWithChildren<{ themeFromCookie: Theme | null; }>

export const ThemeProvider = component<ProviderProps>('ThemeProvider', function({ themeFromCookie, children }) {
    const [theme, setTheme] = useState<Theme | null>(() => {
        if (isTheme(themeFromCookie)) {
            return themeFromCookie;
        }

        return null
    })
    const themeFetcherRef = useMirrorRef(useFetcher())

    useEffect(() => {
        setTheme(getPreferredTheme())
    }, [])

    useEffect(() => {
        if (themeFromCookie === theme) {
            return
        }

        const { current: themeFetcher } = themeFetcherRef
        const formData = new FormData()
        formData.set('theme', theme || '')

        themeFetcher.submit(formData, {
            action: 'action/set-theme',
            method: 'POST',
            preventScrollReset: true
        })
    }, [themeFromCookie, theme, themeFetcherRef])

    useEffect(() => {
        const mediaQuery = window.matchMedia(PREFERS_DARK_MODE)

        const listener = () => {
            setTheme(getPreferredTheme())
        }

        mediaQuery.addEventListener('change', listener)

        return () => {
            mediaQuery.removeEventListener('change', listener)
        }
    }, [])

    const memoizedValue: ThemeContextType = useMemo(() => [
        theme,
        () => setTheme((prevTheme) => prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)
    ], [theme])

    return (
        <ThemeContext.Provider value={memoizedValue}>
            {children}
        </ThemeContext.Provider>
    )
})
