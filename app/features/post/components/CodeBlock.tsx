import { CopyBlock, atomOneDark, atomOneLight } from 'react-code-blocks';

import { Theme } from '~/features/theme/config';
import { component } from '~/utils/component';
import { useTheme } from '~/features/theme/contexts/Theme.context';

export const CodeBlock = component<{ code: string }>('CodeBlock', function ({ className, code }) {
    const [theme] = useTheme()

    return (
        <div
            className={this.mcn(
                className,
                'relative [&>div]:rounded-none',
                '[&>div>button]:absolute [&>div>button]:top-[calc(100%-0.75rem)] [&>div>button]:-translate-y-full [&>div>button]:right-3',
                '[&>div>span>code>span]:!p-0',
                '[&>div>span>code>span>span]:shrink-0'
            )}
        >
            <CopyBlock
                text={code}
                language='typescript'
                showLineNumbers
                wrapLongLines
                theme={theme === Theme.LIGHT ? atomOneLight : atomOneDark}
                codeBlock
            />
        </div>
    );
});

export default CodeBlock;
