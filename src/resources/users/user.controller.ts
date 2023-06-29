import { Request, Response, NextFunction, Router } from 'express';
import HttpException from '../../utils/exceptations/http.exception';
import Controller from '../../utils/interfaces/controller.interface';
import validate from './user.validation';
import validationMiddleware from '../../middlewares/validation.middleware';
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
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Request | void> => {
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
}

export default UserController;
