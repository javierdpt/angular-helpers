import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ErrorUtilsService } from '../../../src/app/core/error-utils.service';
import { SharerTypes } from '../../../src/app/core/sharer.model';
import { SharerService } from '../../../src/app/core/sharer.service';
import { TestUtils } from '../../core/tests-utils.model.spec';

describe('app/core/ErrorUtilsService', () => {
    let sut: ErrorUtilsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
                TestUtils.getMockedValueProvider<SharerService<any>>(SharerService, ['add'])
            ]
        });
        sut = TestBed.inject(ErrorUtilsService);
    });

    it('should be created', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });

    describe('#redirectError', () => {
        it('should call router.navigate with ["/error/401"]', inject([Router], (routerStub: Router) => {
            // arrange

            // act
            sut.redirectError('401');

            // assert
            expect(routerStub.navigate).toHaveBeenCalledWith(['/error/401']);
        }));

        it('should call SharerService.add with "Test Error Message" and  SharerTypes.applicationTextError', () => {
            // arrange
            const sharerServiceStub = TestBed.inject(SharerService) as jasmine.SpyObj<SharerService<any>>;

            // act
            sut.redirectError('404', 'Test Error Message');

            // assert
            expect(sharerServiceStub.add).toHaveBeenCalledWith('Test Error Message', SharerTypes.applicationTextError);
        });
    });

    it('#redirectPageError should call redirectPageError', () => {
        // arrange
        const redirectErrorSpy = spyOn(sut, 'redirectError');

        // act
        sut.redirectPageError();

        // assert
        expect(redirectErrorSpy).toHaveBeenCalled();
    });

    it('#redirectPageNotFound should call redirectPageError with errorCode "404"', () => {
        // arrange
        const redirectErrorSpy = spyOn(sut, 'redirectError');

        // act
        sut.redirectPageNotFound();

        // assert
        expect(redirectErrorSpy).toHaveBeenCalledWith('404', '');
    });

    it('#redirectUnauthorizedPage should call redirectPageError with errorCode "401"', () => {
        // arrange
        const redirectErrorSpy = spyOn(sut, 'redirectError');

        // act
        sut.redirectUnauthorizedPage();

        // assert
        expect(redirectErrorSpy).toHaveBeenCalledWith('401', '');
    });

    it('#redirectGeneric should call redirectPageError with errorCode "generic"', () => {
        // arrange
        const redirectErrorSpy = spyOn(sut, 'redirectError');

        // act
        sut.redirectGeneric('Error message');

        // assert
        expect(redirectErrorSpy).toHaveBeenCalledWith('generic', 'Error message');
    });

    it('#redirectForbiddenPage should call redirectPageError with errorCode "403"', () => {
        // arrange
        const redirectErrorSpy = spyOn(sut, 'redirectError');

        // act
        sut.redirectForbiddenPage();

        // assert
        expect(redirectErrorSpy).toHaveBeenCalledWith('403', '');
    });
});
