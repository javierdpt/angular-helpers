export interface IFilterData {
    displayed: boolean;
    terms: ISearchTerms;
}

export interface ISearchTerms {
    global: string | null;
    specifics?: { [key: string]: string[] };
}

export class SearchTerms implements ISearchTerms {
    global: string | null;
    specifics: { [key: string]: string[] };

    constructor(options?: ISearchTerms) {
        this.global = options?.global ?? null;
        this.specifics = options?.specifics ?? {};
    }

    getTerms(): string[] {
        let resp: string[] = [];
        const globalTerm = this.global?.trim().toLowerCase();
        globalTerm && resp.push(globalTerm);
        const specificsKeys = Object.keys(this.specifics);
        const specifics = specificsKeys
            .map((key: string) => this.specifics[key])
            .filter(sf => !!sf.length);
        specifics.length && (resp = resp
            .concat(specifics
                .reduce((accumulator: string[], next: string[]) => accumulator.concat(next))
                .filter((v: string) => !!v)
            )
            .map((v: string) => v.trim().toLowerCase())
        );
        return resp;
    }
}
