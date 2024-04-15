import type {
    BreakpointDescriptor,
    BreakpointListener,
    BreakpointMatcher,
    BreakpointMatches,
    BreakpointSubscriber,
    MediaContextType,
    MediaSubscriber,
} from '../type';
import { getCurrentBreakpoint, matchesBreakpoint } from '../utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { MediaContext } from './Media.context';
import type { PropsWithChildren } from 'react';
import { component } from '~/utils/component';
import { useLocation } from '@remix-run/react';
import { useMirrorRef } from '~/hooks/useMirrorRef';
import { usePrevious } from '~/hooks/usePrevious';

const DetectLocationChange = component<{ onChange: VoidFunction }>('DetectLocationChange', function ({ onChange }) {
    const { pathname } = useLocation();
    const prevPathname = usePrevious(pathname);
    const onChangeRef = useMirrorRef(onChange);

    useEffect(() => {
        if (prevPathname && prevPathname !== pathname) {
            onChangeRef.current();
        }
    }, [pathname, prevPathname, onChangeRef]);

    return null;
});

export const MediaProvider = component<PropsWithChildren>('MediaProvider', function ({ children }) {
    const [isSPAMode, setIsSPAMode] = useState(false);
    const subscribersRef = useRef<BreakpointListener[]>([]);
    const currBreakpointRef = useRef<BreakpointDescriptor | null>(null);
    const currMatchesRef = useRef<Partial<Record<BreakpointMatcher, boolean>>>({});

    const isMatch = useCallback((matches: BreakpointMatches) => {
        const { current: currBreakpoint } = currBreakpointRef;
        const breakpointName = currBreakpoint?.name || null;
        const { current: currMatches } = currMatchesRef;

        const matchesArr = matches.split(' ') as BreakpointMatcher[];

        return matchesArr.some((match) => {
            if (!(match in currMatches)) {
                currMatches[match] = matchesBreakpoint(match, breakpointName);
            }

            return currMatches[match];
        });
    }, []);

    useEffect(() => {
        const listener = () => {
            const { current: currBreakpoint } = currBreakpointRef;
            const nextBreakpoint = getCurrentBreakpoint();

            if (currBreakpoint === nextBreakpoint) {
                return;
            }

            currBreakpointRef.current = nextBreakpoint;
            currMatchesRef.current = {};

            const { current: subscribers } = subscribersRef;
            subscribers.forEach((callback) => callback(nextBreakpoint));
        };

        listener();
        window.addEventListener('resize', listener);

        return () => {
            window.removeEventListener('resize', listener);
        };
    }, [isMatch]);

    const subscribe: BreakpointSubscriber = useCallback((callback) => {
        subscribersRef.current.push(callback);
    }, []);

    const unsubscribe: BreakpointSubscriber = useCallback((callback) => {
        subscribersRef.current = subscribersRef.current.filter((exCallback) => {
            return callback !== exCallback;
        });
    }, []);

    const memoizedValue: MediaContextType = useMemo(
        () => ({
            isMatch,
            subscribe,
            unsubscribe,
            isSPAMode
        }),
        [isMatch, subscribe, unsubscribe, isSPAMode]
    );

    return (
        <MediaContext.Provider value={memoizedValue}>
            {!isSPAMode && <DetectLocationChange onChange={() => setIsSPAMode(true)} />}
            {children}
        </MediaContext.Provider>
    );
});
