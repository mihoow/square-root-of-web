import { Parser } from 'html-to-react';
import { component } from "~/utils/component"
import { useMemo } from "react";

export const HTMLParser = component<{ content: string; }>('HTMLParser', function({ className, content }) {
    const parser = useMemo(() => {
        return Parser()
    }, [])

    return (
        <div className={this.mcn(className)}>
            {parser.parse(content)}
        </div>
    )
})
