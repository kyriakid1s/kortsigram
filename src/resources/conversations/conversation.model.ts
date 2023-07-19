import { model, Schema, SchemaTypes } from 'mongoose';
import Conversation from './conversation.interface';

const converationModel = new Schema(
    {
        members: [
            {
                type: SchemaTypes.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true }
);

export default model<Conversation>('Conversation', converationModel);
