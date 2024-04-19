import { isDevelopment } from '~/services/util.server';

export class InvalidParamsResponse extends Response {
    constructor() {
        const body = isDevelopment()
            ? 'The `params.id` is not a string.'
            : "It's not possible to view any post right now. I will fix it as soon as possible";

        super(body, { status: 500, statusText: 'Sorry, my mistake.' });
    }
}

export class NotFoundResponse extends Response {
    constructor() {
        super("It might have never existed or was removed. If you suspect the latter, check the url if it contains some spelling mistake.", { status: 404, statusText: `The post was not found.` });
    }
}

export class NotAllowedResponse extends Response {
    constructor(postTitle: string) {
        const body = `The post: "${postTitle}" is currently in a draft mode and it will be published soon. Sorry for the inconvenience, please check again later on.`;

        super(body, { status: 401, statusText: 'The post is not ready' });
    }
}

export class DebugResponse extends Response {
    constructor(errorMessage: string) {
        super(errorMessage, { status: 500, statusText: 'Server Error' });
    }
}

export class UnknownErrorResponse extends Response {
    constructor() {
        const body =
            "Please try refreshing the page. If it doesn't help, just know that I'm informed about the error and I will fix it as soon as possible.";
        super(body, { status: 500, statusText: 'Oh no! Something went wrong!' });
    }
}
