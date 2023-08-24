import { Request, Response, NextFunction, Router } from 'express';
import authenticatedMiddleware from '../../middlewares/authenticated.middleware';
import PostService from './post.service';
import Controller from '../../utils/interfaces/controller.interface';
import HttpException from '../../utils/exceptations/http.exception';
import multer from 'multer';
import multerConfig from '../../middlewares/multer.middleware';

//TODO Make Error handling in all routes more efficient !

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
            `${this.path}/like/:postId`,
            authenticatedMiddleware,
            this.likePost
        );
        this.router.get(
            `${this.path}/postById/:postId`,
            authenticatedMiddleware,
            this.getPostById
        );
        this.router.get(
            `${this.path}/postsByUsername/:username`,
            authenticatedMiddleware,
            this.getPostsByUsername
        );
        this.router.get(
            `${this.path}/following`,
            authenticatedMiddleware,
            this.getFollowingPosts
        );
    }

    private NewPost = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const author = req.user.username;
            console.log(req.file?.path);
            const post = await this.PostService.postToDatabase(
                req.file?.path as string,
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
            const like = await this.PostService.likePost(postId, req.user.id);
            if (!like) {
                return res
                    .status(404)
                    .json({ status: 404, message: 'Post does not exist!' });
            }
            res.status(201).json({ message: like });
        } catch (err: any) {
            next(new HttpException(400, err.message));
        }
    };

    private getPostsByUsername = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { username } = req.params;
            const posts = await this.PostService.getPostsByUsername(username);
            res.status(200).json({ posts: posts });
        } catch (err: any) {
            next(new HttpException(400, err.message));
        }
    };

    private getFollowingPosts = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const followingPosts = await this.PostService.getFollowingPosts(
                req.user.id
            );
            res.status(200).json({
                followingPosts,
                currentUserId: req.user.id,
            });
        } catch (err: any) {
            next(new HttpException(400, err.message));
        }
    };

    private getPostById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { postId } = req.params;
            const post = await this.PostService.getPostById(postId);
            res.status(200).json(post);
        } catch (err: any) {
            next(new HttpException(400, err.message));
        }
    };
}

export default PostController;
