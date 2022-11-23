import { MODIFIED_IMAGE_POSITION, ORIGINAL_IMAGE_POSITION } from '@common/const';
import { Game } from '@common/game';
//import { Time } from '@common/time';
import * as fs from 'fs';
import { join } from 'path';
import Container, { Service } from 'typedi';
import { RecordTimesService } from './database.games.service';
import { DatabaseService } from './database.service';

const IMAGES_PATH = 'assets/images/';

@Service()
export class GamesService {
    private gamesFilePath: string = 'games.json';
    private games: Game[];
    private databaseService: DatabaseService
    private recordTimesService: RecordTimesService;

    constructor() {
        this.databaseService = Container.get(DatabaseService);
        this.recordTimesService = new RecordTimesService(this.databaseService);
    }

    async getGame(gameName: string): Promise<Game> {
        await this.asyncReadGamesFile();
        const game: Game = (await this.getAllGames()).find((game) => game.name === gameName) as Game;
        return game;
    }

    async getAllGames(): Promise<Game[]> {
        await this.asyncReadGamesFile();
        return this.games;
    }

    async getAllGamesWithImagesData() {
        const games: Game[] = await this.getAllGames();

        for (let i = 0; i < games.length; i++) {
            const gameImagesData: string[] = await this.getGameImagesData(games[i].name);
            games[i].images[ORIGINAL_IMAGE_POSITION] = gameImagesData[ORIGINAL_IMAGE_POSITION];
            games[i].images[MODIFIED_IMAGE_POSITION] = gameImagesData[MODIFIED_IMAGE_POSITION];
            games[i].times = await this.recordTimesService.getGameTimes(games[i].name);
        }

        return games;
    }

    async getGameImagesData(gameName: string): Promise<string[]> {
        const gameImages = await this.getGameImagesNames(gameName);
        const gameImagesData: string[] = [];

        for (let i = ORIGINAL_IMAGE_POSITION; i <= MODIFIED_IMAGE_POSITION; i++) {
            const imageDataBuffer: Buffer = await this.getGameImageData(gameImages[i]);
            gameImagesData.push('data:image/bmp;base64,' + imageDataBuffer.toString('base64'));
        }

        return gameImagesData;
    }

    async addGame(gameToAdd: Game): Promise<Boolean> {
        let gameAdded = false;
        await this.asyncReadGamesFile();
        if (this.validateName(gameToAdd.name)) {
            this.games.push(gameToAdd);
            await this.asyncWriteInGamesFile();
            gameAdded = true;
        }
        return gameAdded;
    }

    validateName(name: string): boolean {
        return this.games.find((x) => x.name === name) ? false : true;
    }

    // async addTimeToGame(newTime: Time, nameOfGame: string): Promise<void> {
    //     await this.asyncReadGamesFile();
    //     this.games.find((game: Game) => {
    //         if (game.name === nameOfGame) game.times.push(newTime);
    //     });
    //     this.asyncWriteInGamesFile();
    // }

    async deleteGame(nameOfGameToDelete: string) {
        await this.asyncReadGamesFile();
        const newGames = this.games.filter((game: Game) => {
            if (game.name === nameOfGameToDelete) {
                this.deleteImages(game.images[0], game.images[1]);
            }
            return game.name !== nameOfGameToDelete;
        });
        this.games = newGames;
        await this.asyncWriteInGamesFile();
        return this.games;
    }

    async resetGameList() {
        let nameList: string[] = [];
        this.games.filter((game: Game) => {
            this.deleteImages(game.images[0], game.images[1]);
            nameList.push(game.name);
        });
        this.games = [];
        await this.asyncWriteInGamesFile();
        return nameList;
    }

    async asyncWriteInGamesFile() {
        try {
            await fs.promises.writeFile(join(this.gamesFilePath), JSON.stringify({ games: this.games }), {
                flag: 'w',
            });
        } catch (err) {
            console.log('Something went wrong trying to write into the json file' + err);
            throw new Error(err);
        }
    }

    async asyncReadGamesFile() {
        try {
            const result = await fs.promises.readFile(join(this.gamesFilePath), 'utf-8');
            this.games = JSON.parse(result).games;
        } catch (err) {
            console.log('Something went wrong trying to read the json file:' + err);
            throw new Error(err);
        }
    }

    private deleteImages(image1: string, image2: string) {
        fs.rm(IMAGES_PATH + image1, (err) => {
            if (err) throw err;
        });
        fs.rm(IMAGES_PATH + image2, (err) => {
            if (err) throw err;
        });
    }

    private async getGameImagesNames(gameName: string): Promise<string[]> {
        return (await this.getGame(gameName)).images;
    }

    private async getGameImageData(imageName: string): Promise<Buffer> {
        try {
            const imageData: Buffer = await fs.promises.readFile(IMAGES_PATH + imageName);
            return imageData;
        } catch (err) {
            console.log('Something went wrong trying to read the image file:' + err);
            throw new Error(err);
        }
    }
}
