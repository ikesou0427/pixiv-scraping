import { Page, Response } from 'puppeteer';
import { writeFile } from 'fs';

import ExportPath from './export-path';
import PictureURL from './picture-url';

export default class Picture {
    private _url: PictureURL;
    private _export_path: ExportPath;

    constructor(url: PictureURL, export_path: ExportPath) {
        this._url = url;
        this._export_path = export_path;
    }

    get url(): string {
        return this._url.value;
    }

    public async store(page: Page) {
        const picture_data: Response | null = await page.goto(this._url.value, { referer : 'https://i.pximg.net' , waitUntil : 'networkidle0' });
        if (! picture_data) {
            throw new Error('画像データの取得に失敗しました。');
        }

        const picture_buffer: Buffer = await picture_data.buffer();
        writeFile(this._export_path.value, picture_buffer, (error) => {
            if (error) throw new Error('画像の保存に失敗しました。');
        });
        process.stdout.write("保存画像: " + this._export_path.value);
    }
}