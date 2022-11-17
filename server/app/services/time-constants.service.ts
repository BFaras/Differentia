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
        try {
            await fs.promises.writeFile(join(this.timeFilePath), JSON.stringify({ times: this.timeConstants }), {
                flag: 'w',
            });
        } catch (err) {
            console.log('Something went wrong trying to write into the json file' + err);
            throw new Error(err);
        }
    }

    private async asyncReadTimeFile() {
        try {
            const result = await fs.promises.readFile(join(this.timeFilePath), 'utf-8');
            this.timeConstants = JSON.parse(result).times;
        } catch (err) {
            console.log('Something went wrong trying to read the json file:' + err);
            throw new Error(err);
        }
    }
}
