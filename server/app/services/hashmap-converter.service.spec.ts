import { HashmapConverterService } from '@app/services/hashmap-converter.service';
import { expect } from 'chai';
import { Container } from 'typedi';

describe('Hashmap Converter Service', () => {
    const numberMapConvertionTest = new Map<number, number>([
        [555, 0],
        [556, 0],
        [655, 1],
        [666, 1],
        [779, 2],
        [780, 2],
    ]);
    const number2DArrayConvertionTest = [
        [555, 556],
        [655, 666],
        [779, 780],
    ];
    let hashmapConverterService: HashmapConverterService;
    let nbOfSubArraysTest: number;

    beforeEach(async () => {
        hashmapConverterService = Container.get(HashmapConverterService);
        nbOfSubArraysTest = number2DArrayConvertionTest.length;
    });

    it('should convert correctly a number map to a 2D number array', () => {
        expect(hashmapConverterService.convertNumberMapToNumber2DArray(numberMapConvertionTest, nbOfSubArraysTest)).to.deep.equals(
            number2DArrayConvertionTest,
        );
    });

    it('should convert correctly a 2D number array to a number map', () => {
        expect(hashmapConverterService.convertNumber2DArrayToNumberMap(number2DArrayConvertionTest)).to.deep.equals(numberMapConvertionTest);
    });
});
