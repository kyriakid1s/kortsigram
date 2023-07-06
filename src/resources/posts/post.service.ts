import postModel from './post.model';
import AwsFileUploader from '../../utils/s3';
import Post from './post.interface';

class PostService {
    private post = postModel;
    private s3Client = new AwsFileUploader();

    /**
     * Upload Photo to S3
     * We upload photo from PostModel Function
     */
    private async uploadToS3(
        file: Express.Multer.File
    ): Promise<string | Error> {
        try {
            const fileUrl = await this.s3Client.uploadImage(file);
            return fileUrl;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    /**
     * Upload PostModel to Database
     */
    public async postToDatabase(
        file: Express.Multer.File,
        author: string
    ): Promise<Post | Error> {
        try {
            const uploadedFilePath = await this.uploadToS3(file);
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
}

export default PostService;
