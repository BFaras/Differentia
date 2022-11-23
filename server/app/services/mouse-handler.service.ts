import { DEFAULT_USERNAME, FIRST_ARRAY_POSITION, IMAGE_WIDTH, NO_DIFFERENCE_FOUND_ARRAY } from '@common/const';
import { Game } from '@common/game';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { Position } from '@common/position';
import Container, { Service } from 'typedi';
import { HashmapConverterService } from './hashmap-converter.service';
import { GamesService } from './local.games.service';

@Service()
export class MouseHandlerService {
    nbDifferencesTotal: number;
    private differencesHashmap: Map<number, number>;
    private differencesList: number[][];
    private differenceAmountFoundByPlayer: Map<string, number>;
    private differencesNbFound: number[];

    constructor() {
        this.differencesHashmap = new Map<number, number>();
        this.differencesList = [];
        this.differencesNbFound = [];
        this.differenceAmountFoundByPlayer = new Map<string, number>();
        this.nbDifferencesTotal = 0;
    }

    resetDifferencesData() {
        this.differencesHashmap = new Map<number, number>();
        this.differencesList = [];
        this.nbDifferencesTotal = 0;
    }

    addPlayerToGame(plrSocketID: string) {
        this.differenceAmountFoundByPlayer.set(plrSocketID, 0);
    }

    getNumberOfDifferencesFoundByPlayer(plrSocketId: string): number {
        return this.differenceAmountFoundByPlayer.get(plrSocketId) as number;
    }

    getDifferentPixelListNotFound(): number[] {
        return this.doubleArrayToArray(this.getListOfDifferencesNotFound());
    }

    doubleArrayToArray(doubleArray: number[][]): number[] {
        const linearizedArray: number[] = [];

        for (let i = 0; i < doubleArray.length; i++) {
            for (let j = 0; j < doubleArray[i].length; j++) {
                linearizedArray.push(doubleArray[i][j]);
            }
        }

        return linearizedArray;
    }

    isValidClick(mousePosition: Position, plrSocketID: string): GameplayDifferenceInformations {
        return this.validateDifferencesOnClick(mousePosition, plrSocketID);
    }

    getListOfDifferencesNotFound(): number[][] {
        const differencesNotFound: number[][] = [];

        for (let i = 0; i < this.differencesList.length; i++) {
            if (!this.isDifferenceAlreadyFound(i)) {
                differencesNotFound.push(this.differencesList[i]);
            }
        }

        return differencesNotFound;
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
        return this.differencesNbFound.includes(differenceNb);
    }

    private convertMousePositionToPixelNumber(mousePosition: Position): number {
        return (mousePosition.y + 1) * IMAGE_WIDTH + mousePosition.x - IMAGE_WIDTH;
    }

    private incrementDifferenceAmountFoundForPlayer(plrSocketID: string) {
        this.differenceAmountFoundByPlayer.set(plrSocketID, this.getNumberOfDifferencesFoundByPlayer(plrSocketID) + 1);
    }

    // Ligne 119 pas couverte?
    private validateDifferencesOnClick(mousePosition: Position, plrSocketID: string): GameplayDifferenceInformations {
        const pixelNumber = this.convertMousePositionToPixelNumber(mousePosition);
        const differenceInformation: GameplayDifferenceInformations = {
            differencePixelsNumbers: NO_DIFFERENCE_FOUND_ARRAY,
            isValidDifference: false,
            socketId: plrSocketID,
            playerUsername: DEFAULT_USERNAME,
        };

        if (this.differencesHashmap.has(pixelNumber)) {
            const differencesNumber = this.differencesHashmap.get(pixelNumber) as number;

            if (!this.isDifferenceAlreadyFound(differencesNumber)) {
                this.differencesNbFound.push(differencesNumber);
                this.incrementDifferenceAmountFoundForPlayer(plrSocketID);
                differenceInformation.differencePixelsNumbers = this.differencesList[differencesNumber];
                differenceInformation.isValidDifference = true;
            }
        }

        return differenceInformation;
    }
}
