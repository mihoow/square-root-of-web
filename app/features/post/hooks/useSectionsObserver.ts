import { useCallback, useEffect, useMemo, useRef } from 'react';

import type { PageLayoutItem } from '../type';
import { subscribeToEvent } from '~/utils/customEvent';
import { useDebouncedCallback } from 'use-debounce';
import { useMirrorRef } from '~/hooks/useMirrorRef';
import { useSearchParams } from '@remix-run/react';

type SectionInfo = {
    id: string;
    elem: HTMLElement | null;
    intersectionRatio: number;
};

type SectionUpdate = {
    id: string;
    elem?: HTMLElement | null;
    intersectionRatio?: number;
};

export function useSectionsObserver(layout: PageLayoutItem[]) {
    const [searchParams, setSearchParams] = useSearchParams();

    const initialSections = useMemo(() => {
        return layout.reduce<SectionInfo[]>((acc, section) => {
            const { id, subsections } = section

            acc.push({
                id,
                elem: null,
                intersectionRatio: 0
            })

            if (subsections?.length) {
                subsections.forEach(({ id: subId }) => {
                    acc.push({
                        id: subId,
                        elem: null,
                        intersectionRatio: 0
                    })
                })
            }

            return acc
        }, [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const sectionsRef = useRef<SectionInfo[]>(initialSections);
    const observerRef = useRef<IntersectionObserver>();
    const currentHashRef = useMirrorRef(searchParams.get('hash'));
    const isScrollingByLinkRef = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout>()

    const updateSection = useCallback(
        (
            { id, elem: updateElem, intersectionRatio: updateIntersectionRatio }: SectionUpdate,
            callback?: (prevSection: SectionInfo | null, currSection: SectionInfo) => void
        ) => {
            const exSectionIndex = sectionsRef.current.findIndex(({ id: exId }) => exId === id);
            const prevSection = sectionsRef.current[exSectionIndex];
            const nextSection: SectionInfo = prevSection
                ? { ...prevSection }
                : {
                      id,
                      elem: updateElem || null,
                      intersectionRatio: updateIntersectionRatio || 0,
                  };

            if (!prevSection) {
                sectionsRef.current.push(nextSection);
            } else {
                if (updateElem !== undefined) {
                    nextSection.elem = updateElem;
                }

                if (updateIntersectionRatio !== undefined) {
                    nextSection.intersectionRatio = updateIntersectionRatio;
                }

                sectionsRef.current[exSectionIndex] = nextSection;
            }

            callback?.(prevSection || null, nextSection);
        },
        []
    );

    const updateHash = useDebouncedCallback(
        () => {
            const { current: sections } = sectionsRef;

            const mostVisibleSection = [...sections].reverse().reduce<SectionInfo>(
                (mostVisible, section) => {
                    if (section.intersectionRatio > mostVisible.intersectionRatio) {
                        return section;
                    }

                    return mostVisible;
                },
                { id: '', elem: null, intersectionRatio: 0 }
            );

            if (!mostVisibleSection) {
                return;
            }

            if (currentHashRef.current !== mostVisibleSection.id) {
                setSearchParams(
                    (params) => {
                        params.set('hash', mostVisibleSection.id);

                        return params;
                    },
                    { preventScrollReset: true, replace: true }
                );
            }
        },
        150,
        { leading: true }
    );

    const createIntersectionObserver = useCallback(() => {
        const OPTIONS: IntersectionObserverInit = {
            root: document,
            threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
        };

        const callback: IntersectionObserverCallback = (entries) => {
            entries.forEach(({ target, intersectionRatio }) => {
                updateSection({ id: target.id, intersectionRatio });
            });

            if (!isScrollingByLinkRef.current) {
                updateHash();
            }
        };

        const observer = new IntersectionObserver(callback, OPTIONS);

        sectionsRef.current.forEach(({ elem }) => {
            if (elem) {
                observer.observe(elem);
            }
        });

        return observer;
    }, [updateSection, updateHash]);

    useEffect(() => {
        if (observerRef.current) {
            return;
        }

        observerRef.current = createIntersectionObserver();

        return () => {
            observerRef.current?.disconnect();
            observerRef.current = undefined;
        };
    }, [createIntersectionObserver]);

    useEffect(() => {
        const unsubscribe = subscribeToEvent('post:navigate', ({ detail: { sectionId } }) => {
            const section = sectionsRef.current.find(({ id }) => id === sectionId)

            if (!section?.elem) {
                return
            }

            clearTimeout(timeoutRef.current)
            updateHash.cancel()
            isScrollingByLinkRef.current = true;

            timeoutRef.current = setTimeout(() => {
                isScrollingByLinkRef.current = false;
            }, 1500);

            section.elem.scrollIntoView({ behavior: 'smooth', block: 'center' })
        });

        return () => {
            unsubscribe();
            clearTimeout(timeoutRef.current);
        };
    }, [updateHash]);

    const connectToSection = (id: string, section: HTMLElement | null) => {
        const { current: observer } = observerRef;

        updateSection({ id, elem: section }, (prevSection, { elem: nextElem }) => {
            const prevElem = prevSection?.elem;

            if (prevElem === nextElem) {
                return;
            }

            if (prevElem) {
                observer?.unobserve(prevElem);
            }

            if (nextElem) {
                observer?.observe(nextElem);
            }
        });
    };

    return connectToSection
}
