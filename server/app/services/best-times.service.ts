import { RecordTimesService } from './database.games.service';
import { DatabaseService } from './database.service';
import { Time } from '@common/time';
import Container, { Service } from 'typedi';

@Service()
export class BestTimesService {
    private databaseService: DatabaseService;
    private recordTimesService: RecordTimesService;

    constructor() {
        this.databaseService = Container.get(DatabaseService);
        this.recordTimesService = new RecordTimesService(this.databaseService);
    }

    async compareGameTimeWithDbTimes(gameTime: Time, isMultiplayer: boolean, gameName: string, playerUsername: string) {
        const databaseGameTimes = await this.recordTimesService.getGameTimes(gameName);
        if (isMultiplayer) {
            const gameTimeInString = this.timeFormatToString(gameTime);
            const dbGameTimes = this.convertTimeForComparison(databaseGameTimes.multiplayerGameTimes[2].time);
            if (this.convertTimeForComparison(gameTimeInString) < dbGameTimes) {
                databaseGameTimes.multiplayerGameTimes[2].time = gameTimeInString;
                databaseGameTimes.multiplayerGameTimes[2].playerName = playerUsername;
            }
        } else {
            const gameTimeInString = this.timeFormatToString(gameTime);
            const dbGameTimes = this.convertTimeForComparison(databaseGameTimes.soloGameTimes[2].time);
            if (this.convertTimeForComparison(gameTimeInString) < dbGameTimes) {
                databaseGameTimes.soloGameTimes[2].time = gameTimeInString;
                databaseGameTimes.soloGameTimes[2].playerName = playerUsername;
            }
        }
    }

    private timeFormatToString(gameTime: Time): string {
        return gameTime.minutes + ':' + gameTime.seconds;
    }

    private convertTimeForComparison(time: string): number {
        const regex = new RegExp(':', 'g');
        return parseInt(time.replace(regex, ''), 10);
    }
}
