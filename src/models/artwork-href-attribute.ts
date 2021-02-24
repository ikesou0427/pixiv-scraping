export default class ArtworkHrefAttribute {
    private _value: string;

    constructor(href: string) {
        if (! this.isValid(href)) {
            throw new Error("不正なHrefが取得されました。 : " + href);
        }

        this._value = href;
    }

    private isValid(href: string): boolean {
        return /^\/artworks\/\d+$/.test(href);
    }

    get value(): string {
        return this._value;
    }
}