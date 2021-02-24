import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const HOME_DIR: string = join(__dirname, 'pictures');

export class StoreFolder {
    private name: string;
    
    constructor(chara_name: string) {
        this.name = chara_name;
    }

    public create(): void {
        const export_home_dir: string = join(HOME_DIR, this.name);

        this.mkdir(export_home_dir);
        this.mkdir(join(export_home_dir, 'under10000'));
        this.mkdir(join(export_home_dir, 'over10000'));
    }

    private mkdir(dir_path: string): void {
        if (! existsSync(dir_path)) {
            mkdirSync(dir_path);
        };
    };   
}