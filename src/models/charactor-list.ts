import CharactorObject from './charactor-object';
import Charactor from './charactor';

import { readFileSync, writeFile } from 'fs';
import { join } from 'path';

const json_path: string = join(__dirname, '..', '..', 'default.json');

export default class CharactorList {
    private _data: Array<Charactor>;

    constructor() {
        this._data = this.load();
    }

    get data(): Array<Charactor> {
        return this._data;
    }

    private load(): Array<Charactor> {
        const charactor_list: Array<Charactor> = Array<Charactor>();
        const charactor_data: Array<CharactorObject> = Object.values(JSON.parse(readFileSync(json_path, "utf-8")));

        for (const charactor of charactor_data) {
            charactor_list.push(new Charactor(charactor));
        }

        return charactor_list;
    }

    public write(): void {
        const charadata_list = Array<CharactorObject>();
        for (const charactor of this._data) {
            const charactor_data: CharactorObject = {
                tag                       : charactor.tag.value,
                limit_bookmark_count      : charactor.limit_bookmark_count.value,
                page_to_start_downloading : charactor.page_to_start_downloading.value,
                last_access_artwork_id    : charactor.last_access_artwork_id.value,
                skip                      : charactor.skip
            }
            charadata_list.push(charactor_data);
        }
        writeFile(json_path, JSON.stringify(charadata_list), (error) => {
            if (error) throw new Error('キャラクターデータの保存に失敗しました。');
        });
    }
}