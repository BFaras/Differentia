import { HOST_PRESENT } from '@common/const';
import * as io from 'socket.io';
import { Service } from 'typedi';

@Service()
export class WaitingLineHandlerService {
    playerWaitingForALimitedTimeGameId: string = '';
    private playersCreatingAGame: Map<string, string> = new Map<string, string>();
    private playersJoiningAGame: Map<string, string[]> = new Map<string, string[]>();
    constructor() {}

    addCreatingPlayer(gameName: string, socketId: string): void {
        this.playersCreatingAGame.set(gameName, socketId);
    }

    getCreatorPlayer(gameName: string): string {
        return this.playersCreatingAGame.get(gameName) as string;
    }

    addJoiningPlayer(socketId: string, gameName: string): void {
        this.addJoiningPlayerId(socketId, gameName);
    }

    updateJoiningPlayer(server: io.Server, gameName: string, event: string): void {
        const waitingSocketId = this.getCreatorPlayer(gameName);
        server.to(waitingSocketId).emit(`${gameName} ${event}`, this.getUsernameFirstPlayerWaiting(gameName, server));
    }

    addLimitedTimeWaitingPlayer(socketId: string) {
        this.playerWaitingForALimitedTimeGameId = socketId;
    }

    isSomebodyWaitingForALimitedTimeGame(): boolean {
        return this.playerWaitingForALimitedTimeGameId !== '';
    }

    getLimitedTimeWaitingPlayerId(): string {
        return this.playerWaitingForALimitedTimeGameId;
    }

    resetLimitedTimeWaitingLine(): void {
        this.playerWaitingForALimitedTimeGameId = '';
    }

    getPresenceOfJoiningPlayers(gameName: string): number {
        return this.playersJoiningAGame.get(gameName)?.length as number;
    }

    deleteJoiningPlayer(socketId: string, gameName: string): void {
        this.deleteJoiningPlayerId(socketId, gameName);
    }

    sendEventToAllJoiningPlayers(server: io.Server, gameName: string, event: string): void {
        if (this.playersJoiningAGame.get(gameName)?.length) {
            const playersWaiting = this.playersJoiningAGame.get(gameName) as string[];
            for (const player of playersWaiting) {
                server.to(player).emit(`${gameName} ${event}`, !HOST_PRESENT);
            }
        }
    }

    getIDFirstPlayerWaiting(gameName: string): string {
        const playersWaiting = this.playersJoiningAGame.get(gameName) as string[];
        const idWanted = playersWaiting.shift() as string;
        playersWaiting.unshift(idWanted);
        return idWanted;
    }

    getUsernameFirstPlayerWaiting(gameName: string, server: io.Server): string {
        return this.getUsernamePlayer(this.getIDFirstPlayerWaiting(gameName), server);
    }

    deleteCreatorOfGame(gameName: string): void {
        this.playersCreatingAGame.delete(gameName);
    }

    getUsernamePlayer(socketId: string, server: io.Server): string {
        return this.getSocketByID(socketId, server).data.username;
    }

    setUsernamePlayer(socketId: string, username: string, server: io.Server): void {
        this.getSocketByID(socketId, server).data.username = username;
    }

    getSocketByID(socketID: string, server: io.Server): io.Socket {
        return server.sockets.sockets.get(socketID) as io.Socket;
    }

    private addJoiningPlayerId(socketId: string, gameName: string): void {
        let playersTryingToJoin: string[] = [];
        if (this.playersJoiningAGame.get(gameName)) {
            playersTryingToJoin = this.playersJoiningAGame.get(gameName) as string[];
            playersTryingToJoin.push(socketId);
            this.playersJoiningAGame.delete(gameName);
        } else {
            playersTryingToJoin.push(socketId);
        }
        this.playersJoiningAGame.set(gameName, playersTryingToJoin);
    }

    private deleteJoiningPlayerId(socketId: string, gameName: string): void {
        let playersTryingToJoin = this.playersJoiningAGame.get(gameName) as string[];
        playersTryingToJoin = playersTryingToJoin?.filter((id) => id !== socketId);
        this.playersJoiningAGame.delete(gameName);
        this.playersJoiningAGame.set(gameName, playersTryingToJoin);
    }
}
