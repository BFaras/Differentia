import { Service } from 'typedi';

@Service()
export class limitedTimePlayersHandler {
    limitedTimeWaitingSocketId: string = '';
    constructor() {}

    resetLimitedTimeWaitingSocketId(): void {
        this.limitedTimeWaitingSocketId = '';
    }
    
    checkIfSomeoneIsWaiting(): boolean {
        return this.limitedTimeWaitingSocketId !== '';
    }

    setLimitedTimeWaitingSocketId(socketId: string): void {
        this.limitedTimeWaitingSocketId = socketId;
    }
}
    