import { Browser, Page, launch } from 'puppeteer';
import { config }  from 'dotenv';
config();

import Artwork from './artwork';
import ArtworkID from './artwork-id';
import ArtworkURL from './artwork-url';
import ArtworksPage from './artworks-page';
import ArtworksPageURL from './artworks-page-url';
import Charactor from './charactor';
import ExportPath from './export-path';
import PageCount from './page-count';
import Picture from './picture';
import PictureCount from './picture-count';
import Tag from './tag';

const MY_USER_EMAIL: string = String(process.env.MY_USER_EMAIL);
const MY_PASSWORD: string = String(process.env.MY_PASSWORD);
const LOGIN_EMAIL_SELECTOR: string    = '#LoginComponent > form > div.input-field-group > div:nth-child(1) > input[type=text]';
const LOGIN_PASSWORD_SELECTOR: string = '#LoginComponent > form > div.input-field-group > div:nth-child(2) > input[type=password]';
const LOGIN_BUTTON_SELECTOR: string   = '#LoginComponent > form > button';

export default class Pixiv {
    private _browser: Browser;

    constructor(browser: Browser) {
        this._browser = browser;
    }

    public async login(): Promise<Pixiv> {
        const browser: Browser = await launch({
            headless : true,
            slowMo   : 2000
        });
        
        const page: Page = await browser.newPage();
        await page.setViewport({
            width  : 1600, 
            height : 1200
        });

        await page.goto('https://accounts.pixiv.net/login', {
                waitUntil : 'domcontentloaded',
                timeout   : 60000 
            });

        console.log('ログイン試行中...');
        await page.type(LOGIN_EMAIL_SELECTOR, MY_USER_EMAIL);
        await page.type(LOGIN_PASSWORD_SELECTOR, MY_PASSWORD);

        try {
            await Promise.all([
                page.click(LOGIN_BUTTON_SELECTOR),
                page.waitForNavigation({ timeout : 6000 })
            ]);

            page.close();
            console.log('ログインに成功しました。');
            
            return new Pixiv(browser);            
        }
        catch (error) {
            console.log('ログインに失敗しました。再度試行します。');
            browser.close();

            return this.login();
        }
    }

    public async * requestArtworkContexts(charactor: Charactor): AsyncGenerator<Artwork> {
        const page: Page = await this._browser.newPage();
        await page.setViewport({
                width  : 1600,
                height : 1200
            });

        const page_to_start_downloading: PageCount = charactor.page_to_start_downloading;
        const artwork_page_url = new ArtworksPageURL(charactor.tag, charactor.page_to_start_downloading);
        await page.goto(artwork_page_url.value , { 
            waitUntil : 'domcontentloaded',
            timeout   : 60000 
        });
        const artworks_page = new ArtworksPage(page, charactor.tag, page_to_start_downloading);

        const first_page_number = new PageCount(1);
        const downloaded_artwork_id: ArtworkID = charactor.last_access_artwork_id;

        if (page_to_start_downloading.equal(first_page_number)) {
            console.log('ブックマーク数が適正値ではないと思われるため、次のページからダウンロードを開始します。');
            await artworks_page.nextPage();
            const latest_work_url: ArtworkURL = await artworks_page.requestLatestArtworkURL();
            charactor.last_access_artwork_id = latest_work_url.extractID();
        }

        let artwork_urls: Array<ArtworkURL>;
        loop: while (0 < (artwork_urls = await artworks_page.requestArtworkURLs()).length) {
            for (const artwork_url of artwork_urls) {
                await artworks_page.waitForTimeout(1000);

                const artwork_contents = artworks_page.requestArtworkCountents(artwork_url);
                console.log(' 画像枚数: ' + artwork_contents.picture_count.value + ' ブックマーク数: ' + artwork_contents.bookmark_count.value);

                const artwork_id = artwork_contents.extractID();
                if (artwork_id.hasAlreadyBeenDownloaded(downloaded_artwork_id)) {
                    console.log('最後にアクセスした作品まで取得したため終了します。');
                    page.close();
                    break loop;
                } 
                
                if (artwork_contents.hasFewerBookmarksThan(charactor.limit_bookmark_count)) continue;

                // 制限枚数より多い場合大体漫画とかどうでもいい作品の可能性が高いので無視
                const limit_picture_count = new PictureCount(5);
                if (artwork_contents.hasMorePicturesThan(limit_picture_count)) continue;

                yield artwork_contents;
            }

            await artworks_page.nextPage();
        }
    }

    public buildStoringPictureJob(tag: Tag, artwork_context: Artwork): Array<Picture> {
        const base_picture_url = artwork_context.first_picture_url;
        const picture_urls = base_picture_url.generatePictureURLs(artwork_context.picture_count);

        const picture_jobs = Array<Picture>();
        for (const picture_url of picture_urls) {
            picture_jobs.push(new Picture(
                picture_url,
                new ExportPath(tag, artwork_context, picture_url.extractPictureName())
            ));
        }

        return picture_jobs;
    }
}