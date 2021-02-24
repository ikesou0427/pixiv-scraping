export default class Tag {
    private _value: string;

    constructor(tag: string) {
        if (! this.isValid(tag)) {
            throw new Error('不正なページ数が指定されました。');
        }

        this._value = tag;
    }

    get value(): string {
        return this._value;
    }

    private isValid(tag: string): boolean {
        return 0 < tag.length;
    }
}