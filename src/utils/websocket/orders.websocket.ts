import { Socket } from 'socket.io';
import Isocket from './websocket.interface';

class MessagesSocket implements Isocket {
    handleConnection(socket: Socket): void {
        socket.on('connection', (socket: Socket) => {
            console.log(socket.id);
        });
    }
}

export default MessagesSocket;
