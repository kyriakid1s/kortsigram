import mongoose, { Schema, model } from 'mongoose';
import Comment from './comment.interface';

const commentModel = new Schema(
    {
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        comment: {
            type: String,
            require: [true, 'You must to comment something !'],
        },
    },
    { timestamps: true }
);

export default model<Comment>('Comment', commentModel);
