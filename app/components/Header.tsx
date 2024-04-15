import { Image } from './Image';
import { Link } from '@remix-run/react';
import { Theme } from '~/features/theme/config';
import { ThemeToggler } from '~/features/theme/components/ThemeToggler';
import { component } from '~/utils/component';
import { useTheme } from '~/features/theme/contexts/Theme.context';

const LogoImage = component('LogoImage', function ({ className }) {
    const [theme] = useTheme()

    const imgVariant = theme === Theme.DARK ? '-light' : ''

    return (
        <Image
            source={[
                { src: `/logo/square-root-32${imgVariant}.png`, width: 32, height: 32 },
                { src: `/logo/square-root-48${imgVariant}.png`, width: 48, height: 48 },
            ]}
            alt='website logo'
            loading='eager'
            className={this.mcn(className)}
        />
    );
});

const Logo = component('Logo', function ({ className }) {
    return (
        <Link
            to='/'
            className={this.mcn(
                className,
                'flex items-center gap-3 transition-colors',
                this.mod('hover', 'text-primary')
            )}
        >
            <LogoImage />
            <span
                aria-hidden
                className={this.cn('divider block h-10 w-[1px] bg-gray-300')}
            />
            <strong className={this.cn('md:flex flex-col items-end', 'dark:text-white')}>
                <span>Square root </span> <span>of web</span>
            </strong>
        </Link>
    );
});

export const Header = component('Header', function ({ className }) {
    return (
        <div
            className={this.mcn(
                className,
                'h-12 py-2 border-b-2 bg-white',
                'md:h-20 md:py-4',
                'dark:bg-darkBackground dark:border-primary'
            )}
        >
            <div className={this.cn('contain h-full flex items-center justify-between')}>
                <Logo />
                <ThemeToggler className={this.cn('w-6 h-6', 'md:w-8 md:h-8')} />
            </div>
        </div>
    );
});
