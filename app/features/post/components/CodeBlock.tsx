import { CopyBlock, dracula } from 'react-code-blocks';

import { component } from '~/utils/component';

export const CodeBlock = component<{ code: string }>('CodeBlock', function ({ className, code }) {
    return (
        <div
            className={this.mcn(
                className,
                'relative [&>div]:rounded-none',
                '[&>div>button]:absolute [&>div>button]:top-4 [&>div>button]:right-4'
            )}
        >
            <CopyBlock
                text={code}
                language='js'
                showLineNumbers
                wrapLongLines
                theme={dracula}
                codeBlock
            />
        </div>
    );
});

export default CodeBlock;
