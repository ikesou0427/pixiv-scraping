import ArtworkID from './artwork-id';
import ArtworkURL from './artwork-url';
import BookmarkCount from './bookmark-count';
import PictureCount from './picture-count';
import PictureURL from './picture-url';
import Tag from './tag';

export default class Artwork {
    private _url: ArtworkURL;
    private _bookmark_count: BookmarkCount;
    private _picture_count: PictureCount;
    private _first_picture_url: PictureURL;


    constructor(contents: string, artwork_url: ArtworkURL) {
        this._url = artwork_url;
        this._bookmark_count = this.extractBookmarkCount(contents);
        this._picture_count = this.extractPictureCount(contents);
        this._first_picture_url = this.extractPictureURL(contents);
    }

    get bookmark_count(): BookmarkCount {
        return this._bookmark_count;
    }

    get picture_count(): PictureCount {
        return this._picture_count;
    }

    get first_picture_url(): PictureURL {
        return this._first_picture_url;
    }

    private extractTargetString(contents: string, regexp: RegExp): string {
        const match = contents.match(regexp);
        if (match) {
            return match[1];
        } 
        else {
            return '';
        }
    }

    public extractID(): ArtworkID {
        return this._url.extractID();
    }

    private extractPictureURL(contents: string): PictureURL {
        return new PictureURL(this.extractTargetString(contents, /\"regular\":\"(.+?)\"/));
    }

    private extractBookmarkCount(contents: string): BookmarkCount {
        return new BookmarkCount(parseInt(this.extractTargetString(contents, /\"bookmarkCount\":(\d+),/)));
    }

    public hasFewerBookmarksThan(limit: BookmarkCount): boolean {
        return this._bookmark_count.fewerThan(limit);
    }

    private extractPictureCount(contents: string): PictureCount {
        return new PictureCount(parseInt(this.extractTargetString(contents, /pageCount\":(\d+),\"bookmarkCount/)));
    }

    public hasMorePicturesThan(limit: PictureCount): boolean {
        return this._picture_count.moreThan(limit);
    }
}