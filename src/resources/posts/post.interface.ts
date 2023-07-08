import { Document } from 'mongoose';

interface Post extends Document {
    author: string;
    imageURL: string;
    caption: string;
    likes: string[];
}

export default Post;
