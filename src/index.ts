import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import UserController from './resources/users/user.controller';

validateEnv();

const app = new App([new UserController()], Number(process.env.PORT));
app.listen();
