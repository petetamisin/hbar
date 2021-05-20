import fp from 'fastify-plugin'
import mongoose from 'mongoose';
import {MovieSchema} from './db-models.js';

export const createDBPlugin = ({db = mongoose } = {}) => fp(async (intance, opts) =>{
   await db.connect(opts.db.uri);
   intance
       .decorate('Movie', db.model('Movie', MovieSchema))
       .addHook('onClose', () =>db.close());
});
