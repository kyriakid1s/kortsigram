import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token';
import Token from '../utils/interfaces/token.interface';
import HttpException from '../utils/exceptations/http.exception';
import userModel from '../resources/users/user.model';
import { JsonWebTokenError } from 'jsonwebtoken';

async function authenticatedMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {
        const token: string = req.cookies.jwt;
        if (token) {
            const payload: Token | JsonWebTokenError = await verifyToken(token);
            if (payload instanceof JsonWebTokenError) {
                return next(new HttpException(401, 'Unauthorised'));
            }
            const user = await userModel
                .findById(payload.id)
                .select('-password')
                .exec();
            if (!user) return next(new HttpException(401, 'Unauthorised'));
            req.user = user;
            return next();
        } else {
            return next(new HttpException(401, 'Unauthorised'));
        }
    } catch (er: any) {
        return next(new HttpException(401, er.message));
    }
}

export default authenticatedMiddleware;
