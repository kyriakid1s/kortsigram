import { Request, Response, NextFunction, Router } from 'express';
import authenticatedMiddleware from '../../middlewares/authenticated.middleware';
import PostService from './post.service';
import Controller from '../../utils/interfaces/controller.interface';
import HttpException from '../../utils/exceptations/http.exception';
import multer from 'multer';
import multerConfig from '../../middlewares/multer.middleware';

class PostController implements Controller {
    public path = '/posts';
    public router = Router();
    private PostService = new PostService();
    private upload = multer(multerConfig);

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes() {
        this.router.post(
            `${this.path}/newPost`,
            this.upload.single('file'),
            authenticatedMiddleware,
            this.NewPost
        );
        this.router.post(
            `${this.path}/:postId/like`,
            authenticatedMiddleware,
            this.likePost
        );
        this.router.get(
            `${this.path}/`,
            authenticatedMiddleware,
            this.getPosts
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
    private likePost = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { postId } = req.params;
            const like = await this.PostService.likePost(
                postId,
                req.user.username
            );
            if (!like) {
                return res
                    .status(404)
                    .json({ status: 404, message: 'Post does not exist!' });
            }
            res.status(201).json({ message: 'success' });
        } catch (err: any) {
            next(new HttpException(400, err.message));
        }
    };
    private getPosts = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const posts = await this.PostService.getPosts();
            res.status(200).json({ posts: posts });
        } catch (err: any) {
            next(new HttpException(400, err.message));
        }
    };
}

export default PostController;
