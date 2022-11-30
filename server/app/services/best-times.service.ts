import { RecordTime } from '@app/classes/record-times';
import { NO_AVAILABLE } from '@app/server-consts';
import { GameModeTimes } from '@common/games-record-times';
import { RecordTimeInformations } from '@common/record-time-infos';
import { Time } from '@common/time';
import Container, { Service } from 'typedi';
import { RecordTimesService } from './database.games.service';
import { DatabaseService } from './database.service';
import { GameManagerService } from './game-manager.service';
import * as io from 'socket.io';

@Service()
export class BestTimesService {
    private databaseService: DatabaseService;
    private recordTimesService: RecordTimesService;
    private gameManagerService: GameManagerService;
    playerRanking: number;
    hasNewRecord: boolean;

    constructor(private sio: io.Server) {
        this.databaseService = Container.get(DatabaseService);
        this.recordTimesService = new RecordTimesService(this.databaseService);
        this.gameManagerService = new GameManagerService(this.sio);
        this.playerRanking = NO_AVAILABLE;
        this.hasNewRecord = false;
    }
    // To test
    private timeFormatToString(gameTime: Time): string {
        return (gameTime.minutes < 10 ? '0' : '') + gameTime.minutes + ':' + ((gameTime.seconds < 10 ? '0' : '') + gameTime.seconds);
    }
    // To test
    private convertTimeForComparison(time: string): number {
        let regex = new RegExp(':', 'g');
        return parseInt(time.replace(regex, ''), 10);
    }
   // To test
    private async setValidRecordTimes(gameTimeInString: string, recordTimeInfos: RecordTimeInformations): Promise<void> {
        const databaseGameTimes = await this.recordTimesService.getGameTimes(recordTimeInfos.gameName);
        this.hasNewRecord = true;
        if (recordTimeInfos.isMultiplayer) {
            databaseGameTimes.multiplayerGameTimes[2].time = gameTimeInString;
            databaseGameTimes.multiplayerGameTimes[2].playerName = recordTimeInfos.playerName;
        } else {
            databaseGameTimes.soloGameTimes[2].time = gameTimeInString;
            databaseGameTimes.soloGameTimes[2].playerName = recordTimeInfos.playerName;
        }
        const sortedTimes = await this.updateAndSortTimes(recordTimeInfos, databaseGameTimes);
        const mode = this.rankTimesByMode(sortedTimes, recordTimeInfos.isMultiplayer);
        this.playerRanking = this.recordTimesService.getPlayerRanking(mode, gameTimeInString)!;
    }
   // To test
    private rankTimesByMode(sortedTimes: GameModeTimes, isMultiplayer: boolean): RecordTime[] {
        if (isMultiplayer) return sortedTimes.multiplayerGameTimes;
        else return sortedTimes.soloGameTimes;
    }
   // To test
    private async updateAndSortTimes(recordTimeInfos: RecordTimeInformations, databaseGameTimes: GameModeTimes): Promise<GameModeTimes> {
        await this.recordTimesService.updateGameRecordTimes(recordTimeInfos.gameName, databaseGameTimes);
        await this.recordTimesService.sortGameTimes(recordTimeInfos.gameName, recordTimeInfos.isMultiplayer);
        return await this.recordTimesService.getGameTimes(recordTimeInfos.gameName);
    }
   // To test
    private async retrieveLastRecordTime(gameName: string, isMultiplayer: boolean): Promise<number> {
        const databaseGameTimes = await this.recordTimesService.getGameTimes(gameName);
        if (isMultiplayer) return this.convertTimeForComparison(databaseGameTimes.multiplayerGameTimes[2].time);
        else return this.convertTimeForComparison(databaseGameTimes.soloGameTimes[2].time);
    }

    // To test
    async compareGameTimeWithDbTimes(gameTime: Time, recordTimeInfos: RecordTimeInformations): Promise<void> {
        const gameTimeInString = this.timeFormatToString(gameTime);
        const dbGameTimesInNumber = await this.retrieveLastRecordTime(recordTimeInfos.gameName, recordTimeInfos.isMultiplayer);
        if (this.convertTimeForComparison(gameTimeInString) < dbGameTimesInNumber) await this.setValidRecordTimes(gameTimeInString, recordTimeInfos);
    }

    notifyAllActivePlayers(playerName: string, gameName: string, isMultiplayer:boolean) {
        if (this.hasNewRecord) {
            const recordInfosToSendAll: RecordTimeInformations = {
                playerName: playerName,
                playerRanking: this.playerRanking,
                gameName: gameName,
                isMultiplayer: isMultiplayer,
            };
            this.sio.to(this.gameManagerService.collectAllSocketsRooms()).emit('New record time', recordInfosToSendAll)
        }
    }
}
