import { Document } from 'mongoose';

interface Conversation extends Document {
    members: string[];
}

export default Conversation;
