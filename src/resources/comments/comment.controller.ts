import { Request, Response, NextFunction, Router } from 'express';
import HttpException from '../../utils/exceptations/http.exception';
import Controller from '../../utils/interfaces/controller.interface';
import validate from './comment.validation';
import CommentService from './comment.service';
import validationMiddleware from '../../middlewares/validation.middleware';
import authenticatedMiddleware from '../../middlewares/authenticated.middleware';

class CommentController implements Controller {
    public path = '/comments';
    public router = Router();
    private CommentService = new CommentService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes() {
        this.router.post(
            `${this.path}/postComment/:postId`,
            authenticatedMiddleware,
            validationMiddleware(validate.postComment),
            this.postComment
        );
    }

    private postComment = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { comment } = req.body;
            const { postId } = req.params;
            const commentResponse = await this.CommentService.postComment(
                req.user.id,
                comment,
                postId
            );
            res.status(201).json({
                message: 'Comment added !',
                comment: commentResponse,
            });
        } catch (err: any) {
            next(new HttpException(400, err.message));
        }
    };
}
export default CommentController;
