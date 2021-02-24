import { Browser, launch } from 'puppeteer';

import Artwork from './src/models/artwork';
import CharactorList from './src/models/charactor-list';
import PictureDownloadWorker from './src/models/picture-download-worker';
import PictureQueue from './src/models/picture-queue';
import Pixiv from './src/models/pixiv';

async function main() {
    const worker_browser: Browser = await launch({
        headless : true,
        slowMo : 250
    });
    const page_for_storing = await worker_browser.newPage();
    page_for_storing.setViewport({
        width: 1600,
        height: 1200
    });

    const picture_queue = new PictureQueue();
    const picture_worker = new PictureDownloadWorker(page_for_storing, picture_queue);
    await picture_worker.open();

    const pixiv = await new Pixiv(await launch()).login();
    const charactor_list = new CharactorList();
    
    // タイトルごとにURL取得処理開始
    for (const charactor of charactor_list.data) {
        if (charactor.skip) continue;
        console.log(charactor.tag.value + 'のダウンロードを開始します。');
        
        const iterator = await pixiv.requestArtworkContexts(charactor);

        let artwork_contexts: Artwork;
        while (artwork_contexts = (await iterator.next()).value) {
            const storing_picture_jobs = pixiv.buildStoringPictureJob(charactor.tag, artwork_contexts);
            for (const job of storing_picture_jobs) picture_queue.enqueue(job);
        }
    }

    charactor_list.write();
    picture_worker.shut();
}

main();