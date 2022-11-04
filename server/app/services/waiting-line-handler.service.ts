import { Service } from 'typedi';
import * as io from 'socket.io';
import { HOST_PRESENT } from '@app/server-consts';

@Service()
export class WaitingLineHandlerService {

    constructor() {}

    private playersCreatingAGame: Map<string, string> = new Map<string, string>();
    private playersJoiningAGame: Map<string, string[]> = new Map<string, string[]>();

    public addCreatingPlayer(gameName: string, socketId: string): void {
        this.playersCreatingAGame.set(gameName, socketId);
    }

    public getCreatorPlayer(gameName: string): string {
        return this.playersCreatingAGame.get(gameName) as string;
    }

    public addJoiningPlayer(socketId: string, gameInfo: string[]): void {
        this.addJoiningPlayerId(socketId, gameInfo[0]);
    }

    public updateJoiningPlayer(server: io.Server, gameName: string, event: string): void {
        const waitingSocketId = this.getCreatorPlayer(gameName);
        server.to(waitingSocketId).emit(`${gameName} ${event}`, this.getUsernameFirstPlayerWaiting(gameName, server));
    }

    public getPresenceOfJoiningPlayers(gameName: string): number {
        return this.playersJoiningAGame.get(gameName)?.length as number;
    }

    private addJoiningPlayerId(socketId: string, gameName: string): void {
        let playersTryingToJoin: string[] = [];
        if (this.playersJoiningAGame.get(gameName)) {
            playersTryingToJoin = this.playersJoiningAGame.get(gameName) as string[];
            playersTryingToJoin.push(socketId);
            this.playersJoiningAGame.delete(gameName);
        } 
        else {
            playersTryingToJoin.push(socketId);
        }
        this.playersJoiningAGame.set(gameName, playersTryingToJoin);
    }

    public deleteJoiningPlayer(socketId: string, gameName: string): void {
        this.deleteJoiningPlayerId(socketId, gameName);
    }

    private deleteJoiningPlayerId(socketId: string, gameName: string): void {
        let playersTryingToJoin = this.playersJoiningAGame.get(gameName) as string[];
        playersTryingToJoin = playersTryingToJoin?.filter(id => id !== socketId);
        this.playersJoiningAGame.delete(gameName);
        this.playersJoiningAGame.set(gameName, playersTryingToJoin);
    }

    public sendEventToAllJoiningPlayers(server: io.Server, gameName: string, event: string): void {
        if (this.playersJoiningAGame.get(gameName)?.length) {
            const playersWaiting = this.playersJoiningAGame.get(gameName) as string[];
            for (const player of playersWaiting) {
                server.to(player).emit(`${gameName} ${event}`, !HOST_PRESENT);
            }
        }
    }

    public getIDFirstPlayerWaiting(gameName: string): string {
        let playersWaiting = this.playersJoiningAGame.get(gameName) as string[];
        const idWanted = playersWaiting.shift() as string;
        playersWaiting.unshift(idWanted);
        return idWanted;
    }

    public getUsernameFirstPlayerWaiting(gameName: string, server: io.Server): string {
        return this.getUsernamePlayer(this.getIDFirstPlayerWaiting(gameName), server);
    }

    public deleteCreatorOfGame(gameName: string): void {
        this.playersCreatingAGame.delete(gameName);
    }

    public getUsernamePlayer(socketId: string, server: io.Server): string {
        return this.getSocketByID(socketId, server).data.username;
    }

    public setUsernamePlayer(socketId: string, username: string, server: io.Server): void {
        this.getSocketByID(socketId, server).data.username = username;
    }

    public getSocketByID(socketID: string, server: io.Server): io.Socket {
        return server.sockets.sockets.get(socketID)!;
    }

}