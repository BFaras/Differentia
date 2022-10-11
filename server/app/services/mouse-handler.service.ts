import { IMAGE_WIDTH } from '@common/const';
import { Game } from '@common/game';
import { Position } from '@common/position';
import { Service } from 'typedi';
import { HashmapConverterService } from './hashmap-converter.service';
import { GamesService } from './local.games.service';

@Service()
export class MouseHandlerService {
    differencesHashmap: Map<number, number>;
    differencesNumberFound: Array<number>;
    nbDifferencesTotal: number;

    constructor() {
        this.differencesHashmap = new Map<number, number>();
        this.differencesNumberFound = [];
        this.nbDifferencesTotal = 0;
    }

    resetData() {
        this.differencesHashmap = new Map<number, number>();
        this.differencesNumberFound = [];
    }

    isValidClick(mousePosition: Position) {
        return this.validateDifferencesOnClick(mousePosition);
    }

    //To test
    async generateDifferencesInformations(gameName: string) {
        const gamesService: GamesService = new GamesService();
        const hashmapConverter: HashmapConverterService = new HashmapConverterService();
        const game: Game = await gamesService.getGame(gameName);

        this.nbDifferencesTotal = game.numberOfDifferences;
        this.differencesHashmap = hashmapConverter.convertNumber2DArrayToNumberMap(game.differencesList);
    }

    convertMousePositionToPixelNumber(mousePosition: Position): number {
        return (mousePosition.y + 1) * IMAGE_WIDTH + mousePosition.x - IMAGE_WIDTH;
    }

    private validateDifferencesOnClick(mousePosition: Position) {
        const pixelNumber = this.convertMousePositionToPixelNumber(mousePosition);
        let differencesNumber: number;
        let pixelIsDifferent: boolean = true;
        let mapResponse = new Map<string, any>();

        if (this.differencesHashmap.has(pixelNumber)) {
            differencesNumber = this.differencesHashmap.get(pixelNumber)!;

            if (this.differencesNumberFound.includes(differencesNumber)) {
                // La différence a déjà été trouvée précédemment
                pixelIsDifferent = false;
            } else {
                // Nouvelle Différence trouvée
                this.differencesNumberFound.push(differencesNumber);
            }
        } else {
            // Afficher Erreur et suspendre/ignorer les clics pendant 1s
            pixelIsDifferent = false;
        }
        mapResponse.set('booleanValue', pixelIsDifferent);
        mapResponse.set('pixelList', this.differencesNumberFound);
        return mapResponse;
    }
}
