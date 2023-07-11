import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

class AwsFileUploader {
    private s3: S3Client;
    private bucketName = process.env.BUCKET_NAME || '';
    private region = process.env.BUCKET_REGION || '';
    private accessKeyId = process.env.ACCESS_KEY || '';
    private secretAccessKey = process.env.SECRET_KEY || '';

    constructor() {
        this.s3 = new S3Client({
            region: this.region,
            credentials: {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            },
        });
    }

    public async uploadImage(
        image: Express.Multer.File,
        author: string
    ): Promise<string | Error> {
        try {
            const uploadParams = {
                Bucket: this.bucketName,
                Key: `${author}/${image.originalname}`,
                Body: image.buffer,
            };

            await this.s3.send(new PutObjectCommand(uploadParams));
            return `${this.bucketName}/${author}/${image.originalname}`;
        } catch (error: any) {
            throw new Error(error);
        }
    }
}

export default AwsFileUploader;
