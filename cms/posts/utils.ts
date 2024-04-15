import type { Field, RichTextField } from 'payload/types';
import { HTMLConverterFeature, lexicalEditor, lexicalHTML } from '@payloadcms/richtext-lexical';

import { text as textValidator } from 'payload/dist/fields/validations';

export function validateUrlFriendlyText(value: any, args: any): ReturnType<typeof textValidator> {
    if (typeof value !== 'string') {
        return 'This field needs to be a string value';
    }

    const isValidPathname = /^[a-zA-Z0-9-]+$/.test(value);

    if (!isValidPathname) {
        return 'This field can contain only english alphabet letters, numbers and `-`';
    }

    return textValidator(value, args);
}

export function addRichTextFields(
    fieldName: string,
    options: Omit<RichTextField, 'name' | 'type' | 'editor'> = {}
): [Field, Field] {
    return [
        {
            name: fieldName,
            type: 'richText',
            editor: lexicalEditor({
                features: ({ defaultFeatures }) => [...defaultFeatures, HTMLConverterFeature({})],
            }),
            ...options,
        },
        lexicalHTML(fieldName, { name: `${fieldName}HTML` }),
    ];
}
