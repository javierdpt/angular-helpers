import { SearchTerms } from '../../../../src/app/features/dynamic-filter/dynamic-filter.model';

describe('app/features/dynamic-filter/DynamicFilterDataService', () => {
    it('#constructor should init global null and specific {} when options is undefined', () => {
        // arrange

        // act
        const sut = new SearchTerms();

        // assert
        expect(sut.global).toBeNull();
        expect(sut.specifics).toEqual({});
    });

    it('#getTerms should return global terms lowered case', () => {
        // arrange
        const sut = new SearchTerms({ global: 'Test term', specifics: {} });

        // act
        const res = sut.getTerms();

        // assert
        expect(res.length).toBe(1);
        expect(res[0]).toBe('test term');
    });

    it('#getTerms should return global and specific terms in array', () => {
        // arrange
        const sut = new SearchTerms({
            global: 'Test term',
            specifics: { item1: ['item1'], item2: ['item2', 'item22'] }
        });

        // act
        const res = sut.getTerms();

        // assert
        expect(res).toEqual(['test term', 'item1', 'item2', 'item22']);
    });

    it('#getTerms should return only 4 valid values', () => {
        // arrange
        const sut = new SearchTerms({
            global: '    ',
            specifics: { item1: ['item1'], item2: ['item2', 'item22'], item3: [null as any, '', undefined, 'item3'] }
        });

        // act
        const res = sut.getTerms();

        // assert
        expect(res).toEqual(['item1', 'item2', 'item22', 'item3']);
    });

    it('#getTerms should return trimmed global term', () => {
        // arrange
        const sut = new SearchTerms({
            global: '    test',
            specifics: {}
        });

        // act
        const res = sut.getTerms();

        // assert
        expect(res).toEqual(['test']);
    });

    it('#getTerms should return empty terms when blank', () => {
        // arrange
        const sut = new SearchTerms();

        // act
        const res = sut.getTerms();

        // assert
        expect(res).toEqual([]);
    });

    it('#getTerms should ', () => {
        // arrange
        const sut = new SearchTerms({
            global: '    ',
            specifics: { item1: [] }
        });

        // act
        const res = sut.getTerms();

        // assert
        expect(res).toEqual([]);
    });
});
