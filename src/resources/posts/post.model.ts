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
            required: true,
        },
        likes: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default model<Post>('Post', PostModel);
