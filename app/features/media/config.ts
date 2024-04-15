import type { BreakpointMatcher } from "./type"

export enum Breakpoint {
    XS = 'xs',
    SM = 'sm',
    MD = 'md',
    LG = 'lg',
    XL = 'xl',
    '2XL' = '2xl'
}

export enum BreakpointValue {
    XS = 375,
    SM = 640,
    MD = 768,
    LG = 1024,
    XL = 1280,
    '2XL' = 1536
}

export const BREAKPOINTS_IN_ORDER: Readonly<Breakpoint[]> = [
    Breakpoint.XS,
    Breakpoint.SM,
    Breakpoint.MD,
    Breakpoint.LG,
    Breakpoint.XL,
    Breakpoint["2XL"]
]


export const BREAKPOINT_MATCH_TO_TW_CLASS: Readonly<Record<BreakpointMatcher, string>> = {
    'lt:xs': 'block xs:hidden',
    "eq:xs": 'hidden xs:block sm:hidden',
    "gte:xs": "hidden xs:block",
    'lt:sm': 'block sm:hidden',
    "eq:sm": 'hidden sm:block md:hidden',
    "gte:sm": "hidden sm:block",
    'lt:md': 'block md:hidden',
    "eq:md": 'hidden md:block lg:hidden',
    "gte:md": "hidden md:block",
    'lt:lg': 'block lg:hidden',
    "eq:lg": 'hidden lg:block xl:hidden',
    "gte:lg": "hidden lg:block",
    'lt:xl': 'block xl:hidden',
    "eq:xl": 'hidden xl:block 2xl:hidden',
    "gte:xl": "hidden xl:block",
    'lt:2xl': 'block 2xl:hidden',
    "eq:2xl": 'hidden 2xl:block',
    "gte:2xl": "hidden 2xl:block",
}
