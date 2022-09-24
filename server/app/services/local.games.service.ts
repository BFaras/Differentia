import { Service } from 'typedi';
import * as fs from 'fs';
import { join } from 'path'
import { Game } from '@common/game';
// import { SocketManager } from './socketManager.service';

@Service()
export class GamesService {
    games: Game[];
    gameAdded: boolean;
    constructor() {}
    
    async getAllGames(): Promise<Game[]> {
        await this.addGame({
            name: "Car game",
            numberOfDifferences: 8,
            times: [],
            images: []  
        });
        await this.asyncReadFile();
        return this.games;
    }

    async addGame(gameToAdd: Game): Promise<Boolean> {
        await this.asyncReadFile();
        if(!this.validateName(gameToAdd.name)) {
            console.log("rejet car meme nom");
            this.gameAdded = false;
        }
        else {
            this.games.push(gameToAdd);
            await this.asyncWriteFile();
            this.gameAdded = true;
        }
        return this.gameAdded;
    }

    validateName(name: string): boolean {
        return this.games.find((x) => x.name === name)? false : true;
    }

    async deleteGame(nameOfGameToDelete: string) {
        await this.asyncReadFile();
        const newGames = this.games.filter((x: Game) => {
            return x.name !== nameOfGameToDelete
        })
        this.games = newGames;
        await this.asyncWriteFile();
    }

    async asyncWriteFile() {
        try  {
            fs.promises.writeFile(
                join('games.json'),
                JSON.stringify({games : this.games}),
                {
                    flag: 'w',
                }
            );
            const result = await fs.promises.readFile(
                join('games.json'),
                'utf-8',
            );
            console.log(result);
        } catch(err) {
            console.log('Something went wrong trying to write into the json file' + err);
        }
    }

    async asyncReadFile() {
        try {
          const result = await fs.promises.readFile(
            join('games.json'),
            'utf-8',
          );     
          this.games = JSON.parse(result).games;
        } catch (err) {
          console.log('Something went wrong trying to read the json file:' + err);
        }
      }
    
}
