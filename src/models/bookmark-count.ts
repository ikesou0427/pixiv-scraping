export default class BookmarkCount {
    private _value: number;

    constructor(bookmark_count: number) {
        if (! this.isValid(bookmark_count)) {
            throw new Error('不正なブックマーク数が指定されました。 : ' + bookmark_count);
        }

        this._value = bookmark_count;
    }

    get value(): number {
        return this._value;
    }

    private isValid(bookmark_count: number): boolean {
        return 0 <= bookmark_count;
    }

    public fewerThan(limit: BookmarkCount): boolean {
        return this._value < limit.value;
    }
}