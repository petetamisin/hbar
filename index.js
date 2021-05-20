import fastify from 'fastify';
import fastifySensible from 'fastify-sensible';
import mongoose from 'mongoose';
import {createDBPlugin} from './db-plugin.js';
import conf from './conf.js';
import api from './api.js';

const db = new mongoose.Mongoose();

const app = fastify({
    logger: true
});
app.register(fastifySensible);

// ... eventually other middleware etc

app.register(createDBPlugin({db}), conf);
app.register(api, {...conf, prefix:'/movies'})

app.listen(conf.server.port);
