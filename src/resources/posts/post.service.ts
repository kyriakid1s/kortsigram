import postModel from './post.model';
import AwsFileUploader from '../../utils/s3';
import Post from './post.interface';
import User from '../users/user.interface';
import userModel from '../users/user.model';
import { populate } from 'dotenv';

class PostService {
    private post = postModel;
    private user = userModel;
    private s3Client = new AwsFileUploader();
    /**
     * Upload PostModel to Database
     */
    public async postToDatabase(
        file: Express.Multer.File,
        author: string
    ): Promise<Post | Error> {
        try {
            const uploadedFilePath = await this.s3Client.uploadImage(
                file,
                author
            );
            const post = await this.post.create({
                author: author,
                imageURL: uploadedFilePath,
            });
            const user = await this.user
                .findOne({ username: author })
                .select('posts');
            user?.posts.push(post._id);
            user?.save();
            return post;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    /**
     * Like A Post
     */

    public async likePost(
        postId: string,
        username: string
    ): Promise<boolean | Error> {
        try {
            const post = await this.post.findById(postId).select('-password');
            const user = await this.user
                .findOne({ username: username })
                .select('-password');
            if (!post || !user) {
                return false;
            }
            const isLikedByUser = post.likes.includes(username);
            if (isLikedByUser) {
                const index = post.likes.indexOf(username);
                post.likes.splice(index, 1);
                await post.save();
                return true;
            }
            post.likes.push(username);
            user.likedPosts.push(postId);
            await user.save();
            await post.save();
            return true;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
    /**
     * Get Posts
     */
    public async getPosts(): Promise<Post[] | Error> {
        try {
            const posts = await this.post.find({});
            return posts;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    public async getFollowingPosts(userId: string) {
        try {
            const followingPosts = await this.user
                .findById(userId)
                .select('following -_id')
                .populate({
                    path: 'following',
                    select: 'posts -_id',
                    populate: {
                        path: 'posts',
                    },
                });
            if (followingPosts == null) {
                throw new Error("We can't find anything!");
            }
            return followingPosts.following;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}
export default PostService;
