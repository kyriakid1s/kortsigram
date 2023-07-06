import { Request, Response, NextFunction, Router } from 'express';
import validate from './post.validation';
import authenticatedMiddleware from '../../middlewares/authenticated.middleware';
import validationMiddleware from '../../middlewares/validation.middleware';
import PostService from './post.service';
import Controller from '../../utils/interfaces/controller.interface';
import HttpException from '../../utils/exceptations/http.exception';
import multer from 'multer';
import multerConfig from '../../middlewares/multer.middleware';

class PostController implements Controller {
    public path = '/posts';
    public router = Router();
    private PostService = new PostService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes() {
        const upload = multer();
        this.router.post(
            `${this.path}/newPost`,
            // validationMiddleware(validate.post),
            upload.single('file'),
            authenticatedMiddleware,
            this.NewPost
        );
    }

    private NewPost = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const author = req.user.username;
            const post = await this.PostService.postToDatabase(
                req.file as Express.Multer.File,
                author
            );
            res.status(201).json({ post: post });
        } catch (err: any) {
            next(new HttpException(400, err.message));
        }
    };
}

export default PostController;
