import { FIRST_ARRAY_POSITION } from '@common/const';
import { Service } from 'typedi';

@Service()
export class HashmapConverterService {
    convertNumberMapToNumber2DArray(hashmapToConvert: Map<number, number>, nbOfSubArrays: number): number[][] {
        const differencesList: number[][] = [];

        for (let i = FIRST_ARRAY_POSITION; i < nbOfSubArrays; i++) {
            differencesList[i] = [];
        }

        hashmapToConvert.forEach((subArrayPosition, valueToAddToSubArray) => {
            differencesList[subArrayPosition].push(valueToAddToSubArray);
        });

        return differencesList;
    }

    convertNumber2DArrayToNumberMap(arrayToConvert: number[][]): Map<number, number> {
        const mapGenerated = new Map<number, number>();

        for (let subbArrayPosition = FIRST_ARRAY_POSITION; subbArrayPosition < arrayToConvert.length; subbArrayPosition++) {
            for (let elementPosition = FIRST_ARRAY_POSITION; elementPosition < arrayToConvert[subbArrayPosition].length; elementPosition++) {
                mapGenerated.set(arrayToConvert[subbArrayPosition][elementPosition], subbArrayPosition);
            }
        }

        return mapGenerated;
    }
}
