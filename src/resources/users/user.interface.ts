import { Document } from 'mongoose';

interface User extends Document {
    email: string;
    username: string;
    password: string;
    posts: string[];
    likedPosts: string[];
    verified: boolean;
    verificationToken: string;
    isValidPassword(password: string): Promise<Error | boolean>;
}

export default User;
