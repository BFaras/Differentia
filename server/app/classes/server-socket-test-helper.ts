export class ServerSocketTestHelper {
    id: string;
    rooms: Set<string>;
    data: ServerSocketTestHelper;
    username: string;
    broadcast: ServerSocketTestHelper;

    constructor(id: string) {
        this.id = id;
        this.rooms = new Set<string>();
        this.rooms.add(this.id);
        this.data = this;
        this.broadcast = this;
    }

    join(roomName: string) {
        this.rooms.add(roomName);
    }

    to(gameRoom: string): ServerSocketTestHelper {
        return this;
    }

    emit(eventName: string, listener: any) {}
}
