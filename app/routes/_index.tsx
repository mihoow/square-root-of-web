import { component } from '~/utils/component';
import { json } from '@vercel/remix';

export const loader = async () => {
    return json({}, { status: 200 });
};

export default component('HomePage', function () {
    return (
        <main className={this.mcn('my-12 contain prose dark:prose-invert')}>
            <h1>Welcome to `Square Root Of Web`</h1>
            <p>For now there is only homepage. I will be adding web development tutorials soon!</p>
        </main>
    );
});
