import { EyeOpenIcon, HeartFilledIcon } from '@radix-ui/react-icons';
import type { PostStats, UserRating } from '../type';
import { useEffect, useState } from 'react';

import { ActionType } from '../config';
import { Form } from '~/components/Form';
import { HoneypotInputs } from 'remix-utils/honeypot/react';
import type { PropsWithChildren } from 'react';
import { component } from '~/utils/component';

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

const RatePostForm = component<{ postId: string; userRating: UserRating }>(
    'RatePostForm',
    function ({ className, postId, userRating }) {
        const ICON_CLASS = {
            liked: this.cn('text-red-500 hover:text-white'),
            notLiked: this.cn('text-white hover:text-red-500')
        }

        const isLiked = userRating === 'likes'

        return (
            <Form
                method='PATCH'
                hiddenInputs={{
                    intent: ActionType.UPDATE_USER_RATING,
                    postId,
                    rating: isLiked ? '' : 'likes',
                }}
                className={this.mcn(className, 'flex items-center')}
            >
                <fieldset
                    disabled={!postId}
                    className={this.cn('flex items-center')}
                >
                    <HoneypotInputs />
                    <button type='submit'>
                        <HeartFilledIcon
                            className={this.cn(
                                'w-5 h-5 stroke-black transition-colors',
                                ICON_CLASS[isLiked ? 'liked' : 'notLiked']
                            )}
                        />
                    </button>
                </fieldset>
            </Form>
        );
    }
);

export const PostActions = component<PostStats & { userRating: UserRating }>(
    'PostActions',
    function ({ className, postId, totalViews, likes, userRating }) {
        return (
            <div className={this.mcn(className, 'px-3 py-2 flex items-center gap-7 border-y-2')}>
                <CounterItem value={totalViews}>
                    <EyeOpenIcon className={this.cn('w-5 h-5')} />
                </CounterItem>
                <div className={this.cn('flex items-center gap-1')}>
                    <CounterItem value={likes}>
                        <RatePostForm
                            postId={postId}
                            userRating={userRating}
                        />
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
