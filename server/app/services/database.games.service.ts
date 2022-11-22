import { Collection, Filter, FindOptions, WithId } from 'mongodb';
//import { Time } from '../../../common/time';
import { HttpException } from '@app/classes/http.exception';
import { DatabaseService } from './database.service';
import { StatusCodes } from 'http-status-codes';
import { GameTimes } from '@common/game-times';
import { GameModeTimes } from '@common/games-record-times';
import 'dotenv/config';
import { Service } from 'typedi';

@Service()
export class RecordTimesService {
    constructor(private databaseService: DatabaseService) {}

    get collection(): Collection<GameTimes> {
        return this.databaseService.database.collection(process.env.DATABASE_COLLECTION!);
    }

    // async getAllGames(): Promise<Game[]> {
    //   return this.collection
    //     .find({})
    //     .toArray()
    //     .then((game: Game[]) => {
    //       return game;
    //     });
    // }

    async getGame(nameOfWantedGame: string): Promise<GameTimes> {
      return this.collection
        .findOne({ name: nameOfWantedGame })
        .then((game: WithId<GameTimes>) => {
          if(game) {
              return game;
          }
          throw new HttpException('Game not found', StatusCodes.NOT_FOUND);
        });
    }

    // async addGame(game: Game): Promise<void> {
    //   if (await this.validateGame(game)) {
    //     await this.collection.insertOne(game).catch((error: Error) => {
    //       throw new HttpException('Failed to insert game', StatusCodes.INTERNAL_SERVER_ERROR);
    //     });
    //   } else {
    //     throw new Error('Invalid game');
    //   }
    // }

    // async deleteGame(nameOfWantedGame: string): Promise<void> {
    //   return this.collection
    //     .findOneAndDelete({ name: nameOfWantedGame })
    //     .then((res: ModifyResult<Game>) => {
    //       if (!res.value) {
    //         throw new HttpException('Could not find game', StatusCodes.NOT_FOUND);
    //       }
    //     })
    //     .catch(() => {
    //       throw new HttpException('Failed to delete game', StatusCodes.INTERNAL_SERVER_ERROR);
    //     });
    // }

    // async modifyGame(game: Game): Promise<void> {
    //   let filterQuery: Filter<Game> = { name: game.name };
    //   let updateQuery: UpdateFilter<Game> = {
    //     $set: {
    //       name: game.name,
    //       numberOfDifferences: game.numberOfDifferences,
    //       times: game.times,
    //       images: game.images,
    //     },
    //   };
    //   return this.collection
    //   .updateOne(filterQuery, updateQuery)
    //   .then(() => { })
    //   .catch(() => {
    //     throw new Error('Failed to update game');
    //   });
    // }

    // async addNewTimeToGame(newTime: Time, nameOfWantedGame: string): Promise<void> {
    //     let modifiedGame = await this.getGame(nameOfWantedGame);
    //     modifiedGame.times.push(newTime);
    //     this.modifyGame(modifiedGame);
    // }

    async getGameTimes(nameOfWantedGame: string): Promise<GameModeTimes> {
        let filterQuery: Filter<GameTimes> = { name: nameOfWantedGame };
        let projection: FindOptions = { projection: { recordTimes: 1, _id: 0 } };
        return this.collection
            .findOne(filterQuery, projection)
            .then((gameTimes: WithId<GameTimes>) => {
                return gameTimes.recordTimes;
            })
            .catch(() => {
                throw new Error('Failed to get the game times');
            });
    }

    // async getGameNumberOfDifferences(nameOfWantedGame: string): Promise<number> {
    //   let filterQuery: Filter<Game> = { name: nameOfWantedGame };
    //   return this.collection
    //     .findOne(filterQuery)
    //     .then((game: WithId<Game>) => {
    //       return game.numberOfDifferences;
    //     });
    // }

    // private async validateGame(game: Game): Promise<boolean> {
    //   return (
    //     this.validateNumberOfDifferences(game.numberOfDifferences) &&
    //     this.validateTimes(game.times) &&
    //     await this.validateName(game.name)
    //   );
    // }

    // private validateNumberOfDifferences(numberOfDifferences: number): boolean {
    //     return numberOfDifferences >= 3 && numberOfDifferences <= 9;
    // }

    // private validateTimes(times: Time[]): boolean {
    //     return times.length === 0;
    // }

    // private async validateName(name: string): Promise<boolean> {
    //   let filterQuery: Filter<Game> = { name: name };
    //   const game = await this.collection
    //     .findOne(filterQuery);
    //   return game?.name !== name;
    // }
}
