import { fail } from "assert";
import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { describe } from "mocha";
import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { DatabaseService } from "./database.service";
chai.use(chaiAsPromised); // this allows us to test for rejection

describe("Database service", () => {
  let databaseService: DatabaseService;
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
    databaseService = new DatabaseService();

    // Start a local test server
    mongoServer = await MongoMemoryServer.create();
  });

  afterEach(async () => {
    if (databaseService["client"]) {
      await databaseService["client"].close();
    }
  });

  // NB : We dont test the case when DATABASE_URL is used in order to not connect to the real database
  it("should connect to the database when start is called", async () => {
    // Reconnect to local server
    const mongoUri = mongoServer.getUri();
    await databaseService.start(mongoUri);
    expect(databaseService["client"]).to.not.be.undefined;
    expect(databaseService["db"].databaseName).to.equal("Projet_2");
  });

  it("should not connect to the database when start is called with wrong URL", async () => {
    // Try to reconnect to local server
    try {
      await databaseService.start("WRONG URL");
      fail();
    } catch {
      expect(databaseService["client"]).to.be.undefined;
    }
  });

  it("should populate the database with a helper function", async () => {
    const mongoUri = mongoServer.getUri();
    const client = new MongoClient(mongoUri);
    await client.connect();
    databaseService["db"] = client.db("Projet_2");
    await databaseService.populateDB();
    let courses = await databaseService.database
      .collection("Games")
      .find({})
      .toArray();
    expect(courses.length).to.equal(6);
  });

  it("should not populate the database with start function if it is already populated", async () => {
    const mongoUri = mongoServer.getUri();
    await databaseService.start(mongoUri);
    let courses = await databaseService.database
      .collection("Games")
      .find({})
      .toArray();
    expect(courses.length).to.equal(6);
    await databaseService.closeConnection();
    await databaseService.start(mongoUri);
    courses = await databaseService.database
      .collection("Games")
      .find({})
      .toArray();
    expect(courses.length).to.equal(6);
  });
});
