import slug from 'slug';
import mongoose from 'mongoose';

export const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        required: true,
        default: function () {
            return slug(this.title);
        }
    },
    likes: {
        type: Number,
        default: 0
    },
    description: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false
});

