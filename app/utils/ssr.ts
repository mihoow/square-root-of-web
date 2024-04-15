export function isSSR() {
    return typeof document === 'undefined'
}
