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
            console.log(uploadedFilePath);
            const post = await this.post.create({
                author: author,
                imageURL: uploadedFilePath,
            });
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
            const post = await this.post.findById(postId);
            const user = await this.user.findOne({ username: username });
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
}
export default PostService;
