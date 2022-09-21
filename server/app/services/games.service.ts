import { Game } from '@app/classes/game';
import { Time } from '../../../common/time'
import { Collection, Filter, FindOptions, ModifyResult, UpdateFilter, WithId } from 'mongodb';
import { HttpException } from '@app/classes/http.exception';
import { DatabaseService } from './database.service';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
import 'dotenv/config';

@Service()
export class GamesService {

  constructor(private databaseService: DatabaseService) {
  }

  get collection(): Collection<Game> {
    return this.databaseService.database.collection(
        process.env.DATABASE_COLLECTION!
    );
  }

  async getAllGames(): Promise<Game[]> {
    return this.collection
      .find({})
      .toArray()
      .then((game: Game[]) => {
        return game;
      });
  }

  async getGame(nameOfWantedGame: string): Promise<Game> {
    return this.collection
      .findOne({ name: nameOfWantedGame })
      .then((game: WithId<Game>) => {
        if(game) {
            return game;
        }
        throw new HttpException('Game not found', StatusCodes.NOT_FOUND);
      });
  }

  async addGame(game: Game): Promise<void> {
    if (await this.validateGame(game)) {
      await this.collection.insertOne(game).catch((error: Error) => {
        throw new HttpException('Failed to insert game', StatusCodes.INTERNAL_SERVER_ERROR);
      });
    } else {
      throw new Error('Invalid game');
    }
  }

  async deleteGame(nameOfWantedGame: string): Promise<void> {
    return this.collection
      .findOneAndDelete({ name: nameOfWantedGame })
      .then((res: ModifyResult<Game>) => {
        if (!res.value) {
          throw new HttpException('Could not find game', StatusCodes.NOT_FOUND);
        }
      })
      .catch(() => {
        throw new HttpException('Failed to delete game', StatusCodes.INTERNAL_SERVER_ERROR);
      });
  }

  
  async modifyGame(game: Game): Promise<void> {
    let filterQuery: Filter<Game> = { name: game.name };
    let updateQuery: UpdateFilter<Game> = {
      $set: {
        name: game.name,
        numberOfDifferences: game.numberOfDifferences,
        times: game.times,
        images: game.images, 
      },
    };
    return this.collection
    .updateOne(filterQuery, updateQuery)
    .then(() => { })
    .catch(() => {
      throw new Error('Failed to update game');
    });
  }
  
  async addNewTimeToGame(newTime: Time, nameOfWantedGame: string): Promise<void> {
    let modifiedGame = await this.getGame(nameOfWantedGame);
    modifiedGame.times.push(newTime);
    this.modifyGame(modifiedGame);
  }
  
  async getGameTimes(nameOfWantedGame: string): Promise<Time[]> {
    let filterQuery: Filter<Game> = { name: nameOfWantedGame };
    let projection: FindOptions = { projection: { times: 1, _id: 0 } };
    return this.collection
      .findOne(filterQuery, projection)
      .then((game: WithId<Game>) => {
        return game.times;
      })
      .catch(() => {
        throw new Error('Failed to get the game times');
      });
  }

  async getGameNumberOfDifferences(nameOfWantedGame: string): Promise<number> {
    let filterQuery: Filter<Game> = { name: nameOfWantedGame };
    return this.collection
      .findOne(filterQuery)
      .then((game: WithId<Game>) => {
        return game.numberOfDifferences;
      });
  }

  private async validateGame(game: Game): Promise<boolean> {
    return (
      this.validateNumberOfDifferences(game.numberOfDifferences) &&
      this.validateImages(game.images) &&
      this.validateTimes(game.times) &&
      await this.validateName(game.name)
    );
  }

  private validateNumberOfDifferences(numberOfDifferences: number): boolean {
    return numberOfDifferences >= 3 && numberOfDifferences <= 9;
  }

  private validateImages(images: string[]): boolean { // À revoir l'implémentation de cette fonction
    return images[0] != null && images[1] != null;
  }

  private validateTimes(times: Time[]): boolean {
    return times.length === 0;
  }

  private async validateName(name: string): Promise<boolean> {
    let filterQuery: Filter<Game> = { name: name };
    const game = await this.collection
      .findOne(filterQuery);
    return game?.name !== name;
  }
}
