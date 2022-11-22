import { RecordTime } from '@app/classes/record-times';
import { GameTimes } from '@common/game-times';
import { GameModeTimes } from '@common/games-record-times';
import 'dotenv/config';
import { Db, MongoClient } from 'mongodb';
import { Service } from 'typedi';

// Il faut faire un npm install dotenv sinon sa fonctionne pas

@Service()
export class DatabaseService {
    private db: Db;
    private client: MongoClient;
    defaultRecordTimes: GameModeTimes = {
        soloGameTimes: [new RecordTime('02:00', 'Mark'), new RecordTime('02:15', 'Jean'), new RecordTime('02:30', 'Paul')],
        multiplayerGameTimes: [new RecordTime('02:00', 'Brook'), new RecordTime('02:15', 'Leon'), new RecordTime('02:30', 'Mike')],
    };

    // La ligne 13 de ce fichier n'est pas couverte dans les tests car le process.env
    // .DATABASE_URL! crée un if/else concernant sa valeur
    // Le professeur m'a dit en cours que cela ne nous fera pas perdre de points
    async start(url: string = process.env.DATABASE_URL!): Promise<void> {
        try {
            this.client = new MongoClient(url);
            await this.client.connect();
            this.db = this.client.db(process.env.DATABASE_NAME);
        } catch {
            throw new Error('Database connection error');
        }
        if ((await this.db.collection(process.env.DATABASE_COLLECTION!).countDocuments()) === 0) {
            await this.populateDB();
        }
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    async populateDB(): Promise<void> {
        const gamesTimes: GameTimes[] = [
            {
                name: 'Car game',
                recordTimes: this.defaultRecordTimes,
            },
            {
                name: 'Bike game',
                recordTimes: this.defaultRecordTimes,
            },
            {
                name: 'House game',
                recordTimes: this.defaultRecordTimes,
            },
            {
                name: 'Plane game',
                recordTimes: this.defaultRecordTimes,
            },
            {
                name: 'TV game',
                recordTimes: this.defaultRecordTimes,
            },
            {
                name: 'Table game',
                recordTimes: this.defaultRecordTimes,
            },
            {
                name: 'Chair game',
                recordTimes: this.defaultRecordTimes,
            },
            {
                name: 'Clown game',
                recordTimes: this.defaultRecordTimes,
            },
            {
                name: 'Dog game',
                recordTimes: this.defaultRecordTimes,
            },
            {
                name: 'new game',
                recordTimes: this.defaultRecordTimes,
            },
        ];

        // console.log('THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE');
        for (const game of gamesTimes) {
            await this.db.collection(process.env.DATABASE_COLLECTION!).insertOne(game);
        }
    }

    get database(): Db {
        return this.db;
    }
}
