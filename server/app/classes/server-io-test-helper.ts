import * as io from 'socket.io';
import { ServerSocketTestHelper } from './server-socket-test-helper';

export class ServerIOTestHelper {
    public sockets: ServerIOTestHelper;
    constructor() {
        this.sockets = this;
    }
    to(roomName: string): ServerIOTestHelper {
        return this;
    }
    in(roomName: string): ServerIOTestHelper {
        return this;
    }
    emit(eventName: string, listener: any) {}
    socketsLeave(roomName: string) {}
    get(): io.Socket {
        return new ServerSocketTestHelper('') as unknown as io.Socket;
    }
}
