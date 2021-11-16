import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { NEVER, Observable } from 'rxjs';
import { skip, take } from 'rxjs/operators';
import { WINDOW } from '../../../src/app/core/injection-token.service';
import { MobileOsEnum, OsEnums } from '../../../src/app/core/utils.model';
import { UtilsService } from '../../../src/app/core/utils.service';
import { IMitigatingAction, MitigatingActionType } from '../../../src/app/models/mitigation-action.model';
import { TestUtils } from '../../core/tests-utils.model.spec';

describe('app/core/UtilsService', () => {
    let sut: UtilsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TestUtils.getMockedValueProvider(WINDOW, ['addEventListener'],
                    ['navigator', 'location', 'opera' as any])
            ]
        });
        sut = TestBed.inject(UtilsService);
    });

    it('should be created', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });

    it('#getRandomInt should return random int greater than 5 and less than 10', () => {
        // arrange

        // act
        const res = sut.getRandomInt(5, 10);

        // assert
        expect(res).toBeGreaterThanOrEqual(5);
        expect(res).toBeLessThanOrEqual(10);
    });

    describe('#getRandomStr', () => {
        it('should generate random string between 30 and 100, without numbers and first letter not capitalized', () => {
            // arrange

            // act
            const res = sut.getRandomStr(30, 100);

            // assert
            expect(res.length).toBeGreaterThanOrEqual(30);
            expect(res.length).toBeLessThanOrEqual(100);
            expect(res).not.toMatch(/\d{1,}/);
            expect(res.charAt(0)).toBe(res.charAt(0).toLowerCase());
        });

        it('should generate random string with numbers', () => {
            // arrange

            // act
            const res = sut.getRandomStr(30, 100, false, true);

            // assert
            expect(res).toMatch(/\d{1,}/);
        });

        it('should generate random string with first letter uppercase', () => {
            // arrange

            // act
            const res = sut.getRandomStr(30, 100, true, true);

            // assert
            expect(res.charAt(0)).toBe(res.charAt(0).toUpperCase());
        });
    });

    describe('#getRandomWords', () => {
        it('should generate a random string with 10 words and each words between 10 and 20 chars', () => {
            // arrange

            // act
            const res = sut.getRandomWords(10, 10, 20);

            // assert
            expect(res.split(' ').length).toBe(10);
            res.split(' ').forEach(w => {
                expect(w.length).toBeGreaterThanOrEqual(10);
                expect(w.length).toBeLessThanOrEqual(20);
            });
        });

        it('should generate a random paragraph with first letter capital', () => {
            // arrange

            // act
            const res = sut.getRandomWords(10, 10, 20, true);

            // assert
            expect(res.charAt(0)).toBe(res.charAt(0).toUpperCase());
        });
    });

    describe('#padNumber', () => {
        it('should add 0 at the begging of the number of from 0-9', () => {
            // arrange

            // act
            const res = sut.padNumber(5);

            // assert
            expect(res).toBe('05');
        });

        it('should not add 0 at the begging of 25', () => {
            // arrange

            // act
            const res = sut.padNumber(25);

            // assert
            expect(res).toBe('25');
        });

        it('should return empty string if not number', () => {
            // arrange

            // act
            const res = sut.padNumber('a' as any);

            // assert
            expect(res).toBe('');
        });
    });

    describe('#isNumber', () => {
        it('should return true', () => {
            // arrange

            // act
            const res = sut.isNumber(123);

            // assert
            expect(res).toBeTrue();
        });

        it('should return false', () => {
            // arrange

            // act
            const res = sut.isNumber('test');

            // assert
            expect(res).toBeFalse();
        });
    });

    describe('#toInteger', () => {
        it('should return string as integer', () => {
            // arrange

            // act
            const res = sut.toInteger('123');

            // assert
            expect(res).toBe(123);
        });
    });

    describe('#isMobileOrTabletDevice', () => {
        it('should return true', () => {
            // arrange
            const windowStub = TestBed.inject(WINDOW);
            TestUtils.setSpiedObjGetter(windowStub, 'navigator',
                { userAgent: 'blah blah iphone blah blah' } as Navigator
            );

            // act
            const res = sut.isMobileOrTabletDevice();

            // assert
            expect(res).toBeTrue();
        });

        it('should return false', () => {
            // arrange
            const windowStub = TestBed.inject(WINDOW);
            TestUtils.setSpiedObjGetter(windowStub, 'navigator',
                { userAgent: 'blah blah blah blah' } as Navigator
            );

            // act
            const res = sut.isMobileOrTabletDevice();

            // assert
            expect(res).toBeFalse();
        });

        it('should use vendor if window.navigator.useAgent is not defined and return true', () => {
            // arrange
            const windowStub = TestBed.inject(WINDOW);
            TestUtils.setSpiedObjGetter(windowStub, 'navigator',
                { vendor: 'blah blah android blah blah' } as Navigator
            );

            // act
            const res = sut.isMobileOrTabletDevice();

            // assert
            expect(res).toBeTrue();
        });

        it('should use window.opera for opera and return true', () => {
            // arrange
            const windowStub = TestBed.inject(WINDOW);
            TestUtils.setSpiedObjGetter(windowStub as any, 'opera',
                'blah blah blackberry blah navigator');
            TestUtils.setSpiedObjGetter(windowStub, 'navigator', {} as Navigator);

            // act
            const res = sut.isMobileOrTabletDevice();

            // assert
            expect(res).toBeTrue();
        });
    });

    describe('#getOS', () => {
        it('should return OsEnum.mac', () => {
            // arrange
            const windowStub = TestBed.inject(WINDOW);
            TestUtils.setSpiedObjGetter(windowStub, 'navigator',
                { platform: 'Macintosh', userAgent: '' } as Navigator
            );

            // act
            const res = sut.getOS();

            // assert
            expect(res).toBe(OsEnums.mac);
        });

        it('should return OsEnum.ios', () => {
            // arrange
            const windowStub = TestBed.inject(WINDOW);
            TestUtils.setSpiedObjGetter(windowStub, 'navigator',
                { userAgent: 'iPhone' } as Navigator
            );

            // act
            const res = sut.getOS();

            // assert
            expect(res).toBe(OsEnums.ios);
        });

        it('should return OsEnum.windows', () => {
            // arrange
            const windowStub = TestBed.inject(WINDOW);
            TestUtils.setSpiedObjGetter(windowStub, 'navigator',
                { platform: 'Win64', userAgent: '' } as Navigator
            );

            // act
            const res = sut.getOS();

            // assert
            expect(res).toBe(OsEnums.windows);
        });

        it('should return OsEnum.android', () => {
            // arrange
            const windowStub = TestBed.inject(WINDOW);
            TestUtils.setSpiedObjGetter(windowStub, 'navigator',
                { userAgent: 'Android' } as Navigator
            );

            // act
            const res = sut.getOS();

            // assert
            expect(res).toBe(OsEnums.android);
        });

        it('should return OsEnum.linux', () => {
            // arrange
            const windowStub = TestBed.inject(WINDOW);
            TestUtils.setSpiedObjGetter(windowStub, 'navigator',
                { platform: 'Linux', userAgent: '' } as Navigator
            );

            // act
            const res = sut.getOS();

            // assert
            expect(res).toBe(OsEnums.linux);
        });

        it('should return null when not found', () => {
            // arrange
            const windowStub = TestBed.inject(WINDOW);
            TestUtils.setSpiedObjGetter(windowStub, 'navigator', { userAgent: '' } as Navigator);

            // act
            const res = sut.getOS();

            // assert
            expect(res).toBe(null);
        });
    });

    describe('#getMobileOperatingSystem', () => {
        it('should return MobileOsEnum.windowsPhone', () => {
            // arrange
            const windowStub = TestBed.inject(WINDOW);
            TestUtils.setSpiedObjGetter(windowStub, 'navigator',
                { userAgent: 'blah windows phone blah blah' } as Navigator
            );
            // act
            const res = sut.getMobileOperatingSystem();

            // assert
            expect(res).toBe(MobileOsEnum.windowsPhone);
        });

        it('should return MobileOsEnum.android', () => {
            // arrange
            const windowStub = TestBed.inject(WINDOW);
            TestUtils.setSpiedObjGetter(windowStub, 'navigator',
                { vendor: 'blah blah android blah' } as Navigator
            );
            // act
            const res = sut.getMobileOperatingSystem();

            // assert
            expect(res).toBe(MobileOsEnum.android);
        });

        it('should return MobileOsEnum.ios', () => {
            // arrange
            const windowStub = TestBed.inject(WINDOW);
            TestUtils.setSpiedObjGetter(windowStub, 'navigator', {} as Navigator);
            TestUtils.setSpiedObjGetter(windowStub as any, 'opera', 'blah iPad blah blah');

            // act
            const res = sut.getMobileOperatingSystem();

            // assert
            expect(res).toBe(MobileOsEnum.ios);
        });

        it('should return MobileOsEnum.unknown', () => {
            // arrange
            const windowStub = TestBed.inject(WINDOW);
            TestUtils.setSpiedObjGetter(windowStub, 'navigator', {} as Navigator);

            // act
            const res = sut.getMobileOperatingSystem();

            // assert
            expect(res).toBe(MobileOsEnum.unknown);
        });
    });

    describe('#getUrlParameter', () => {
        beforeEach(() => {
            const windowStub = TestBed.inject(WINDOW);
            TestUtils.setSpiedObjGetter(windowStub, 'location',
                { search: 'http://url.com?queryParam=test&otherParam=otherTest' } as Location);
        });

        it('should return test for queryParam', () => {
            // arrange

            // act
            const res = sut.getUrlParameter('queryParam');

            // assert
            expect(res).toBe('test');
        });

        it('should return empty string for "param"', () => {
            // arrange

            // act
            const res = sut.getUrlParameter('param');

            // assert
            expect(res).toBe('');
        });
    });

    describe('#centerText', () => {
        it('should return for center "test" with 20 => "        test        "', () => {
            // arrange

            // act
            const res = sut.centerText(20, 'test');

            // assert
            expect(res).toBe('        test        ');
        });

        it('should return for "test" with 21 and char - => "---------test--------"', () => {
            // arrange

            // act
            const res = sut.centerText(21, 'test', '-');

            // assert
            expect(res).toBe('---------test--------');
        });
    });

    describe('#padText', () => {
        it('should return for "test" with 10, "left" => "      test"', () => {
            // arrange

            // act
            const res = sut.padText(10, 'left', 'test');

            // assert
            expect(res).toBe('      test');
        });

        it('should return for "test" with 10, "right" => "      test"', () => {
            // arrange

            // act
            const res = sut.padText(15, 'right', 'test', '-');

            // assert
            expect(res).toBe('test-----------');
        });

        it('should return for "this is a test" with 10', () => {
            // arrange

            // act
            const res = sut.padText(10, 'left', 'this is a test', '.');

            // assert
            expect(res).toBe('this is a test');
        });
    });

    describe('#getRandomItemFromArray', () => {
        it('should return null', () => {
            // arrange

            // act
            const res = sut.getRandomItemFromArray([]);

            // assert
            expect(res).toBeNull();
        });

        it('should an random item from the array', () => {
            // arrange

            // act
            const res = sut.getRandomItemFromArray([1, 2, 3]);

            // assert
            expect([1, 2, 3].includes(res!)).toBeTrue();
        });
    });

    describe('#getRandomArray', () => {
        it('should an array of numbers with length between 5-10', () => {
            // arrange

            // act
            const res = sut.getRandomArray(5, 10);

            // assert
            expect(res.length).toBeGreaterThanOrEqual(5);
            expect(res.length).toBeLessThanOrEqual(10);
        });
    });

    describe('#getRandomArray', () => {
        it('should an array of numbers with length between 5-10 and of string', () => {
            // arrange

            // act
            const res = sut.getRandomArrayTransformed(5, 10, (i) => i.toString());

            // assert
            expect(res.length).toBeGreaterThanOrEqual(5);
            expect(res.length).toBeLessThanOrEqual(10);
            expect(res[0]).toBeInstanceOf(String);
        });
    });

    describe('#getObjectKeyValuePairs', () => {
        let input: any;
        beforeEach(() => {
            input = {
                item1: 'item1',
                item2: 'item2',
                item3: 'item3',
                item4: 'item4',
                item5: 'item5',
            };
        });

        it('should return 5 items', () => {
            // arrange

            // act
            const res = sut.getObjectKeyValuePairs({
                input
            });

            // assert
            expect(res.length).toBe(5);
        });

        it('should ignore prop item3, item5', () => {
            // arrange
            const ignoredProps = ['item3', 'item5'];

            // act
            const res = sut.getObjectKeyValuePairs({
                input, ignoredProps
            });

            // assert
            expect(res).toEqual([
                { title: 'item1', value: 'item1' },
                { title: 'item2', value: 'item2' },
                { title: 'item4', value: 'item4' }
            ]);
        });

        it('should call transform value for key if specified', () => {
            // arrange
            const transform = (key: string, value: any): string => key === 'item1' ? 'item1 transformed' : value;

            // act
            const res = sut.getObjectKeyValuePairs({
                input, transform
            });

            // assert
            expect(res.find(i => i.title === 'item1')?.value).toBe('item1 transformed');
        });

        it('should order the items like "item2", "item1", "item5", "item3", "item4"', () => {
            // arrange
            const order = ['item2', 'item1', 'item5'];

            // act
            const res = sut.getObjectKeyValuePairs({
                input, order
            });

            // assert
            expect(res.map(i => i.title)).toEqual(['item2', 'item1', 'item5', 'item3', 'item4']);
        });
    });

    describe('#getEntitySearchTerm', () => {
        it('should return 1◬3◬four', () => {
            // arrange

            // act
            const res = sut.getEntitySearchTerm(
                { one: '1', two: '2', three: '3', four: 'FOur' },
                ['one', 'three', 'four']);

            // assert
            expect(res).toBe('1◬3◬four');
        });
    });

    describe('#getFilteredEntityOptions', () => {
        type TestType = { id: string; value: string; desc: string };
        let control: FormControl;
        let entities: TestType[];
        let res: Observable<TestType[]>;

        beforeEach(() => {
            control = new FormControl();
            entities = [
                { id: '1', value: 'one', desc: 'desc1' },
                { id: '2', value: 'two', desc: 'desc2' },
                { id: '3', value: 'three', desc: 'desc3' },
                { id: '4', value: 'ffour', desc: 'desc4' },
                { id: '5', value: 'ffive', desc: 'desc5' },
            ];

            res = sut.getFilteredEntityOptions(
                NEVER, entities, control, ['value']
            );
        });


        it('should return two values', (done: DoneFn) => {
            // arrange

            // assert
            res.pipe(skip(1), take(1))
                .subscribe(v => {
                    expect(v.length).toBe(2);
                    done();
                });

            // act
            control.setValue('ff');
        });

        it('should return all values', (done: DoneFn) => {
            // arrange

            // assert
            res.pipe(skip(1), take(1))
                .subscribe(v => {
                    expect(v.length).toBe(entities.length);
                    done();
                });

            // act
            control.setValue(null);
        });
    });

    describe('#getMitigatingActionText', () => {
        it('should return empty string when args.ma is not defined', () => {
            // arrange

            // act
            const res = sut.getMitigatingActionText(null);

            // assert
            expect(res).toBe('');
        });

        it('should return "<span class="d-block">Issue Identifier: <span class="badge bg-secondary">ISSUE</span></span>"', () => {
            // arrange

            // act
            const res = sut.getMitigatingActionText({
                id: 'ID',
                mitigatingActionType: MitigatingActionType.CreateIssue,
                causalDescription: 'Desc',
                issueIdentifier: 'ISSUE'
            } as IMitigatingAction);

            // assert
            expect(res)
                .toBe(
                    '<span class="d-block strong">Issue Identifier: <span class="badge bg-secondary">ISSUE</span></span>'
                );
        });

        it('should return "<span class="d-block">Issue Identifier: <span class="badge bg-secondary">ISSUE</span></span>' +
            '<span class="d-block">Dynamic Field: <span class="badge bg-secondary">DF</span></span>"', () => {
                // arrange

                // act
                const res = sut.getMitigatingActionText({
                    id: 'ID',
                    mitigatingActionType: MitigatingActionType.CreateIssue,
                    causalDescription: 'Desc',
                    issueIdentifier: 'ISSUE',
                    dynamicField: 'DF'
                } as IMitigatingAction);

                // assert
                expect(res).toBe(
                    '<span class="d-block strong">Issue Identifier: <span class="badge bg-secondary">ISSUE</span>' +
                    '</span><span class="d-block strong">Dynamic Field: <span class="badge bg-secondary">DF</span></span>'
                );
            });
    });

    describe('#getMitigatingActionDynamicKeyValues', () => {
        it('should return empty array when args.ma is not defined', () => {
            // arrange

            // act
            const res = sut.getMitigatingActionDynamicKeyValues(null);

            // assert
            expect(res).toEqual([]);
        });

        it('should return issueIdentifier:ISSUE and dynamicField:DF key value pairs', () => {
            // arrange

            // act
            const res = sut.getMitigatingActionDynamicKeyValues({
                id: 'ID',
                mitigatingActionType: MitigatingActionType.CreateIssue,
                causalDescription: 'Desc',
                issueIdentifier: 'ISSUE',
                dynamicField: 'DF'
            } as IMitigatingAction);

            // assert
            expect(res).toEqual([
                { key: 'issueIdentifier', value: 'ISSUE' },
                { key: 'dynamicField', value: 'DF' }
            ]);
        });
    });

    describe('#getEnumValues', () => {
        enum Test {
            val1 = 'v1', val2 = 'v2', val3 = 'v3'
        }

        it('should return an array with 3 values', () => {
            // arrange

            // act
            const res = sut.getEnumValues(Test);

            // assert
            expect(res).toHaveSize(3);
        });
    });
});
