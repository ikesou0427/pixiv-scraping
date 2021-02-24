export default class ArtworkID {
    private _value: number;

    constructor(id: number) {
        if (! this.isValid(id)) {
            throw new Error("不正なIDが指定されました。 : " + id);
        }

        this._value = id;
    }

    get value(): number {
        return this._value;
    }

    private isValid(id: number): boolean {
        return 0 < id;
    }

    public hasAlreadyBeenDownloaded(id: ArtworkID): Boolean {
        return this._value <= id.value;
    }
}