import fastify from 'fastify';
import fastifySensible from 'fastify-sensible';
import {routesPlugin} from './api.js';
import stub from 'sbuts';

export default (t) => {
    const createTestApp = ({getOneBySlug}) => {
        const app = fastify();
        app.register(fastifySensible);
        // inject mock
        app.decorate('Movie', {
            getOneBySlug
        });
        app.register(routesPlugin);
        return app;
    };
    
    t.test(`GET /:movieSlug should return 200 with the matching movie`, async (t) => {
        const forestGump = {
            likes: 0,
            _id: '6071d76a0d5f31cb3e7e8a31',
            title: 'Forest Gump',
            description: 'foo bar bim',
            slug: 'forest-gump'
        };
        const getOneBySlug = stub().resolve(forestGump);
        const app = createTestApp({getOneBySlug});
        const response = await app.inject({
            method: 'GET',
            url: '/forest-gump'
        });
        
        t.eq(response.statusCode, 200);
        const json = await response.json();
        t.eq(json, forestGump);
        t.eq(getOneBySlug.calls, [['forest-gump']])
    });
    
    t.test(`GET /:movieSlug should return 404 if no movie matches`, async (t) => {
        const getOneBySlug = stub().resolve(null);
        const app = createTestApp({getOneBySlug});
        const response = await app.inject({
            method: 'GET',
            url: '/forest-gump'
        });
        
        t.eq(response.statusCode, 404);
        t.eq(getOneBySlug.calls, [['forest-gump']])
    });
}
