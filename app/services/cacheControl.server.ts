export interface CacheControl {
    'max-age'?: number;
    's-maxage'?: number;
    'stale-while-revalidate'?: number;
    'stale-if-error'?: number;
    'public'?: boolean;
    'private'?: boolean;
    'no-store'?: boolean;
    'no-cache'?: boolean;
    'must-revalidate'?: boolean;
    'proxy-revalidate'?: boolean;
    'immutable'?: boolean;
    'no-transform'?: boolean;
}

const SUPPORTED_DIRECTIVES: (keyof CacheControl)[] = [
    'max-age',
    's-maxage',
    'stale-while-revalidate',
    'stale-if-error',
    'public',
    'private',
    'no-store',
    'no-cache',
    'must-revalidate',
    'proxy-revalidate',
    'immutable',
    'no-transform',
];

export const cacheControl = (cacheControl: CacheControl) => {
    const directives: string[] = [];

    for (const [key, value] of Object.entries(cacheControl)) {
        if (!SUPPORTED_DIRECTIVES.includes(key as keyof CacheControl)) continue;

        switch (typeof value) {
            case 'boolean':
                directives.push(`${key}`);
                break;
            case 'number':
                directives.push(`${key}=${value}`);
                break;
        }
    }

    return directives.join(', ');
};
