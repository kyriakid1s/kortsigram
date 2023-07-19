import { Schema, model, SchemaTypes } from 'mongoose';
import Message from './message.interface';

const messageModel = new Schema({
    senderId: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        require: true,
    },
    receiverId: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        require: true,
    },
    message: {
        type: String,
        require: true,
    },
    conversationId: {
        type: SchemaTypes.ObjectId,
        ref: 'Conversation',
        require: true,
    },
    timestamp: {
        type: Date,
        default: Date.now(),
    },
});

export default model<Message>('Message', messageModel);
