import postModel from './post.model';
import CloudinaryUpload from '../../utils/cloudinary';
import Post from './post.interface';
import userModel from '../users/user.model';

class PostService {
    private post = postModel;
    private user = userModel;
    private cloudinaryClient = new CloudinaryUpload();
    /**
     * Upload PostModel to Database
     */
    public async postToDatabase(
        file: string,
        author: string
    ): Promise<Post | Error> {
        try {
            const uploadedFilePath = await this.cloudinaryClient.uploadImage(
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
            const post = await this.post.findById(postId);
            const user = await this.user.findById(userId).select('-password');
            if (!post || !user) {
                throw new Error("Can't find a post with this id");
            }
            const isAlreadyLiked = post.likes.includes(userId);
            if (isAlreadyLiked) {
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
     * Get Posts by Username
     */
    public async getPostsByUsername(username: string): Promise<Post[] | Error> {
        try {
            const posts = await this.post.find({ author: username }).populate({
                path: 'comments',
                select: 'createdAt comment-_id',
                populate: { path: 'postedBy', select: 'username -_id ' },
            });
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
            const post = await this.post.findById(postId);
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
                        populate: {
                            path: 'comments',
                            select: 'comment postedBy createdBy',
                            populate: { path: 'postedBy', select: 'username' },
                        },
                    },
                });
            if (!followingPosts) {
                throw new Error("We can't find anything!");
            }
            return followingPosts.following;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}
export default PostService;
