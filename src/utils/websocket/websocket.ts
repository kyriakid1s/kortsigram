import { Server, Socket } from 'socket.io';

class Websocket extends Server {
    private static io: Websocket;

    constructor(httpServer: any) {
        super(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });
    }

    public static getInstance(httpServer?: any): Websocket {
        if (!Websocket.io) {
            Websocket.io = new Websocket(httpServer);
        }
        return Websocket.io;
    }

    public initialiseHandlers(socketHandlers: any[]): void {
        socketHandlers.forEach((el) => {
            let namespace = Websocket.io.of(el.path, (socket: Socket) => {
                el.handler.handleConnection(socket);
                namespace.on('connection', (socket) => {
                    console.log(socket.id);
                });
            });
        });
    }
}

export default Websocket;
