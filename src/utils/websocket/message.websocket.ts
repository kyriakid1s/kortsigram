import { Socket } from 'socket.io';
import Isocket from './websocket.interface';

class MessagesSocket implements Isocket {
    public handleConnection(socket: Socket): void {
        console.log(socket.userId);
        socket.on('private', ({ content, to }) => {
            console.log(content);
            socket.join(to);
            socket.to(to).emit('private', {
                content,
                from: socket.id,
            });
        });
    }

    public middlewareImplementation(socket: Socket, next: any): void {
        const userId = socket.handshake.auth.userId;
        socket.userId = userId;
        next();
    }
}

export default MessagesSocket;
