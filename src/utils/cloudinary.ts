import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

class CloudinaryUpload {
    private cloud_name = process.env.CLOUD_NAME;
    private api_key = process.env.API_KEY;
    private api_secret = process.env.API_SECRET;

    constructor() {
        cloudinary.v2.config({
            cloud_name: this.cloud_name,
            api_key: this.api_key,
            api_secret: this.api_secret,
        });
    }

    public async uploadImage(
        image: string,
        author: string
    ): Promise<string | Error> {
        try {
            const result = await cloudinary.v2.uploader.upload(image, {
                use_filename: true,
                folder: author,
            });

            return result.url;
        } catch (error: any) {
            throw new Error(error);
        }
    }
}

export default CloudinaryUpload;
