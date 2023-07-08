import { Schema, model } from 'mongoose';
import Post from './post.interface';

const PostModel = new Schema(
    {
        author: {
            type: String,
            required: true,
        },
        imageURL: {
            type: String,
            unique: true,
            required: [true, 'already have an image with that name'],
            trim: true,
        },
        likes: {
            type: Array,
        },
    },
    { timestamps: true }
);

PostModel.post('save', function (error: any, doc: any, next: any): void {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('An imagw with this name already exists.'));
    } else {
        next();
    }
});

export default model<Post>('Post', PostModel);
