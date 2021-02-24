import ArtworkID from './artwork-id';
import BookmarkCount from './bookmark-count';
import CharactorObject from './charactor-object';
import PageCount from './page-count';
import Tag from './tag';

export default class Charactor {
    private _data: CharactorObject;

    constructor(charactor_data: CharactorObject) {
        this._data = charactor_data;
    }

    get tag(): Tag {
        return new Tag(this._data.tag);
    }

    get limit_bookmark_count(): BookmarkCount {
        return new BookmarkCount(this._data.limit_bookmark_count);
    }
    
    get page_to_start_downloading(): PageCount {
        return new PageCount(this._data.page_to_start_downloading);
    }

    get last_access_artwork_id(): ArtworkID {
        return new ArtworkID(this._data.last_access_artwork_id);
    }
    
    set last_access_artwork_id(last_access_artwork_id: ArtworkID) {
        this._data.last_access_artwork_id = last_access_artwork_id.value;
    }

    get skip(): boolean {
        return this._data.skip;
    }
}