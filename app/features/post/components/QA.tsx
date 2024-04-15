import { Suspense, useCallback } from 'react';

import { Accordion } from 'flowbite-react/components/Accordion';
import CodeBlock from './CodeBlock';
import { HTMLParser } from '~/components/HTMLParser';
import type { QAItem } from '../type';
import { component } from '~/utils/component';
import { useSearchParams } from '@remix-run/react';

type QAProps = {
    id: string;
    items: QAItem[];
    connectToSection: (id: string, node: HTMLElement | null) => void;
};

const Answer = component<Pick<QAItem, 'textAnswer' | 'richTextAnswer' | 'codeAnswer'>>(
    'Answer',
    function ({ className, textAnswer, richTextAnswer, codeAnswer }) {
        if (textAnswer) {
            return <p className={this.mcn(className, 'p-5')}>{textAnswer}</p>;
        }

        if (richTextAnswer) {
            return (
                <HTMLParser
                    content={richTextAnswer}
                    className={this.mcn(className, 'p-5')}
                />
            );
        }

        if (codeAnswer) {
            return (
                <Suspense fallback={null}>
                    <CodeBlock
                        code={codeAnswer}
                        className={this.mcn(className)}
                    />
                </Suspense>
            );
        }

        return <p className={this.mcn(className, 'p-5 text-red-400')}>I'm sorry, the answer is not available</p>;
    }
);

export const QuestionsAndAnswers = component<QAProps>(
    'QuestionsAndAnswers',
    function ({ className, id, items, connectToSection }) {
        const [searchParams, setSearchParams] = useSearchParams();

        const openPanelIndex = Number(searchParams.get(id) || -1);

        const handleChange = useCallback(
            (panelIndex: number) => {
                if (panelIndex === openPanelIndex) {
                    return;
                }

                setSearchParams(
                    (params) => {
                        if (panelIndex === -1) {
                            params.delete(id);
                        } else {
                            params.set(id, String(panelIndex));
                        }

                        return params;
                    },
                    { preventScrollReset: true, replace: true }
                );
            },
            [openPanelIndex, setSearchParams, id]
        );

        return (
            <Accordion
                className={this.mcn(className, 'not-prose [&>div]:p-0')}
                collapseAll
                openPanelIndex={openPanelIndex}
                onChange={handleChange}
            >
                {items.map(({ id, question, textAnswer, richTextAnswer, codeAnswer }) => (
                    <Accordion.Panel key={id}>
                        <Accordion.Title as='h3'>
                            <span
                                id={id || ''}
                                ref={(node) => connectToSection(id || '', node)}
                            >
                                <HTMLParser content={question} />
                            </span>
                        </Accordion.Title>
                        <Accordion.Content>
                            <Answer
                                textAnswer={textAnswer}
                                richTextAnswer={richTextAnswer}
                                codeAnswer={codeAnswer}
                            />
                        </Accordion.Content>
                    </Accordion.Panel>
                ))}
            </Accordion>
        );
    }
);
