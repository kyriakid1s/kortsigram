import { Socket, Server } from 'socket.io';

class Websocket {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
        this.handleConnection();
    }

    private handleConnection(): void {
        this.io.on('connection', (socket: Socket) => {
            console.log(socket.id);
            const users = [];
            for (let [id] of this.io.of('/').sockets) {
                users.push({ userId: id });
            }
            console.log(users.length);
            socket.emit('users', users);
            socket.emit('user connected', `${socket.id} just connected`);
            socket.on('private message', ({ content, to }) => {
                socket
                    .to(to)
                    .emit('private message', { content, from: socket.id });
            });
        });
    }
}

export default Websocket;
