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
}
export default UserService;
