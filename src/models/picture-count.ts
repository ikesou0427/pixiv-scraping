export default class PictureCount {
    private _value: number;

    constructor(picture_count: number) {
        if (! this.isValid(picture_count)) {
            throw new Error('不正な画像枚数が指定されました。 : ' + picture_count);
        }

        this._value = picture_count;
    }

    get value(): number {
        return this._value;
    }

    private isValid(picture_count: number): boolean {
        return 0 < picture_count;
    }

    public moreThan(limit: PictureCount): boolean {
        return limit.value < this._value;
    }
}