import PictureCount from './picture-count';

export default class PictureURL {
    private _value: string;

    constructor(url: string) {
        if (! this.isValid(url)) {
            throw new Error('不正なURLが指定されました。 : ' + url);
        }

        this._value = url;
    }

    get value(): string {
        return this._value;
    }

    private isValid(url: string): boolean {
        return /^https?:\/\/i.pximg.net\/img-master\/img\/\d{4}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{2}\/\d{5,10}_p\d{1,3}_master1200.jpg$/.test(url);
    }

    public generatePictureURLs(picture_count: PictureCount): Array<PictureURL> {
        const url_parts = this._value.split('_');
        const picture_urls = Array<PictureURL>();
        [...Array(picture_count.value)].map(function (value: undefined, index) {
            picture_urls.push(new PictureURL(url_parts[0] + '_p' + index + '_' + url_parts[2]));
        });

        return picture_urls;
    }

    public extractPictureName(): string {
        const tail_index = 11;
        return this.value.split('/')[tail_index];
    }
}