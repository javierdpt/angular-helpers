import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DynamicFilterDataService } from './dynamic-filter-data.service';
import { IFilterData, SearchTerms } from './dynamic-filter.model';
import { BaseUnsubscribeComponent } from '../../models/base-unsubscribe-component.model';

@Component({
    selector: 'app-dynamic-filter',
    templateUrl: './dynamic-filter.component.html',
    styleUrls: ['./dynamic-filter.component.scss']
})
export class DynamicFilterComponent extends BaseUnsubscribeComponent implements OnInit {
    @Output() terms!: BehaviorSubject<SearchTerms>;
    @Input() customClasses: string | string[] | Set<string> | { [klass: string]: any } = '';
    @Input() persistSearchedItems = true;
    @Input() closeAble = true;
    @Input() placeHolderLabelKey = 'Global_SearchByKeyword';
    @Input() alwaysVisible!: boolean;
    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

    displayed!: boolean;
    private _globalTerm!: string | null;
    get globalTerm(): string | null {
        return this._globalTerm;
    }
    set globalTerm(value: string | null) {
        this._globalTerm = value;
        if (!this.persistSearchedItems) {
            this.terms.next(new SearchTerms({ global: value }));
            return;
        }
        this.persistData((fd: IFilterData) => fd.terms.global = this._globalTerm);
    }

    constructor(private readonly _filterData: DynamicFilterDataService) {
        super();
        this.terms = new BehaviorSubject<SearchTerms>(new SearchTerms(_filterData.get().terms));
    }

    ngOnInit(): void {
        const data = this._filterData.get();
        this.displayed = !this.persistSearchedItems ? true : data.displayed;
        this._initGlobal(data);
        if (this.alwaysVisible !== undefined) {
            this.displayed = this.alwaysVisible;
        }
    }

    toggleDisplay(): void {
        this.displayed = !this.displayed;
        this.persistData((fi: IFilterData) => {
            fi.displayed = this.displayed;
            this.displayed === false && (fi.terms = { global: null, specifics: {} });
            this._globalTerm = null;
        });
    }

    // Wrap the call to FilterData.set to notify changes
    persistData(setter: (fd: IFilterData) => void): void {
        this._filterData.set(
            (fd: IFilterData) => {
                setter(fd);
                this.terms.next(new SearchTerms(fd.terms));
            }
        );
    }

    clean(): void {
        this.globalTerm = '';
        this.searchInput?.nativeElement && this.searchInput.nativeElement.focus();

    }

    private _initGlobal(data: IFilterData): void {
        if (!data.terms?.global) { return; }
        this._globalTerm = data.terms.global;
    }
}
