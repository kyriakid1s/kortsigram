import { Schema, model } from 'mongoose';
import User from './user.interface';
import bcrypt from 'bcrypt';

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        posts: {
            type: Array,
        },
        likedPosts: {
            type: Array,
        },
        followers: {
            type: Array,
        },
        following: {
            type: Array,
        },
        verified: {
            type: Boolean,
            required: true,
            default: false,
        },
        verificationToken: {
            type: String,
            required: true,
            default: null,
        },
    },
    { timestamps: true }
);

UserSchema.pre<User>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});
UserSchema.methods.isValidPassword = async function (
    password: string
): Promise<Error | boolean> {
    return await bcrypt.compare(password, this.password);
};

export default model<User>('User', UserSchema);
