import { DEFAULT_USERNAME, FIRST_ARRAY_POSITION, IMAGE_WIDTH, NO_DIFFERENCE_FOUND_ARRAY } from '@common/const';
import { Game } from '@common/game';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { Position } from '@common/position';
import Container, { Service } from 'typedi';
import { HashmapConverterService } from './hashmap-converter.service';
import { GamesService } from './local.games.service';

@Service()
export class MouseHandlerService {
    private differencesHashmap: Map<number, number>;
    private differencesList: number[][];
    private differencesNbFoundByPlayer: Map<string, number[]>;
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

    addPlayerToGame(plrSocketID: string) {
        this.differencesNbFoundByPlayer.set(plrSocketID, []);
    }

    getNumberOfDifferencesFoundByPlayer(plrSocketId: string): number {
        return this.differencesNbFoundByPlayer.get(plrSocketId)!.length;
    }

    // To test Charles
    //T'as pas de type de retour pour la fonction ici
    getDifferentPixelList(plrSocketID: string, gameName: string) {
        //Non, pas nécessaire, la liste de différence est déjà présente quand on a initialisé le jeu
        this.generateDifferencesInformations(gameName); // Est-ce que necessaire
        return this.differencesList; // ou map (La liste, pas la map)
        //Il faudra que tu linéarise le tableau pour que ce soit un tableau 1D au lieu de 2D
        //Il faudra que t'utilise ma fonction getListOfDifferencesNotFound() et non la liste de différence directe,
        //car il faut juste que tu fasse clignoter les différences restante! (c'est ça qui ets écrit)
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
            socketId: plrSocketID,
            playerUsername: DEFAULT_USERNAME,
        };

        if (this.differencesHashmap.has(pixelNumber)) {
            let differencesNumber = this.differencesHashmap.get(pixelNumber)!;

            if (!this.isDifferenceAlreadyFound(differencesNumber)) {
                this.differencesNbFoundByPlayer.get(plrSocketID)!.push(differencesNumber);
                differenceInformation.differencePixelsNumbers = this.differencesList[differencesNumber];
                differenceInformation.isValidDifference = true;
            }
        }

        return differenceInformation;
    }
}
