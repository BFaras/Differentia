import { Service } from 'typedi';
import { Games } from '@app/classes/games' 

@Service()
export class GamesService {
    games: Games = new Games();
    constructor() {}
    
    getAllGames() {
        return this.games.games;
    }
    
}
