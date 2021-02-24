import { Page } from 'puppeteer';
import request from 'sync-request';

import Artwork from './artwork';
import ArtworkHrefAttribute from './artwork-href-attribute';
import ArtworkURL from './artwork-url';
import ArtworksPageURL from './artworks-page-url';
import PageCount from './page-count';
import Tag from './tag';

const ARTWORKS_HREF_SELECTOR: string = '#root > div > div > div > div > div > section > div > ul > li > div > div:nth-child(1) > div > a';
const GIF_OR_MUTE_SELECTOR: string = 'div > svg';

export default class ArtworksPage {
    private _value: Page;
    private _tag: Tag;
    private _count: PageCount;
    private _url: ArtworksPageURL;

    constructor(page: Page, tag: Tag, page_count: PageCount) {
        this._value = page;
        this._tag = tag;
        this._count = page_count;

        this._url = new ArtworksPageURL(tag, page_count);
    }

    private async requestLatestArtworkHref(): Promise<ArtworkHrefAttribute> {
        const artwork_href_attribute = await this._value.evaluate(function (selector) {
            const element_data: Element = document.querySelector(selector);

            const url = element_data.getAttribute('href');
            if (! url) {
                throw new Error('データが取得できませんでした。');
            }

            return url;
        }, ARTWORKS_HREF_SELECTOR);

        return new ArtworkHrefAttribute(artwork_href_attribute);
    }
    
    public async requestLatestArtworkURL(): Promise<ArtworkURL> {
        const artwork_href_attribute = await this.requestLatestArtworkHref();
        return new ArtworkURL(artwork_href_attribute);
    }

    private async requestArtworkHrefs(): Promise<Array<ArtworkHrefAttribute>> {
        const artworks_href = await this._value.evaluate(function (selector, skip_selector) {
            const artworks_href: Array<string> = [];
            const element_data: NodeListOf<Element> = document.querySelectorAll(selector);
            
            element_data.forEach(function(element: Element) {
                if (element.querySelector(skip_selector) === null) {
                    const href: string | null = element.getAttribute('href');
                    if (href !== null) artworks_href.push(href);
                }
            });
            return artworks_href;
        }, ARTWORKS_HREF_SELECTOR, GIF_OR_MUTE_SELECTOR);

        return artworks_href.map(href => new ArtworkHrefAttribute(href))
    }

    public async requestArtworkURLs(): Promise<Array<ArtworkURL>> {
        const artwork_hrefs_attribute = await this.requestArtworkHrefs();
        return artwork_hrefs_attribute.map(href => new ArtworkURL(href));
    }

    public async nextPage(): Promise<void> {
        this._url = this._url.getNextArtworkPageURL(this._tag, this._count);
        this._count = this._count.increment();

        await this._value.goto(this._url.value, { 
                waitUntil : 'domcontentloaded',
                timeout   : 60000 
            });
        await this._value.waitForSelector(ARTWORKS_HREF_SELECTOR);
        console.log('タグ: ' + this._tag.value + '  ' + this._count.value + 'ページ目に移動しました。');
    }

    public requestArtworkCountents(artwork_url: ArtworkURL): Artwork {
        return new Artwork(request('GET', artwork_url.value).getBody().toString(), artwork_url);
    }

    public async waitForTimeout(milliseconds: number): Promise<void> {
        await this._value.waitForTimeout(milliseconds);
    }
}