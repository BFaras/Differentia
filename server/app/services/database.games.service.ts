import { HttpException } from '@app/classes/http.exception';
import { RecordTime } from '@app/classes/record-times';
import { GameTimes } from '@common/game-times';
import { GameModeTimes } from '@common/games-record-times';
import 'dotenv/config';
import { StatusCodes } from 'http-status-codes';
import { Collection, Filter, ModifyResult, UpdateFilter, WithId } from 'mongodb';
import { Service } from 'typedi';
import { DatabaseService } from './database.service';

@Service()
export class RecordTimesService {
    private databaseErrorRecordTimes: GameModeTimes = {
        soloGameTimes: [],
        multiplayerGameTimes: [],
    };

    constructor(private databaseService: DatabaseService) {}

    get collection(): Collection<GameTimes> {
        return this.databaseService.database.collection(process.env.DATABASE_COLLECTION!);
    }
    // To test
    isDatabaseAvailable(): boolean {
        return this.databaseService.database !== undefined;
    }
    // To test
    async addNewGameDefaultTimes(gameName: string): Promise<void> {
        const newGameDefaultTimes: GameTimes = {
            name: gameName,
            recordTimes: this.databaseService.defaultRecordTimes,
        };
        if (this.isDatabaseAvailable() && (await this.validateName(gameName))) {
            await this.collection.insertOne(newGameDefaultTimes).catch((error: Error) => {
                throw new HttpException('Failed to insert game and default times', StatusCodes.INTERNAL_SERVER_ERROR);
            });
        } else {
            throw new Error('Game already exists');
        }
    }
    // To test
    async deleteGameRecordTimes(nameOfWantedGame: string): Promise<void> {
        if (this.isDatabaseAvailable()) {
            return this.collection
                .findOneAndDelete({ name: nameOfWantedGame })
                .then((res: ModifyResult<GameTimes>) => {
                    if (!res.value) {
                        throw new HttpException('Could not find game', StatusCodes.NOT_FOUND);
                    }
                })
                .catch(() => {
                    throw new HttpException('Failed to delete game record times', StatusCodes.INTERNAL_SERVER_ERROR);
                });
        }
    }
    // To test
    async resetGameRecordTimes(gameName: string): Promise<void> {
        const filterQuery: Filter<GameTimes> = { name: gameName };
        const updateQuery: UpdateFilter<GameTimes> = {
            $set: { recordTimes: this.databaseService.defaultRecordTimes },
        };
        if (this.isDatabaseAvailable()) {
            return this.collection
                .updateOne(filterQuery, updateQuery)
                .then(() => {})
                .catch(() => {
                    throw new Error('Failed to reset the game record times');
                });
        }
    }
    // To test
    async resetAllGamesRecordTimes(): Promise<void> {
        const updateQuery: UpdateFilter<GameTimes> = {
            $set: { recordTimes: this.databaseService.defaultRecordTimes },
        };
        if (this.isDatabaseAvailable()) {
            return this.collection
                .updateMany({}, updateQuery)
                .then(() => {})
                .catch(() => {
                    throw new Error('Failed to reset all games record times');
                });
        }
    }
    // To test
    async updateGameRecordTimes(gameName: string, newRecordTimes: GameModeTimes): Promise<void> {
        const filterQuery: Filter<GameTimes> = { name: gameName };
        const updateQuery: UpdateFilter<GameTimes> = {
            $set: { recordTimes: newRecordTimes },
        };
        return this.collection
            .updateOne(filterQuery, updateQuery)
            .then(() => {})
            .catch(() => {
                throw new Error('Failed to reset this game record times');
            });
    }
    // To test
    async getGameTimes(nameOfWantedGame: string): Promise<GameModeTimes> {
        const filterQuery: Filter<GameTimes> = { name: nameOfWantedGame };

        if (this.isDatabaseAvailable()) {
            return this.collection
                .findOne(filterQuery)
                .then((gameTimes: WithId<GameTimes>) => {
                    return gameTimes.recordTimes;
                })
                .catch(() => {
                    console.log('Failed to get the game times');
                    throw new Error('Failed to get the game times');
                });
        } else return this.databaseErrorRecordTimes;
    }
    // To test
    async sortGameTimes(gameName: string, isMultiplayer: boolean): Promise<void> {
        if (isMultiplayer) {
            return this.collection
                .updateOne({ name: gameName }, { $push: { 'recordTimes.multiplayerGameTimes': { $each: [], $sort: { time: 1 } } } })
                .then(() => {})
                .catch(() => {
                    throw new Error('Failed to sort the multiplayer game record times');
                });
        } else {
            return this.collection
                .updateOne({ name: gameName }, { $push: { 'recordTimes.soloGameTimes': { $each: [], $sort: { time: 1 } } } })
                .then(() => {})
                .catch(() => {
                    throw new Error('Failed to sort the solo game record times');
                });
        }
    }
    // To test
    getPlayerRanking(timeArray: RecordTime[], playerRecordTime: string): number | undefined {
        for (let index = 0; index < timeArray.length; index++) {
            if (playerRecordTime === timeArray[index].time) {
                return index + 1;
            }
        }
        return;
    }
    // To test
    private async validateName(gameName: string): Promise<boolean> {
        const filterQuery: Filter<GameTimes> = { name: gameName };
        const game = await this.collection.findOne(filterQuery);
        return game?.name !== gameName;
    }
}
