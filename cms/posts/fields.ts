import type { Field } from 'payload/types';
import { validateUrlFriendlyText } from './utils';

const PageSlug: Field = {
    name: 'pageSlug',
    type: 'text',
    required: true,
    index: true,
    unique: true,
    admin: {
        width: '300px',
        description: 'It will be used as pathname on the website',
    },
    validate: validateUrlFriendlyText,
};

const Title: Field = {
    name: 'title',
    type: 'text',
    required: true,
};

const MetaFields: Field = {
    type: 'collapsible',
    label: 'Meta attributes',
    admin: {
        initCollapsed: true,
    },
    required: true,
    fields: [
        {
            name: 'meta',
            type: 'group',
            interfaceName: 'PageMeta',
            fields: [
                {
                    name: 'description',
                    type: 'textarea',
                },
                {
                    name: 'keywords',
                    type: 'text',
                    hasMany: true,
                },
                {
                    name: 'allowSearchEngineIndexing',
                    type: 'checkbox',
                    defaultValue: true,
                    required: true
                },
                {
                    name: 'author',
                    type: 'text',
                    defaultValue: 'Michał Wieczorek',
                },
            ],
        },
    ],
};

const PublishedDate: Field = {
    name: 'publishedAt',
    type: 'date',
    admin: {
        position: 'sidebar'
    }
}

const Tags: Field = {
    name: 'tags',
    type: 'select',
    hasMany: true,
    admin: {
        isClearable: true,
        position: 'sidebar'
    },
    options: [
        { value: 'java-script', label: 'JavaScript' },
        { value: 'web-development', label: 'Web development' },
    ],
}

const AdvancedTitling: Field = {
    type: 'collapsible',
    label: 'Advanced titling',
    required: true,
    admin: {
        initCollapsed: true,
        position: 'sidebar',
    },
    fields: [
        {
            name: 'advancedTitling',
            type: 'group',
            interfaceName: 'AdvancedTitling',
            fields: [
                {
                    name: 'metaTitle',
                    type: 'text',
                },
                {
                    name: 'breadcrumbTitle',
                    type: 'text',
                },
                {
                    name: 'navTitle',
                    type: 'text',
                },
            ],
        },
    ],
};

export default [PageSlug, Title, MetaFields, PublishedDate, Tags, AdvancedTitling] satisfies Field[];
