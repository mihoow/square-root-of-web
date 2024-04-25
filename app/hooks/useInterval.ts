import { useCallback, useEffect, useRef } from "react";

import { useMirrorRef } from "./useMirrorRef";

export function useInterval(callback: (id: NodeJS.Timeout | null) => void, ms: number | null) {
    const callbackRef = useMirrorRef(callback)
    const intervalId = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (ms === null) {
            return
        }

        if (ms === 0) {
            callbackRef.current(null)

            return
        }

        intervalId.current = setInterval(() => {
            callbackRef.current(intervalId.current)
        }, ms)

        return () => {
            if (intervalId.current) clearInterval(intervalId.current)
        }
    }, [callbackRef, ms])

    return {
        cancel: () => {
            if (intervalId.current) clearInterval(intervalId.current)
        }
    }
}