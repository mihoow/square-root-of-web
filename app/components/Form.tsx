import { Form as RemixForm, type FormProps } from '@remix-run/react';
import type { PropsWithChildren } from 'react';
import { component } from '~/utils/component';

type MyFormProps = PropsWithChildren<FormProps & { hiddenInputs?: Record<string, string> }>;

export const Form = component<MyFormProps>('CustomForm', function ({ className, hiddenInputs = {}, children, ...props }) {
    return (
        <RemixForm
            className={this.mcn(className)}
            {...props}
        >
            {Object.entries(hiddenInputs).map(([name, value]) => (
                <input
                    key={name}
                    type='hidden'
                    name={name}
                    value={value}
                />
            ))}
            {children}
        </RemixForm>
    );
});
