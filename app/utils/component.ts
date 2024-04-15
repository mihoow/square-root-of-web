import type { MutableRefObject, ReactNode } from "react";
import { className, mod } from "./className";

import type { ClassArg } from "./className";
import { memo } from "react";

export type ComponentThis = { mcn: typeof className; cn: typeof className; mod: typeof mod };

export type ComponentRefType<R> = MutableRefObject<R> | ((value: R | null) => void);

export type ComponentProps<P = {}, R = never> = P & {
    className?: string;
    myRef?: ComponentRefType<R>;
}

export type PropsAreEqualFn<P, R> = (
    prevProps: Readonly<ComponentProps<P, R>>,
    nextProps: Readonly<ComponentProps<P, R>>
) => boolean;

export function component<
    P = {},
    R = HTMLDivElement
>(
    displayName: string,
    component: (
        this: ComponentThis,
        props: ComponentProps<P, R>
    ) => ReactNode,
    propsAreEqual?: PropsAreEqualFn<P, R>
) {
    const ComponentWithUtils = component.bind({
        mcn: (...classes: ClassArg[]) => className(displayName, ...classes),
        cn: className,
        mod
    })

    const MemoizedComponent = propsAreEqual
        ? memo(ComponentWithUtils, propsAreEqual)
        : memo(ComponentWithUtils)

    MemoizedComponent.displayName = displayName

    return MemoizedComponent
}
