import type { Primitive } from '~/types/util';

export function isPrimitive(value: unknown): value is Primitive {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        value === null ||
        value === undefined
    );
}

export function isObject(value: unknown): value is Record<string, unknown> {
    return !!value && typeof value === 'object'
}

export function isExpectedObject<E extends Record<string, unknown>>(obj: unknown, expected: E): obj is E {
    if (!isObject(obj)) {
        return false
    }

    return Object.entries(expected).every(([key, value]) => {
        return key in obj && obj[key] === expected[key]
    })
}