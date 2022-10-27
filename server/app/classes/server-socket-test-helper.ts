export class ServerSocketTestHelper {
    id : string;
    rooms : Set<string>;

    constructor(id : string)
    {
        this.id = id;
        this.rooms = new Set<string>();
        this.rooms.add(this.id);

    }

    join(roomName : string)
    {
        this.rooms.add(roomName);
    }

    emit(eventName : string, listener : any) {}
}