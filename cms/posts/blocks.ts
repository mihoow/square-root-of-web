import type { Block, Field } from 'payload/types';

import { addRichTextFields, validateUrlFriendlyText } from './utils';
import { afterFieldChange } from './hooks/thumbnailUploads';

function createSection(slug: string, { fields, ...otherProperties }: Omit<Block, 'slug'>): Block {
    return {
        slug,
        interfaceName: `${slug}Data`,
        fields: [
            {
                name: 'sectionId',
                type: 'text',
                required: true,
                validate: validateUrlFriendlyText,
            },
            {
                name: 'title',
                type: 'text',
                required: true,
            },
            ...fields
        ],
        ...otherProperties
    }
}

const TextBlock = createSection('TextBlock', {
    fields: addRichTextFields('content', {
        required: true
    }),
});

const YoutubeVideo = createSection('YoutubeVideo', {
    fields: [
        {
            name: 'videoId',
            type: 'text',
            required: true,
            hooks: {
                afterChange: [afterFieldChange]
            }
        },
    ],
});

const CodePen = createSection('CodePen', {
    fields: [
        {
            name: 'penId',
            type: 'text',
            required: true
        },
        {
            name: 'penTitle',
            type: 'text',
            required: true,
        },
        {
            name: 'iframeLazyLoading',
            type: 'checkbox',
            required: true,
            defaultValue: true
        },
        {
            name: 'clickToLoad',
            type: 'checkbox',
            required: true,
            defaultValue: true
        },
        {
            name: 'editable',
            type: 'checkbox',
            required: true,
            defaultValue: false,
        },
        {
            name: 'showResultInitially',
            type: 'checkbox',
            required: true,
            defaultValue: true
        },
        {
            name: 'defaultTab',
            type: 'select',
            admin: {
                isClearable: true
            },
            options: [
                { value: 'html', label: 'HTML' },
                { value: 'css', label: 'CSS' },
                { value: 'js', label: 'JavaScript' },
            ],
            defaultValue: 'js'
        }
    ]
})

const QuestionsAndAnswers = createSection('QuestionsAndAnswers', {
    fields: [
        {
            name: 'items',
            type: 'array',
            required: true,
            minRows: 2,
            interfaceName: 'QAItems',
            labels: {
                singular: 'Item',
                plural: 'Items'
            },
            fields: [
                {
                    name: 'shortQuestion',
                    type: 'text',
                    maxLength: 25,
                    required: true,
                    admin: {
                        width: '300px'
                    }
                },
                ...addRichTextFields('question', { required: false }),
                {
                    type: 'tabs',
                    tabs: [
                        {
                            label: 'text',
                            fields: [{
                                name: 'textAnswer',
                                type: 'textarea',
                            }]
                        },
                        {
                            label: 'rich text',
                            fields: addRichTextFields('richTextAnswer')
                        },
                        {
                            label: 'code block',
                            fields: [{
                                name: 'codeAnswer',
                                type: 'code',
                            }]
                        }
                    ]
                }
            ]
        }
    ]
})

export default {
    name: 'sections',
    type: 'blocks',
    minRows: 1,
    required: true,
    blocks: [TextBlock, YoutubeVideo, QuestionsAndAnswers, CodePen],
} satisfies Field;
