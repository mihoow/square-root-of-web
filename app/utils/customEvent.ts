interface CustomEventMap {
    'post:navigate': CustomEvent<{ sectionId: string }>;
}

type CustomListener<K extends keyof CustomEventMap> = (e: CustomEventMap[K]) => void;

export function dispatchEvent<K extends keyof CustomEventMap>(
    eventName: K,
    ...args: CustomEventMap[K]['detail'] extends undefined ? [] : [CustomEventMap[K]['detail']]
): void {
    document.dispatchEvent(new CustomEvent(eventName, { detail: args[0] }));
}

export function subscribeToEvent<K extends keyof CustomEventMap>(eventName: K, listener: CustomListener<K>) {
    document.addEventListener(eventName, listener as EventListener);

    return () => {
        document.removeEventListener(eventName, listener as EventListener);
    }
}

export function unsubscribeFromEvent<K extends keyof CustomEventMap>(eventName: K, listener: CustomListener<K>): void {
    document.removeEventListener(eventName, listener as EventListener);
}
