import User from '../../resources/user/user.interface';

declare global {
    namespace Express {
        export interface Request {
            user: User;
        }
    }
}

declare module 'socket.io' {
    interface Socket {
        userId?: string;
    }
}
