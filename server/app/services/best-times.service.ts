import { Time } from '@common/time';
import Container, { Service } from 'typedi';
import { RecordTimesService } from './database.games.service';
import { DatabaseService } from './database.service';

@Service()
export class BestTimesService {
    private databaseService: DatabaseService;
    private recordTimesService: RecordTimesService;

    constructor() {
        this.databaseService = Container.get(DatabaseService);
        this.recordTimesService = new RecordTimesService(this.databaseService);
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
    async compareGameTimeWithDbTimes(gameTime: Time, isMultiplayer: boolean, gameName: string, playerUsername: string) {
        const databaseGameTimes = await this.recordTimesService.getGameTimes(gameName);
        if (isMultiplayer) {
            const gameTimeInString = this.timeFormatToString(gameTime);
            const dbGameTimes = this.convertTimeForComparison(databaseGameTimes.multiplayerGameTimes[2].time);
            if (this.convertTimeForComparison(gameTimeInString) < dbGameTimes) {
                databaseGameTimes.multiplayerGameTimes[2].time = gameTimeInString;
                databaseGameTimes.multiplayerGameTimes[2].playerName = playerUsername;
                await this.recordTimesService.updateGameRecordTimes(gameName, databaseGameTimes);
                await this.recordTimesService.sortGameTimes(gameName, isMultiplayer);
                const sortedTimes = await this.recordTimesService.getGameTimes(gameName);
                const playerRanking = this.recordTimesService.getPlayerRanking(sortedTimes.multiplayerGameTimes, gameTimeInString);

            }
        } else {
            const gameTimeInString = this.timeFormatToString(gameTime);
            const dbGameTimes = this.convertTimeForComparison(databaseGameTimes.soloGameTimes[2].time);
            if (this.convertTimeForComparison(gameTimeInString) < dbGameTimes) {
                databaseGameTimes.soloGameTimes[2].time = gameTimeInString;
                databaseGameTimes.soloGameTimes[2].playerName = playerUsername;
                await this.recordTimesService.updateGameRecordTimes(gameName, databaseGameTimes);
                await this.recordTimesService.sortGameTimes(gameName, isMultiplayer);
                const sortedTimes = await this.recordTimesService.getGameTimes(gameName);
                const playerRanking = this.recordTimesService.getPlayerRanking(sortedTimes.soloGameTimes, gameTimeInString);
            }
        }
    }
}
