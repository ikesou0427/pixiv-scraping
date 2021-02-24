import ArtworkID from './artwork-id';
import ArtworkHrefAttribute from './artwork-href-attribute';

const PIXIV_HOST: string = 'https://www.pixiv.net';

export default class ArtworkURL {
    private _value: string;

    constructor(href: ArtworkHrefAttribute) {
        this._value = PIXIV_HOST + href.value;
    }

    get value(): string {
        return this._value;
    }

    public extractID(): ArtworkID {
        const split_href: Array<string> = this._value.split('/');
        const tail_index = 4;
        return new ArtworkID(parseInt(split_href[tail_index]));
    }
}