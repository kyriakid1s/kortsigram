import { Document } from 'mongoose';

interface Comment extends Document {
    postedBy: string;
    comment: string;
}

export default Comment;
