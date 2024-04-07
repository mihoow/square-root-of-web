import { Link } from '@remix-run/react';
import { component } from '~/utils/component';

const Logo = component('Logo', function ({ className }) {
    return (
        <Link
            to='/'
            className={this.mcn(className, 'flex items-center gap-3 transition-colors', this.mod('hover', 'text-primary'))}
        >
            <img
                src='/logo/square-root-48.png'
                alt='website logo'
                width={48}
                height={48}
                loading='eager'
            />
            <span
                aria-hidden
                className={this.cn('divider block h-10 w-[1px] bg-gray-300')}
            />
            <strong className={this.cn('flex flex-col items-end')}>
                <span>Square root</span>
                <span>of web</span>
            </strong>
        </Link>
    );
});

export const Header = component('Header', function ({ className }) {
    return (
        <div className={this.mcn(className, 'h-20 py-4 border-b-2')}>
            <div className={this.cn('contain h-full flex items-center')}>
                <Logo />
            </div>
        </div>
    );
});
