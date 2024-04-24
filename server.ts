import { Cache } from './app/services/cache.server';
import compression from 'compression';
import { createRequestHandler } from '@remix-run/express';
import express from 'express';
import { getRedisClient } from './app/services/redis.server';
import { installGlobals } from '@remix-run/node';
import invariant from 'tiny-invariant';
import morgan from 'morgan';
import payload from 'payload';
import sourceMapSupport from 'source-map-support';

// patch in Remix runtime globals
installGlobals();
require('dotenv').config();
sourceMapSupport.install();

async function start() {
    const app = express();

    const vite =
        process.env.NODE_ENV === 'production'
            ? undefined
            : await import('vite').then(({ createServer }) =>
                  createServer({
                      server: {
                          middlewareMode: true,
                      },
                  })
              );

    // Start Payload CMS
    invariant(process.env.PAYLOAD_SECRET, 'PAYLOAD_SECRET is required');

    await payload.init({
        secret: process.env.PAYLOAD_SECRET,
        express: app,
        onInit: () => {
            payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
        },
    });

    app.use(payload.authenticate);

    // Express Server setup
    app.use(compression());

    // http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
    app.disable('x-powered-by');

    // Everything else (like favicon.ico) is cached for an hour. You may want to be
    // more aggressive with this caching.
    app.use(express.static('public', { maxAge: '1h' }));

    app.use(morgan('tiny'));

    // handle Remix asset requests
    if (vite) {
        app.use(vite.middlewares);
    } else {
        app.use('/assets', express.static('build/client/assets', { immutable: true, maxAge: '1y' }));
    }

    app.use(express.static('build/client', { maxAge: '1h' }));

    const redis = await getRedisClient()
    const cache = new Cache(redis)

    // handle Remix SSR requests
    app.all(
        '*',
        createRequestHandler({
            // @ts-expect-error
            build: vite
                ? () => vite.ssrLoadModule('virtual:remix/server-build')
                : await import('./build/server/index.js'),
            getLoadContext(req, res) {
                return {
                    payload: req.payload,
                    user: req?.user,
                    res,
                    redis,
                    cache
                };
            },
        })
    );

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log('Express server listening on http://localhost:' + port));
}

start();
