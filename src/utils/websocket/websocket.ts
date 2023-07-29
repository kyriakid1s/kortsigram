import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

class Websocket extends Server {
    private static io: Websocket;

    constructor(httpServer: HttpServer) {
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
                if (el.handler.middlewareImplementation) {
                    namespace.use((socket, next) => {
                        el.handler.middlewareImplementation(socket, next);
                    });
                }
            });
        });
    }
}

export default Websocket;
