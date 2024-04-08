import type { ComponentProps } from 'react';
import { component } from '~/utils/component';

type ComplexImageSource = { src: string; width?: number; height?: number; }

type ImageSource = string | ComplexImageSource

type ImageProps = Omit<ComponentProps<'img'>, 'src' | 'alt'> & {
    source: ImageSource | [ImageSource, ImageSource];
    alt: string;
};

export const Image = component<ImageProps>(
    'Image',
    function ({ className, source, alt, loading = 'lazy', ...otherProps }) {
        const renderImage = (source: ImageSource, className?: string) => {
            const { src, width = undefined, height = undefined } = typeof source === 'string'
                ? { src: source }
                : source

            return (
                <img
                    className={this.mcn(className, className)}
                    src={src}
                    alt={alt}
                    loading={loading}
                    width={width}
                    height={height}
                    {...otherProps}
                />
            );
        }

        if (Array.isArray(source)) {
            const [mobileSrc, desktopSrc] = source;

            return (
                <>
                    {renderImage(mobileSrc, 'block md:hidden')}
                    {renderImage(desktopSrc, 'hidden md:block')}
                </>
            );
        }

        return renderImage(source);
    }
);
