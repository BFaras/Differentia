import { Service } from 'typedi';
import * as fileReader from 'fs';
import { join } from 'path'
import { Game } from '@common/game';

@Service()
export class GamesService {
    games: Array<Game>;
    constructor() {}
    
    async getAllGames() {
        // console.log("salut" + this.file);
        await this.asyncReadFile();
        return this.games;
    }

    // async AllGames(): Promise<any> {
    //     await fetch('games.json')
    //     .then(function(response) {
    //         return response.json();
    //     })
    //     .then(function(myJson) {
    //         console.log(JSON.stringify(myJson));
    //         //data = myJson;
    //     });
    // }

    async asyncReadFile() {
        try {
          const result = await fileReader.promises.readFile(
            join('games.json'),
            'utf-8',
          );
      
        //   (JSON.parse(result).games); // 👉️ "hello world hello world ..."
      
          this.games = JSON.parse(result).games;
        } catch (err) {
          console.log('Something went wrong trying to read the json file:' + err);
        }
      }
    
}
