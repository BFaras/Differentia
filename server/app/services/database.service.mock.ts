import { RecordTime } from '@app/classes/record-times';
import { GameModeTimes } from '@common/games-record-times';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
const DATABASE_NAME = 'database';

export class DatabaseServiceMock {
    private db: Db;
    private client: MongoClient;
    mongoServer: MongoMemoryServer;
    defaultRecordTimes: GameModeTimes = {
        soloGameTimes: [new RecordTime('02:00', 'David'), new RecordTime('02:15', 'Jean'), new RecordTime('02:30', 'Paul')],
        multiplayerGameTimes: [new RecordTime('02:00', 'Brook'), new RecordTime('02:15', 'Leon'), new RecordTime('02:30', 'Tom')],
    };

    async start(url?: string): Promise<MongoClient | null> {
        if (!this.client) {
            this.mongoServer = await MongoMemoryServer.create();
            const mongoUri = this.mongoServer.getUri();
            this.client = new MongoClient(mongoUri);
            await this.client.connect();
            this.db = this.client.db(DATABASE_NAME);
        }

        return this.client;
    }

    async closeConnection(): Promise<void> {
        if (this.client) {
            return this.client.close();
        } else {
            return Promise.resolve();
        }
    }

    get database(): Db {
        return this.db;
    }
}
