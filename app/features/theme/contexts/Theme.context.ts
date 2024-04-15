import { createContext, useContext } from "react";

import type { Theme } from "../config";

export type ThemeContextType = [Theme | null, () => void];

export const ThemeContext = createContext<ThemeContextType | null>(null)

export function useTheme(): ThemeContextType {
    const ctx = useContext(ThemeContext)

    if (!ctx) {
        throw new Error('The app needs to be inside ThemeProvider')
    }

    return ctx
}
