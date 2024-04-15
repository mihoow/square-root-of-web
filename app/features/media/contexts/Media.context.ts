import { createContext, useContext } from 'react';

import type { MediaContextType } from '../type';

export const MediaContext = createContext<MediaContextType | null>(null);

export function useMedia() {
    const ctx = useContext(MediaContext);

    if (!ctx) {
        throw new Error('App needs to be inside Media provider');
    }

    return ctx;
}
