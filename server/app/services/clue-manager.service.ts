import { CLUE_AMOUNT_DEFAULT, NO_MORE_CLUES_AMOUNT, SECOND_CLUE_NB } from '@app/server-consts';
import { ClueInformations } from '@common/clue-informations';
import { EMPTY_ARRAY_LENGTH, FIRST_ARRAY_POSITION } from '@common/const';
import { randomInt } from 'crypto';
import * as io from 'socket.io';
import Container, { Service } from 'typedi';
import { ClueFinderService } from './clue-finder.service';
import { MouseHandlerService } from './mouse-handler.service';

@Service()
export class ClueManagerService {
    private clueFinderService: ClueFinderService;

    constructor() {
        this.clueFinderService = Container.get(ClueFinderService);
    }

    resetSocketClueAmount(socket: io.Socket) {
        socket.data.amountOfClues = CLUE_AMOUNT_DEFAULT;
    }

    sendClueToPlayerSocket(socket: io.Socket, gameMouseHandlerService: MouseHandlerService) {
        if (this.areCluesLeftForSocket(socket)) {
            const differencesNotFoundList: number[][] = gameMouseHandlerService.getListOfDifferencesNotFound();
            if (differencesNotFoundList.length > EMPTY_ARRAY_LENGTH) {
                const amountOfClues = this.getSocketClueAmount(socket);

                if (amountOfClues >= SECOND_CLUE_NB) {
                    const clueQuadrantNb = this.clueFinderService.findClueQuandrantFromClueNumber(amountOfClues, differencesNotFoundList);
                    const clueInformations: ClueInformations = {
                        clueAmountLeft: amountOfClues,
                        clueDifferenceQuadrant: clueQuadrantNb,
                    };
                    socket.emit('Clue with quadrant of difference', clueInformations);
                } else {
                    const radomDiffNotFoundPixels = differencesNotFoundList[randomInt(FIRST_ARRAY_POSITION, differencesNotFoundList.length)];
                    socket.emit('Clue with difference pixels', radomDiffNotFoundPixels);
                }
            }
        }
        this.decrementSocketClueAmount(socket);
    }

    private areCluesLeftForSocket(socket: io.Socket): boolean {
        return this.getSocketClueAmount(socket) > NO_MORE_CLUES_AMOUNT;
    }

    private decrementSocketClueAmount(socket: io.Socket) {
        this.setSocketClueAmountLeft(socket, this.getSocketClueAmount(socket) - 1);
    }

    private getSocketClueAmount(socket: io.Socket): number {
        return socket.data.amountOfClues;
    }

    private setSocketClueAmountLeft(socket: io.Socket, newAmountOfClues: number) {
        if (newAmountOfClues >= NO_MORE_CLUES_AMOUNT) {
            socket.data.amountOfClues = newAmountOfClues;
        }
    }
}
