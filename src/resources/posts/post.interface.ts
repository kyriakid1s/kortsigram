import { Document } from 'mongoose';

interface Post extends Document {
    author: string;
    imageURL: string;
    caption: string;
    likes: string[];
    comments: string[];
}

export default Post;
