import type { BreakpointListener, BreakpointMatcher, BreakpointMatches } from '../type';

import { BREAKPOINT_MATCH_TO_TW_CLASS } from '../config';
import { useState, type PropsWithChildren, useEffect } from 'react';
import { component } from '~/utils/component';
import { useMedia } from '../contexts/Media.context';

type MediaProps = {
    match?: BreakpointMatches;
};

export const Media = component<PropsWithChildren<MediaProps>>('Media', function ({ className, match, children }) {
    const { isMatch, subscribe, unsubscribe, isSPAMode } = useMedia();
    const [shouldBeDisplayed, setShouldBeDisplayed] = useState(() => {
        if (isSPAMode && match) {
            return isMatch(match);
        }

        return true;
    });

    useEffect(() => {
        if (!isSPAMode || !match) {
            return
        }

        const listener: BreakpointListener = () => {
            setShouldBeDisplayed(isMatch(match))
        }

        subscribe(listener)

        return () => {
            unsubscribe(listener)
        }
    }, [isSPAMode, isMatch, match, subscribe, unsubscribe])

    if (!shouldBeDisplayed && isSPAMode) {
        return null;
    }

    const displayClasses = (isSPAMode || !match)
        ? ''
        : (match.split(' ') as BreakpointMatcher[]).map((el) => BREAKPOINT_MATCH_TO_TW_CLASS[el]).join(' ');

    return <div className={this.mcn(className, displayClasses, 'h-full')}>{children}</div>;
});
