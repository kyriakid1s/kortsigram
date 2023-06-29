import { cleanEnv, str, port } from 'envalid';

function validateEnv(): void {
    cleanEnv(process.env, {
        PORT: port({ default: 3000 }),
        NODE_ENV: str({ choices: ['development', 'production'] }),
        MONGO_URL: str(),
        JWT_SECRET: str(),
    });
}

export default validateEnv;
