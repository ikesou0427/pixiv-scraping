import Picture from './picture';

export default class PictureQueue {
    private _pictures: Array<Picture>;

    constructor() {
        this._pictures = Array<Picture>();
    }

    public enqueue(picture: Picture): void {
        this._pictures.push(picture);
    }

    public dequeue(): Picture | undefined {
        return this._pictures.shift();
    }

    public size(): number {
        return this._pictures.length;
    }
}