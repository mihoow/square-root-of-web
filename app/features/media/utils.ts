import { BREAKPOINTS_IN_ORDER, Breakpoint, BreakpointValue } from './config';
import type { BreakpointDescriptor, BreakpointMatcher, BreakpointMatches, BreakpointPrefix } from './type';

export function getWindowWidth(): number {
    const { innerWidth: windowWidth } = window;

    if (windowWidth) {
        return windowWidth;
    }

    const {
        documentElement: { clientWidth: documentWidth },
    } = document;

    if (documentWidth) {
        return documentWidth;
    }

    const {
        body: { clientWidth: bodyWidth },
    } = document;

    return bodyWidth || 0;
}

export function getCurrentBreakpoint(): BreakpointDescriptor | null {
    const windowWidth = getWindowWidth();

    switch (true) {
        case windowWidth >= BreakpointValue['2XL']:
            return { name: Breakpoint['2XL'], value: BreakpointValue['2XL'] };
        case windowWidth >= BreakpointValue.XL:
            return { name: Breakpoint.XL, value: BreakpointValue.XL };
        case windowWidth >= BreakpointValue.LG:
            return { name: Breakpoint.LG, value: BreakpointValue.LG };
        case windowWidth >= BreakpointValue.MD:
            return { name: Breakpoint.MD, value: BreakpointValue.MD };
        case windowWidth >= BreakpointValue.SM:
            return { name: Breakpoint.SM, value: BreakpointValue.SM };
        case windowWidth >= BreakpointValue.XS:
            return { name: Breakpoint.XS, value: BreakpointValue.XS };
        default:
            return null;
    }
}

export function matchesBreakpoint(matches: BreakpointMatches, currBreakpoint: Breakpoint | null): boolean {
    const matchesArr = matches.split(' ') as BreakpointMatcher[];

    return matchesArr.some((match) => {
        const [prefix, breakpoint] = match.split(':') as [BreakpointPrefix, Breakpoint];

        if (currBreakpoint === null && prefix === 'lt' && breakpoint === Breakpoint.XS) {
            return true;
        }

        if (breakpoint === currBreakpoint && (prefix === 'eq' || prefix === 'gte')) {
            return true;
        }

        const currBreakpointIndex = BREAKPOINTS_IN_ORDER.findIndex((br) => br === currBreakpoint);
        const breakpointIndex = BREAKPOINTS_IN_ORDER.findIndex((br) => br === breakpoint);

        if (prefix === 'lt') {
            return currBreakpointIndex < breakpointIndex;
        }

        return currBreakpointIndex > breakpointIndex;
    });
}
