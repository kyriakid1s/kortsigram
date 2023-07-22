import { Socket } from 'socket.io';

interface Isocket {
    handleConnection(socket: Socket): void;
    middlewareImplementation?(socket: Socket, next: any): void;
}

export default Isocket;
