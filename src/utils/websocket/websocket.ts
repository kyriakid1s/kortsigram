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
            console.log(socket.userId);
            socket.emit('user connected', `${socket.id} just connected`);
            socket.on('private message', ({ content, to }) => {
                socket
                    .to(to)
                    .emit('private message', { content, from: socket.userId });
            });
        });
    }

    private socketMiddlewares(): void {
        this.io.use((socket, next) => {
            socket.userId = socket.handshake.auth.username;
            return next();
        });
    }
}

export default Websocket;
