import { HashmapConverterService } from '@app/services/hashmap-converter.service';
import { expect } from 'chai';
import { Container } from 'typedi';

describe('Hashmap Converter Service', () => {
    let hashmapConverterService: HashmapConverterService;

    beforeEach(async () => {
        hashmapConverterService = Container.get(HashmapConverterService);
    });

    it('should create', async () => {
        expect(hashmapConverterService).to.be.true;
    });
});
