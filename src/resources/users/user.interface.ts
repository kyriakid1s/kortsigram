import { Document } from 'mongoose';

interface User extends Document {
    email: string;
    username: string;
    password: string;
    private: boolean;
    posts: string[];
    likedPosts: string[];
    following: string[];
    followers: string[];
    verified: boolean;
    verificationToken: string;
    isValidPassword(password: string): Promise<Error | boolean>;
}

export default User;
