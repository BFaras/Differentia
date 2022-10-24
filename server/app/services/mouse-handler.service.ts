import { FIRST_ARRAY_POSITION, IMAGE_WIDTH, NO_DIFFERENCE_FOUND_ARRAY } from '@common/const';
import { Game } from '@common/game';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { Position } from '@common/position';
import Container, { Service } from 'typedi';
import { HashmapConverterService } from './hashmap-converter.service';
import { GamesService } from './local.games.service';

@Service()
export class MouseHandlerService {
    differencesHashmap: Map<number, number>;
    differencesList: number[][];
    differencesNbFoundByPlayer: Map<string, number[]>;
    nbDifferencesTotal: number;

    constructor() {
        this.differencesHashmap = new Map<number, number>();
        this.differencesList = [];
        this.differencesNbFoundByPlayer = new Map<string, number[]>();
        this.nbDifferencesTotal = 0;
    }

    resetData() {
        this.differencesHashmap = new Map<number, number>();
        this.differencesNbFoundByPlayer = new Map<string, number[]>();
        this.differencesList = [];
    }

    //To test
    addPlayerToGame(plrSocketID: string) {
        this.differencesNbFoundByPlayer.set(plrSocketID, []);
    }

    //To test
    getNumberOfDifferencesFoundByPlayer(plrSocketId: string): number {
        return this.differencesNbFoundByPlayer.get(plrSocketId)!.length;
    }

    isValidClick(mousePosition: Position, plrSocketID: string): GameplayDifferenceInformations {
        return this.validateDifferencesOnClick(mousePosition, plrSocketID);
    }

    async generateDifferencesInformations(gameName: string) {
        const gamesService: GamesService = Container.get(GamesService);
        const hashmapConverter: HashmapConverterService = Container.get(HashmapConverterService);
        const game: Game = await gamesService.getGame(gameName);

        this.nbDifferencesTotal = game.numberOfDifferences;
        this.differencesList = this.copy2DNumberArray(game.differencesList);
        this.differencesHashmap = hashmapConverter.convertNumber2DArrayToNumberMap(this.differencesList);
    }

    private copy2DNumberArray(arrayToCopy: number[][]) {
        const copiedArray: number[][] = [];

        for (let i = FIRST_ARRAY_POSITION; i < arrayToCopy.length; i++) {
            copiedArray[i] = [];
            for (let j = FIRST_ARRAY_POSITION; j < arrayToCopy[i].length; j++) {
                copiedArray[i][j] = arrayToCopy[i][j];
            }
        }
        return copiedArray;
    }

    private isDifferenceAlreadyFound(differenceNb: number): boolean {
        let isAlreadyFound: boolean = false;
        this.differencesNbFoundByPlayer.forEach((differencesFound: number[]) => {
            if (differencesFound.includes(differenceNb)) {
                isAlreadyFound = true;
            }
        });

        return isAlreadyFound;
    }

    private convertMousePositionToPixelNumber(mousePosition: Position): number {
        return (mousePosition.y + 1) * IMAGE_WIDTH + mousePosition.x - IMAGE_WIDTH;
    }

    private validateDifferencesOnClick(mousePosition: Position, plrSocketID: string): GameplayDifferenceInformations {
        const pixelNumber = this.convertMousePositionToPixelNumber(mousePosition);
        let differenceInformation: GameplayDifferenceInformations = {
            differencePixelsNumbers: NO_DIFFERENCE_FOUND_ARRAY,
            isValidDifference: false,
            //To modify with a constant (constant is in feature/ChatGameView)
            playerName: '',
        };

        if (this.differencesHashmap.has(pixelNumber)) {
            let differencesNumber = this.differencesHashmap.get(pixelNumber)!;

            if (!this.isDifferenceAlreadyFound(differencesNumber)) {
                // Nouvelle Différence trouvée
                this.differencesNbFoundByPlayer.get(plrSocketID)!.push(differencesNumber);
                differenceInformation.differencePixelsNumbers = this.differencesList[differencesNumber];
                differenceInformation.isValidDifference = true;
            }
        }

        return differenceInformation;
    }
}
