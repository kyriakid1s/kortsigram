import userModel from './user.model';
import token from '../../utils/token';
import { randomUUID } from 'crypto';

class UserService {
    private user = userModel;

    /**
     * Register a User
     */
    public async register(
        username: string,
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            const verificationToken: string = randomUUID();
            const user = await this.user.create({
                username,
                email,
                password,
                verificationToken,
            });

            const accessToken = token.createToken(user);
            return accessToken;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    /**
     * Login a User
     */
    public async login(
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            const user = await this.user.findOne({ email });
            if (!user)
                throw new Error('Unable to find user with that email address');
            if (await user.isValidPassword(password)) {
                return token.createToken(user);
            } else {
                throw new Error('Wrong Credentials');
            }
        } catch (er: any) {
            throw new Error(er.message);
        }
    }

    /**
     * Follow a User
     */

    public async followUser(
        currentUserId: string,
        usernameToFollow: string
    ): Promise<{ success: boolean; message: string } | Error> {
        try {
            const currentUser = await this.user.findById(currentUserId);
            const userToFollow = await this.user.findOne({
                username: usernameToFollow,
            });
            if (!userToFollow || !currentUser) {
                throw new Error(
                    'This user does not exist or you are not exist :|'
                );
            }
            if (currentUser.username === userToFollow.username) {
                return {
                    success: false,
                    message: `You can not follow yourself`,
                };
            }
            if (!currentUser.following.includes(userToFollow._id)) {
                currentUser.following.push(userToFollow._id);
                userToFollow.followers.push(currentUser._id);
                await userToFollow.save();
                await currentUser.save();
                return {
                    success: true,
                    message: `You now following ${usernameToFollow}`,
                };
            } else {
                return {
                    success: false,
                    message: `You already following ${usernameToFollow}`,
                };
            }
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
    public async unfollowUser(
        currentUserId: string,
        usernameToUnfollow: string
    ): Promise<{ success: boolean; message: string } | Error> {
        try {
            const currentUser = await this.user.findById(currentUserId);
            const userToUnfollow = await this.user.findOne({
                username: usernameToUnfollow,
            });
            if (!userToUnfollow || !currentUser) {
                throw new Error('Cant find user or you.');
            }
            if (currentUser.username === userToUnfollow.username) {
                return {
                    success: false,
                    message: `You can not unfollow yourself`,
                };
            }
            if (currentUser.following.includes(userToUnfollow._id)) {
                await this.user.updateOne(
                    { _id: currentUserId },
                    {
                        $pull: { following: userToUnfollow._id },
                    }
                );
                await this.user.updateOne(
                    { _id: userToUnfollow._id },
                    {
                        $pull: { followers: currentUser._id },
                    }
                );
                return {
                    success: true,
                    message: `You unfollow ${usernameToUnfollow}`,
                };
            } else {
                return {
                    success: false,
                    message: `You not following ${usernameToUnfollow}`,
                };
            }
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}
export default UserService;
