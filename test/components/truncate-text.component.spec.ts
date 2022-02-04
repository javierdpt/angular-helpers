import { EventEmitter } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TruncateTextComponent } from '../../../../src/app/shared/components/truncate-text.component';
import { SharedModule } from '../../../../src/app/shared/shared.module';

describe('app/shared/components/TruncateTextComponent', () => {
    let sut: TruncateTextComponent;
    let fixture: ComponentFixture<TruncateTextComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedModule],
            declarations: [TruncateTextComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TruncateTextComponent);
        sut = fixture.componentInstance;
        sut.text = 'This is a long textToTest the truncate component.';
        sut.limit = 20;
        fixture.detectChanges();
    });

    it('should create', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });

    describe('#constructor', () => {
        it('should init limit defaulted to 20, keepLast defaulted to false, separator defaulted to "..." and animated to true', () => {
            // arrange

            // act

            // assert
            expect(sut.limit).toBe(20);
            expect(sut.keepLast).toBeFalse();
            expect(sut.animated).toBeTruthy();
            expect(sut.separator).toBe('...');
        });
    });

    describe('#ngOnInit', () => {
        it('#_init should initialize truncated with true', () => {
            // arrange

            // act

            // assert
            expect(sut.truncated).toBeTrue();
        });

        it('#_init should initialize toggler to be "..." by default', () => {
            // arrange

            // act

            // assert
            expect(sut.toggler).toBe('...');
        });

        it('#_init should initialize text ignoring last word being equal to "This is a long textT"', () => {
            // arrange

            // act

            // assert
            expect(sut.val).toBe('This is a long textT');
        });

        it('#_init should initialize text keeping last word being equal to "This is a long textToTest"', () => {
            // arrange
            sut.keepLast = true;

            // act
            sut.ngOnInit();

            // assert
            expect(sut.val).toBe('This is a long textToTest');
        });

        it('#_init should initialize value equal to text if limit is greater than the length of the text', () => {
            // arrange
            sut.limit = 150;

            // act
            sut.ngOnInit();

            // assert
            expect(sut.val).toBe(sut.text);
        });

        it('#_init should reinitialize value when textChanged is set and it emits', (done: DoneFn) => {
            // arrange
            const textChanged$ = new EventEmitter<void>();
            sut.textChanged = textChanged$;

            // act
            sut.ngOnInit();

            // assert
            expect(sut.val).toBe('This is a long textT');
            sut.text = 'New text';
            sut.limit = 2;
            sut.keepLast = true;
            textChanged$.subscribe(() => {
                expect(sut.val).toBe('New');
                done();
            });
            textChanged$.emit();
        });
    });

    describe('#toggle', () => {
        it('when animated is false should display text and toggler be " (less)"', () => {
            // arrange
            sut.animated = false;

            // act
            sut.toggle();

            // assert
            expect(sut.val).toBe(sut.text);
            expect(sut.toggler).toBe(' (less)');
        });

        it('when animated is false and text is displayed should display the truncated value and toggler be "..."', () => {
            // arrange
            sut.animated = false;
            sut.toggle();

            // act
            sut.toggle();

            // assert
            expect(sut.val).toBe('This is a long textT');
            expect(sut.toggler).toBe('...');
        });

        it('when animated is true should display text and toggler be " (less)"', fakeAsync(() => {
            // arrange
            sut.animated = true;
            sut.animationInterval = 0;

            // act
            sut.toggle();
            tick(100);

            // assert
            expect(sut.val).toBe(sut.text);
            expect(sut.toggler).toBe(' (less)');
        }));

        it('when animated is true and is text is displayed should display the truncated value and toggler be "..."',
            fakeAsync(() => {
                // arrange
                sut.animated = true;
                sut.animationInterval = 0;
                sut.toggle();
                tick(100);

                // act
                sut.toggle();
                tick(100);

                // assert
                expect(sut.val).toBe('This is a long textT');
                expect(sut.toggler).toBe('...');
            }));
    });

    describe('#hostClasses', () => {
        it('should add "app-truncate-text" to current element class', () => {
            // arrange
            sut.class = 'class1';

            // act
            const res = sut.hostClasses;

            // assert
            expect(res).toBe('class1 app-truncate-text');
        });
    });
});
