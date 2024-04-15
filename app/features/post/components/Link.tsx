import { Link, useSearchParams } from '@remix-run/react';

import type { PropsWithChildren } from 'react';
import type { SectionData } from '../type';
import { component } from '~/utils/component';
import { dispatchEvent } from '~/utils/customEvent';

type LinkProps = PropsWithChildren<{
    to: string;
}>;

type HashLinkProps = PropsWithChildren<
    Omit<SectionData, 'title'>
>;

export const ExternalLink = component<LinkProps>('Link', function ({ className, to, children }) {
    return (
        <a
            href={to}
            target='_blank'
            rel='noopener noreferrer'
            className={this.mcn(className, 'hover:text-primary')}
        >
            {children}
        </a>
    );
});

export const HashLink = component<HashLinkProps>(
    'HashLink',
    function ({ className, id, children }) {
        const [searchParams] = useSearchParams()

        const search = (() => {
            const newSearchParams = new URLSearchParams(searchParams)
            newSearchParams.set('hash', id)

            return newSearchParams.toString()
        })()

        return (
            <Link
                to={{ search }}
                preventScrollReset
                replace
                className={this.mcn(className)}
                onClick={() => {
                    dispatchEvent('post:navigate', { sectionId: id });
                }}
            >
                {children}
            </Link>
        );
    }
);
