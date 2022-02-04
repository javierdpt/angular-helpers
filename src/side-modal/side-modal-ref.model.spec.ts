import { ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { SideModalRef } from '../../../../src/app/features/side-modal/side-modal-ref.model';
import { SideModalComponent } from '../../../../src/app/features/side-modal/side-modal.component';
import { TestUtils } from '../../../core/tests-utils.model.spec';

describe('app/features/SideModalRef', () => {
    let sut: SideModalRef<any, any, any>;
    let viewContainerRefStub: jasmine.SpyObj<ViewContainerRef>;
    let subStopper$: Subject<void>;

    beforeEach(() => {
        viewContainerRefStub = TestUtils.createSpyObj(ViewContainerRef, ['clear']);
        sut = new SideModalRef({} as any, viewContainerRefStub, {} as any);
        subStopper$ = new Subject<void>();
    });

    afterEach(() => {
        subStopper$.next();
        subStopper$.complete();
    });

    it('should create', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeDefined();
    });

    describe('#close', () => {
        it('should call sideModalComponentRef.hide', () => {
            // arrange
            sut.sideModalComponentRef = TestUtils.createSpyObj(SideModalComponent, ['hide']);

            // act
            sut.close({});

            // assert
            expect(sut.sideModalComponentRef.hide).toHaveBeenCalled();
        });

        it('should emit dialogResult on onClose', () => {
            // arrange
            sut.sideModalComponentRef = TestUtils.createSpyObj(SideModalComponent, ['hide']);
            const dialogResult = { dialog: 'result' };

            // assert
            sut.onClose(subStopper$).subscribe(res =>
                expect(res).toBe(dialogResult));

            // act
            sut.close(dialogResult);
        });

        it('should call viewContainerRef', () => {
            // arrange
            sut.sideModalComponentRef = TestUtils.createSpyObj(SideModalComponent, ['hide']);
            const dialogResult = { dialog: 'result' };

            // assert
            sut.onClose(subStopper$).subscribe(res =>
                expect(res).toBe(dialogResult));

            // act
            sut.close(dialogResult);
        });
    });

    describe('#onClose', () => {
        it('should emit "CloseVal"', (done: DoneFn) => {
            // arrange

            // assert
            sut.onClose(subStopper$)
                .subscribe((val: string) => {
                    expect(val).toBe('CloseVal');
                    done();
                });

            // act
            sut.close('CloseVal');
        });
    });

    describe('#afterClosed', () => {
        it('should emit "CloseVal"', (done: DoneFn) => {
            // arrange

            // assert
            sut.afterClosed(subStopper$)
                .subscribe((val: string) => {
                    expect(val).toBe('CloseVal');
                    done();
                });

            // act
            sut.close('CloseVal');
        });
    });

    describe('#opened & #afterOpened', () => {
        it('should emit value for afterOpened', () => {
            // arrange
            const afterOpenedEmittedValueSpy = jasmine.createSpy();
            sut.afterOpened(subStopper$)
                .subscribe(() => {
                    afterOpenedEmittedValueSpy();
                });

            // act
            sut.opened();

            // assert
            expect(afterOpenedEmittedValueSpy).toHaveBeenCalled();
        });
    });
});
