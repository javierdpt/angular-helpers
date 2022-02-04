import { ViewContainerRef } from '@angular/core';
import { SideModalComponentAnchorDirective } from '../../../../src/app/features/side-modal/side-modal-component-anchor.directive';
import { TestUtils } from '../../../core/tests-utils.model.spec';

describe('app/features/side-modal/SideModalComponentAnchorDirective', () => {
    it('should create an instance', () => {
        // arrange

        // act
        const sut = new SideModalComponentAnchorDirective(TestUtils.createSpyObj(ViewContainerRef));

        // assert
        expect(sut).toBeTruthy();
    });
});
