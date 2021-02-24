import { Page } from 'puppeteer';

import Picture from './picture';
import PictureQueue from './picture-queue';

export default class PictureDownloadWorker {
    private _page: Page;
    private _status: string;
    private _queue: PictureQueue;

    constructor(page: Page, queue: PictureQueue) {
        this._page = page;
        this._status = 'init';
        this._queue = queue;
    }

    private async storePicture(): Promise<void> {    
        await this._page.waitForTimeout(2000);
        
        const picture: Picture | undefined = this._queue.dequeue();
        if (! picture) {
            if (this._status === 'finish') this._page.browser().close();
            else this.storePicture();

            return;
        }

        try {
            await picture.store(this._page);
            console.log(" 待機job数：" + this._queue.size() + "枚");
        } 
        catch (error) {
            console.log('保存失敗: ' + picture.url);
            this._queue.enqueue(picture);
        }
        
        this.storePicture();
    }

    public async open() {
        this._status = 'active';
        this.storePicture();
    }

    // TODO: 命名検討
    public shut() {
        this._status = 'finish';
    }
}