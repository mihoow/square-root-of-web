import { EyeOpenIcon, HeartIcon, HeartFilledIcon } from '@radix-ui/react-icons';
import { useState, useEffect } from 'react';
import type { PropsWithChildren, type FC } from 'react';

import type { PostStats, UserRating } from '../type';
import { component } from '~/utils/component';
import { Form } from '~/components/Form';
import { HoneypotInputs } from 'remix-utils/honeypot/react';

const CounterItem = component<PropsWithChildren<{ value: number }>>(
    'CounterItem',
    function ({ className, value, children }) {
        const [currValue, setCurrValue] = useState(0);

        useEffect(() => {
            if (value === currValue) {
                return;
            }

            const timeout = setTimeout(() => {
                setCurrValue((prevValue) => {
                    const nextValue = prevValue + Math.ceil(value / 10);

                    if (nextValue > value) {
                        return value;
                    }

                    return nextValue;
                });
            }, 50);

            return () => {
                clearTimeout(timeout);
            };
        }, [value, currValue]);

        return (
            <div className={this.mcn(className, 'flex items-center gap-2')}>
                {children}
                <span className={this.cn('text-sm min-w-6')}>{currValue}</span>
            </div>
        );
    }
);

export const PostActions = component<PostStats & { userRating: UserRating }>(
    'PostActions',
    function ({ className, postId, totalViews, likes, userRating }) {
        const renderIcon = (Icon: FC<{ className?: string }>, className = '') => (
            <Icon className={this.cn('w-5 h-5', className)} />
        );

        return (
            <div className={this.mcn(className, 'px-3 py-2 flex items-center gap-7 border-y-2')}>
                <CounterItem value={totalViews}>{renderIcon(EyeOpenIcon)}</CounterItem>
                <div className={this.cn('flex items-center gap-1')}>
                    <CounterItem value={likes}>
                        <Form
                            method='PATCH'
                            hiddenInputs={{
                                intent: 'updateUserRating',
                                postId,
                                rating: userRating === 'likes' ? '' : 'likes',
                            }}
                            className={this.cn('flex items-center')}
                        >
                            <fieldset disabled={!postId}>
                                <HoneypotInputs />
                                <button type='submit'>
                                    {userRating === 'likes'
                                        ? renderIcon(
                                              HeartFilledIcon,
                                              'text-red-400 hover:text-current transition-colors'
                                          )
                                        : renderIcon(HeartIcon, 'hover:text-red-400 transition-colors')}
                                </button>
                            </fieldset>
                        </Form>
                    </CounterItem>
                </div>
            </div>
        );
    }
);

export const PostActionsFallback = component('PostActionsFallback', function ({ className }) {
    return (
        <PostActions
            className={this.mcn(className)}
            postId=''
            totalViews={0}
            likes={0}
            dislikes={0}
            userRating={null}
        />
    );
});
