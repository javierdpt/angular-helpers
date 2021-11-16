import { nameof } from '../../../src/app/core/utils.model';

describe('app/core/nameof', () => {
    it('should return "id"', () => {
        // arrange

        // act
        const res = nameof<{ id: string; value: string }>('id');

        // assert
        expect(res).toBe('id');
    });
});
