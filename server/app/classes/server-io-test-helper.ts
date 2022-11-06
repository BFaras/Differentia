export class ServerIOTestHelper {
    constructor() {}
    to(roomName : string) : ServerIOTestHelper { return this; }
    in(roomName : string) : ServerIOTestHelper { return this; }
    emit(eventName : string, listener : any) {}
    socketsLeave(roomName : string) {}
}