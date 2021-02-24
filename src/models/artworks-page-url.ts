import PageCount from "./page-count";
import Tag from "./tag";

export default class ArtworksPageURL {
    private _value: string;

    constructor(tag: Tag, page_count: PageCount) {
        this._value = this.buildArtworkPageURL(tag, page_count);
    }

    get value(): string {
        return this._value;
    }

    private buildArtworkPageURL(tag: Tag, page_count: PageCount): string {
        return `https://www.pixiv.net/tags/${ tag.value }/artworks?p=${ page_count.value }`;
    }

    public getNextArtworkPageURL(tag: Tag, page_count: PageCount): ArtworksPageURL {
        return new ArtworksPageURL(tag, page_count.increment());
    }
}