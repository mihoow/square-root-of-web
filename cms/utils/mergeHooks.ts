import type { CollectionConfig } from "payload/types";

type CollectionHooks = Exclude<CollectionConfig['hooks'], undefined>

export function mergeHooks(...hooks: (CollectionHooks | undefined)[]): CollectionHooks {
    return hooks.reduce<CollectionHooks>((acc, hooks) => {
        if (!hooks) return acc;

        Object.entries(hooks).forEach(([key, hooksArr]) => {
            const prop = key as keyof CollectionHooks

            if (prop in acc) {
                const exHooksList = acc[prop]

                if (!Array.isArray(exHooksList)) {
                    return
                }

                // @ts-ignore
                acc[prop] = exHooksList.concat(hooksArr as any)
            } else {
                // @ts-ignore
                acc[prop] = hooksArr
            }
        })

        return acc
    }, {})
}
