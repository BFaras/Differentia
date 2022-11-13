import { CLUE_AMOUNT_DEFAULT } from '@app/server-consts';

export class ServerSocketTestHelper {
    id: string;
    rooms: Set<string>;
    data: ServerSocketTestHelper;
    username: string;
    amountOfClues: number;
    broadcast: ServerSocketTestHelper;

    constructor(id: string) {
        this.id = id;
        this.rooms = new Set<string>();
        this.rooms.add(this.id);
        this.data = this;
        this.broadcast = this;
        this.amountOfClues = CLUE_AMOUNT_DEFAULT;
    }

    join(roomName: string) {
        this.rooms.add(roomName);
    }

    to(gameRoom: string): ServerSocketTestHelper {
        return this;
    }

    emit(eventName: string, listener: any) {}
}
