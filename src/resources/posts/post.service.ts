import postModel from './post.model';
import AwsFileUploader from '../../utils/s3';
import Post from './post.interface';
import userModel from '../users/user.model';

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
        userId: string
    ): Promise<string | Error> {
        try {
            const post = await this.post.findById(postId).select('-password');
            const user = await this.user.findById(userId).select('-password');
            if (!post || !user) {
                throw new Error("Can't find a post with this id");
            }
            const isLikedByUser = post.likes.includes(userId);
            if (isLikedByUser) {
                const indexInPost = post.likes.indexOf(userId);
                post.likes.splice(indexInPost, 1);
                const indexInUser = user.likedPosts.indexOf(postId);
                user.likedPosts.splice(indexInUser, 1);
                await post.save();
                await user.save();
                return 'You dont like this post anymore';
            }
            post.likes.push(userId);
            user.likedPosts.push(postId);
            await user.save();
            await post.save();
            return 'you liked the post';
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

    /**
     * Get Post by id
     */
    public async getPostById(postId: string): Promise<Post | Error> {
        try {
            const post = await this.post.findById(postId).populate('likes');
            if (!post) throw new Error('This post does not exist');
            return post;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    /**
     * Get Following Posts
     */

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
