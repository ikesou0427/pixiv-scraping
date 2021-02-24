export default class PageCount {
    private _value: number;

    constructor(page_count: number) {
        if (! this.isValid(page_count)) {
            throw new Error('不正なページ数が指定されました。 : ' + page_count);
        }

        this._value = page_count;
    }

    get value(): number {
        return this._value;
    }

    private isValid(page_count: number): boolean {
        return 0 < page_count;
    }

    public increment(): PageCount {
        return new PageCount(this._value + 1);
    }

    public equal(page_count: PageCount): boolean {
        return this._value === page_count.value;
    }
}