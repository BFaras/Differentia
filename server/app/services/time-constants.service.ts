import { TimeConstants } from '@common/time-constants';
import * as fs from 'fs';
import { join } from 'path';
import { Service } from 'typedi';

@Service()
export class TimeConstantsService {
    private timeFilePath: string = 'times.json';
    private timeConstants: TimeConstants;

    constructor() {}

    async getTimes(): Promise<TimeConstants> {
        await this.asyncReadTimeFile();
        return this.timeConstants;
    }

    async setTimes(times: TimeConstants): Promise<boolean> {
        this.timeConstants = times;
        await this.asyncWriteInTimesFile();
        return this.timeConstants !== times;
    }

    private async asyncWriteInTimesFile() {
        await fs.promises.writeFile(join(this.timeFilePath), JSON.stringify({ times: this.timeConstants }), {
            flag: 'w',
        });
    }

    private async asyncReadTimeFile() {
        const result = await fs.promises.readFile(join(this.timeFilePath), 'utf-8');
        this.timeConstants = JSON.parse(result).times;
    }
}
