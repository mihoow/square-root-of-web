import { useEffect, useRef } from "react";

import type { MutableRefObject } from "react";

export function useMirrorRef<T>(value: T): MutableRefObject<T> {
    const valueRef = useRef(value)

    useEffect(() => {
        valueRef.current = value
    }, [value])

    return valueRef
}