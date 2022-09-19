import { Db, MongoClient } from 'mongodb';
import 'dotenv/config';
import { Service } from 'typedi';
import { Game } from '@app/classes/game';

// Il faut faire un npm install dotenv sinon sa fonctionne pas

@Service()
export class DatabaseService {
  private db: Db;
  private client: MongoClient;


  async start(url: string = process.env.DATABASE_URL!): Promise<void> {
    try {
      this.client = new MongoClient(url);
      await this.client.connect();
      this.db = this.client.db(process.env.DATABASE_NAME!);
    } catch {
      throw new Error('Database connection error')
    }

    if (
      (await this.db.collection(process.env.DATABASE_COLLECTION!).countDocuments()) === 0
    ) {
      await this.populateDB();
    }
  }

  async closeConnection(): Promise<void> {
    return this.client.close();
  }

  async populateDB(): Promise<void> {
    const games: Game[] = [
      {
        name: 'Jeu 1',
        numberOfDifferences: 4,
        times: [],
        images: [],
      },
      {
        name: 'Jeu 2',
        numberOfDifferences: 5,
        times: [],
        images: [],
      },
      {
        name: 'Jeu 3',
        numberOfDifferences: 6,
        times: [],
        images: [],
      },
      {
        name: 'Jeu 4',
        numberOfDifferences: 7,
        times: [],
        images: [],
      },
      {
        name: 'Jeu 5',
        numberOfDifferences: 8,
        times: [],
        images: [],
      },
      {
        name: 'Jeu 6',
        numberOfDifferences: 9,
        times: [],
        images: [],
      }
    ];

    // console.log('THIS ADDS DATA TO THE DATABASE, DO NOT USE OTHERWISE');
    for (const game of games) {
      await this.db.collection(process.env.DATABASE_COLLECTION!).insertOne(game);
    }
  }

  get database(): Db {
    return this.db;
  }
}
