import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import UserController from './resources/users/user.controller';
import PostController from './resources/posts/post.controller';

validateEnv();

const app = new App(
    [new UserController(), new PostController()],
    Number(process.env.PORT)
);
app.listen();
