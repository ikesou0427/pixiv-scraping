import { join } from 'path';

import Artwork from './artwork';
import BookmarkCount from './bookmark-count';
import Tag from './tag';

const HOME_DIR: string = join(__dirname, 'pictures');

export default class ExportPath {
    private _value: string;

    constructor(tag: Tag, artwork_contents: Artwork, picture_name: string) {
        this._value = join(HOME_DIR, tag.value, this.assignExportDirectory(artwork_contents), picture_name);
    }

    get value(): string {
        return this._value;
    }

    private  assignExportDirectory(artwork_contents: Artwork): string {
        const limit_bookmark = new BookmarkCount(10000);

        let directory_name: string = '';
        if (artwork_contents.hasFewerBookmarksThan(limit_bookmark)) {
            directory_name += 'under10000';
        }
        else {
            directory_name += 'over10000';
        }
    
        return directory_name;
    }
}