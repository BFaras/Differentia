import { Game } from '@app/classes/game';
import { Time } from '../../../common/time'
import { Collection, Filter, FindOptions, ModifyResult, UpdateFilter, WithId } from 'mongodb';
import { HttpException } from '@app/classes/http.exception';
import { DatabaseService } from './database.service';
import { Service } from 'typedi';
import 'dotenv/config';

// J'ai recherché les jeux par leurs noms, est-ce c'est correct que je le fasse à partir de cet attribut????
// Est-ce que je devrais transformer toutes les throw new Error en throw new httpException?????

// const OK_CODE: number = 200;
// const CREATED_CODE: number = 201;
// const NO_CONTENT_CODE: number = 204;
// const NOT_MODIFIED_CODE: number = 304;
// const BAD_REQUEST_CODE: number = 400;
// const FORBIDDEN_CODE: number = 403;
const NOT_FOUND_CODE: number = 404;
// const GONE_CODE: number = 410;
const INTERNAL_SERVER_ERROR_CODE: number = 500;
// const NOT_IMPLEMENTED_CODE: number = 501;

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
    // NB: This can return null if the course does not exist, you need to handle it => HANDLED
    return this.collection
      .findOne({ name: nameOfWantedGame })
      .then((game: WithId<Game>) => {
        if(game) {
            return game;
        }
        throw new HttpException('Game not found', NOT_FOUND_CODE);
      });
  }

  async addGame(game: Game): Promise<void> {
    console.log("avant ntm");

    if (await this.validateGame(game)) {
      console.log("ntm");
      await this.collection.insertOne(game).catch((error: Error) => {
        console.log("J'ai throw");
        throw new HttpException('Failed to insert game', INTERNAL_SERVER_ERROR_CODE);
      });
    } else {
      console.log('apres ntm')
      throw new Error('Invalid game');
    }
  }

  async deleteGame(nameOfWantedGame: string): Promise<void> {
    return this.collection
      .findOneAndDelete({ name: nameOfWantedGame })
      .then((res: ModifyResult<Game>) => {
        if (!res.value) {
          throw new HttpException('Could not find game', NOT_FOUND_CODE);
        }
      })
      .catch(() => {
        throw new HttpException('Failed to delete game', INTERNAL_SERVER_ERROR_CODE);
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
    // Can also use replaceOne if we want to replace the entire object
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
    // Only get the times and not any of the other fields
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
      this.validateImages(game.images) && // est-ce qu'on devrait regarder si le jeu a tous ses attributs initialisés? ou c'est de l'abus
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
