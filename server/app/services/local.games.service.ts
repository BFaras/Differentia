import { Game } from '@common/game';
import { Time } from '@common/time';
import * as fs from 'fs';
import { join } from 'path';
import { Service } from 'typedi';
// import { SocketManager } from './socketManager.service';

@Service()
export class GamesService {
    games: Game[];
    gameAdded: boolean;

    // Les constructeurs comme sa est ce que c'est mieux de juste les enlever???
    constructor() {}

    async getAllGames(): Promise<Game[]> {
        await this.asyncReadFile();
        return this.games;
    }

    async getGameImages(gameName: string): Promise<string[]> {
        await this.asyncReadFile();
        const game = this.games.find((game) => game.name === gameName);
        return game!.images;
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
