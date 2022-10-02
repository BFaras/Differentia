import { MODIFIED_IMAGE_POSITION, ORIGINAL_IMAGE_POSITION } from '@common/const';
import { Game } from '@common/game';
import { Time } from '@common/time';
import * as fs from 'fs';
import { join } from 'path';
import { Service } from 'typedi';
// import { SocketManager } from './socketManager.service';

const IMAGES_PATH = 'assets/images/';

@Service()
export class GamesService {
    games: Game[];
    gameAdded: boolean;

    // Les constructeurs comme sa est ce que c'est mieux de juste les enlever???
    constructor() {}

    private async getGameImagesNames(gameName: string): Promise<string[]> {
        await this.asyncReadFile();
        const game = this.games.find((game) => game.name === gameName);
        return game!.images;
    }

    private async getGameImageData(imagePath: string): Promise<Buffer> {
        try {
            const imageData: Buffer = await fs.promises.readFile(IMAGES_PATH + imagePath);
            return imageData;
        } catch (err) {
            console.log('Something went wrong trying to read the image file:' + err);
            throw new Error(err);
        }
    }

    async getAllGames(): Promise<Game[]> {
        await this.asyncReadFile();
        return this.games;
    }

    async getAllGamesImagesData(): Promise<Buffer[][]> {
        const games: Game[] = await this.getAllGames();
        const gamesImagesData: Buffer[][] = [];

        games.forEach(async (game) => {
            gamesImagesData.push(await this.getGameImagesData(game.name));
        });

        return gamesImagesData;
    }

    async getGameImagesData(gameName: string): Promise<Buffer[]> {
        const gameImages = await this.getGameImagesNames(gameName);
        const gameImageData: Buffer[] = [];

        for (let i = ORIGINAL_IMAGE_POSITION; i <= MODIFIED_IMAGE_POSITION; i++) {
            gameImageData.push(await this.getGameImageData(gameImages[i]));
        }

        return gameImageData;
    }

    async addGame(gameToAdd: Game): Promise<Boolean> {
        await this.asyncReadFile();
        if (!this.validateName(gameToAdd.name)) {
            this.gameAdded = false;
        } else {
            this.games.push(gameToAdd);
            await this.asyncWriteFile();
            this.gameAdded = true;
        }
        return this.gameAdded;
    }

    validateName(name: string): boolean {
        return this.games.find((x) => x.name === name) ? false : true;
    }

    async addTimeToGame(newTime: Time, nameOfGame: string): Promise<void> {
        await this.asyncReadFile();
        this.games.find((game: Game) => {
            if (game.name === nameOfGame) game.times.push(newTime);
        });
        this.asyncWriteFile();
    }

    // Est ce que delete est nécessaire pour le sprint 1???

    // async deleteGame(nameOfGameToDelete: string) {
    //     await this.asyncReadFile();
    //     const newGames = this.games.filter((x: Game) => {
    //         return x.name !== nameOfGameToDelete
    //     })
    //     this.games = newGames;
    //     await this.asyncWriteFile();
    // }

    async asyncWriteFile() {
        try {
            await fs.promises.writeFile(join('games.json'), JSON.stringify({ games: this.games }), {
                flag: 'w',
            });
        } catch (err) {
            console.log('Something went wrong trying to write into the json file' + err);
            throw new Error(err);
        }
    }

    async asyncReadFile() {
        try {
            const result = await fs.promises.readFile(join('games.json'), 'utf-8');
            this.games = JSON.parse(result).games;
        } catch (err) {
            console.log('Something went wrong trying to read the json file:' + err);
            throw new Error(err);
        }
    }
}
