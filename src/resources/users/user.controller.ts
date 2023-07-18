import { Request, Response, NextFunction, Router } from 'express';
import HttpException from '../../utils/exceptations/http.exception';
import Controller from '../../utils/interfaces/controller.interface';
import validate from './user.validation';
import validationMiddleware from '../../middlewares/validation.middleware';
import authenticatedMiddleware from '../../middlewares/authenticated.middleware';
import UserService from './user.service';

class UserController implements Controller {
    public path = '/users';
    public router = Router();
    private UserService = new UserService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register
        );
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login
        );
        this.router.get(
            `${this.path}/logout`,
            authenticatedMiddleware,
            this.logout
        );

        this.router.put(
            `${this.path}/:username/follow`,
            authenticatedMiddleware,
            this.followUser
        );
        this.router.put(
            `${this.path}/:username/unfollow`,
            authenticatedMiddleware,
            this.unfollowUser
        );
        this.router.get(
            `${this.path}/:username/followers`,
            authenticatedMiddleware,
            this.getFollowers
        );
        this.router.get(
            `${this.path}/:username/following`,
            authenticatedMiddleware,
            this.getFollowing
        );
        this.router.get(
            `${this.path}/:username`,
            authenticatedMiddleware,
            this.getUser
        );
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { username, email, password } = req.body;
            const token = await this.UserService.register(
                username,
                email,
                password
            );
            res.cookie('jwt', token, {
                maxAge: 24 * 60 * 60 * 1000,
            })
                .status(201)
                .json({ token });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body;
            const token = await this.UserService.login(email, password);
            res.cookie('jwt', token, {
                maxAge: 24 * 60 * 60 * 1000,
            })
                .status(200)
                .json({ token });
        } catch (err: any) {
            next(new HttpException(400, err.message));
        }
    };

    private logout = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            res.clearCookie('jwt').status(200).json({ message: 'Logged out ' });
        } catch (err: any) {
            next(new HttpException(400, err.message));
        }
    };

    private getUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { username } = req.params;
            const user = await this.UserService.getUser(username, req.user.id);
            res.status(200).json(user);
        } catch (err: any) {
            next(new HttpException(400, err.message));
        }
    };

    private followUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { username } = req.params;
            const response = await this.UserService.followUser(
                req.user.id,
                username
            );
            if (!(response instanceof Error)) {
                if (response.success === true) {
                    return res.status(201).json({ message: response.message });
                }
                return res.status(200).json({ message: response.message });
            }
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private unfollowUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { username } = req.params;
            const response = await this.UserService.unfollowUser(
                req.user.id,
                username
            );
            if (!(response instanceof Error)) {
                if (response.success === true) {
                    return res.status(201).json({ message: response.message });
                }
                return res.status(200).json({ message: response.message });
            }
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private getFollowers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { username } = req.params;
            const followers = await this.UserService.getFollowers(username);
            res.status(200).json({ followers: followers });
        } catch (err: any) {
            next(new HttpException(400, err.message));
        }
    };

    private getFollowing = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { username } = req.params;
            const following = await this.UserService.getFollowing(username);
            res.status(200).json({ following: following });
        } catch (err: any) {
            next(new HttpException(400, err.message));
        }
    };
}

export default UserController;
