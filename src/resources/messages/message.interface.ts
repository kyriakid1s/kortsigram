import { Document } from 'mongoose';

interface Message extends Document {
    senderId: string;
    receiverId: string;
    message: string;
    timestamp: Date;
    conversationId: string;
}
export default Message;
