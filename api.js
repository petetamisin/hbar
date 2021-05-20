import {createService} from './movies-service.js';

export default async (instance) => {
    const {Movie} = instance; // mongoose model injected
    instance.register(async (instance) => {
        // we overwrite for the scope by our service instead
        instance.decorate('Movie', createService({model: Movie}));
        instance.register(routesPlugin);
    });
}

export const routesPlugin = async (instance) => {
    const {Movie} = instance; // this one will then be the service instead
    
    instance.route({
        method: 'GET',
        url: '/:movieSlug',
        async handler(req, res) {
            const {params} = req;
            const movie = await Movie.getOneBySlug(params.movieSlug);
            instance.assert(movie, 404);
            return movie;
        }
    });
    
    instance.route({
        method: 'GET',
        url: '/',
        async handler(req, res) {
            return Movie.listAll();
        }
    });
    
    instance.route({
        method: 'DELETE',
        url: '/:movieSlug',
        async handler(req, res) {
            const slug = req.params.movieSlug;
            const movie = await Movie.getOneBySlug(slug);
            instance.assert(movie, 404);
            await Movie.delete(slug);
            res.statusCode = 204;
        }
    });
    
    instance.route({
        method: 'POST',
        url: '/',
        schema: {
            body: {
                type: 'object',
                properties: {
                    title: {
                        type: 'string'
                    },
                    description: {
                        type: 'string'
                    }
                },
                required: ['title']
            }
        },
        async handler(req, res) {
            const movie = await Movie.getOneByTitle(req.body.title);
            instance.assert(!movie, 409, 'movie already exists');
            return Movie.create(req.body);
        }
    });
};
