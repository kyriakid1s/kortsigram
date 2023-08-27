import { Socket, Server } from 'socket.io';

class Websocket {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
        this.handleConnection();
        this.socketMiddlewares();
    }

    private handleConnection(): void {
        this.io.on('connection', (socket: Socket) => {
            if (socket.userId) socket.join(socket.userId);
            const users = [];
            for (let [id, socket] of this.io.of('/').sockets) {
                users.push({
                    userID: id,
                    username: socket.userId,
                });
            }
            socket.emit('users', users);

            socket.broadcast.emit(
                'user connected',
                `${socket.userId} just connected`
            );
            socket.on('private message', ({ content, to }) => {
                socket
                    .to(to)
                    .emit('private message', { content, from: socket.userId });
            });
        });
    }

    private socketMiddlewares(): void {
        this.io.use((socket, next) => {
            socket.userId = socket.handshake.auth.userId;
            return next();
        });
    }
}

export default Websocket;
