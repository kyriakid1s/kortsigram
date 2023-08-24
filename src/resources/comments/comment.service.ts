import commentModel from './comment.model';
import postModel from '../posts/post.model';
import Comment from './comment.interface';

class CommentService {
    private comment = commentModel;
    private post = postModel;
    /**
     * Post Comment
     */
    public async postComment(
        postedBy: string,
        comment: string,
        postId: string
    ): Promise<Comment | Error> {
        try {
            let commentResponse = await this.comment.create({
                postedBy,
                comment,
            });
            const post = await this.post.findById(postId);
            if (!post) {
                throw new Error('This post doenst exist.');
            }
            post.comments.push(commentResponse._id);
            await post.save();
            commentResponse = await commentResponse.populate(
                'postedBy',
                'username -_id'
            );
            return commentResponse;
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}

export default CommentService;
