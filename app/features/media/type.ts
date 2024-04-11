import type { Breakpoint, BreakpointValue } from "./config";

export type BreakpointDescriptor = {
    name: Breakpoint;
    value: BreakpointValue;
};

export type BreakpointPrefix = 'lt' | 'eq' | 'gte';

export type BreakpointMatcher = `${BreakpointPrefix}:${Breakpoint}`;

export type BreakpointMatches =
    | BreakpointMatcher
    | `${BreakpointMatcher} ${BreakpointMatcher}`
    | `${BreakpointMatcher} ${BreakpointMatcher} ${BreakpointMatcher}`;

export type BreakpointListener = (descriptor: BreakpointDescriptor | null) => void;

export type BreakpointSubscriber = (callback: BreakpointListener) => void;

export type MediaContextType = {
    isMatch: (matches: BreakpointMatches) => boolean;
    subscribe: BreakpointSubscriber;
    unsubscribe: BreakpointSubscriber;
    isSPAMode: boolean;
};