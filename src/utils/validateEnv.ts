import { cleanEnv, str, port } from 'envalid';

function validateEnv(): void {
    cleanEnv(process.env, {
        PORT: port({ default: 3000 }),
        NODE_ENV: str({ choices: ['development', 'production'] }),
        MONGO_URL: str(),
        JWT_SECRET: str(),
        ACCESS_KEY: str(),
        SECRET_KEY: str(),
        BUCKET_NAME: str(),
        BUCKET_REGION: str(),
    });
}

export default validateEnv;
