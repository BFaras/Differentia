import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { describe } from "mocha";
import { MongoClient } from "mongodb";
import { GamesService } from "./games.service";
import { Game } from "../classes/game";
import { Time } from "../../../common/time"
import { DatabaseServiceMock } from "./database.service.mock";
import { HttpException } from "@app/classes/http.exception";
chai.use(chaiAsPromised); // this allows us to test for rejection

describe("Games service", () => {
  let gamesService: GamesService;
  let databaseService: DatabaseServiceMock;
  let client: MongoClient;
  let testGame: Game;
  let testTimes: Time[];
  let testTimeOne: Time;

  beforeEach(async () => {
    databaseService = new DatabaseServiceMock();
    client = (await databaseService.start()) as MongoClient;
    gamesService = new GamesService(databaseService as any);
    testTimes = [];
    testTimeOne = {
        minutes: 0,
        seconds: 59,
    };
    testGame = {
      name: "Test Game",
      numberOfDifferences: 7,
      times: testTimes,
      images: ["image1", "image2"],
    };
    await gamesService.collection.insertOne(testGame);
  });

  afterEach(async () => {
    await databaseService.closeConnection();
  });

  it("should get all games from DB", async () => {
    let games = await gamesService.getAllGames();
    expect(games.length).to.equal(1);
    expect(testGame).to.deep.equals(games[0]);
  });

  it("should get specific course with valid name", async () => {
    let game = await gamesService.getGame("Test Game");
    expect(game).to.deep.equals(testGame);
  });

  it("should throw an HTTP exception with an invalid name", async () => {
    expect(gamesService.getGame("Invalid name")).to.eventually.be.rejectedWith(
        HttpException
    );
  });

  it("should get specific game times with valid name", async () => {
    let times = await gamesService.getGameTimes("Test Game");
    expect(times).to.deep.equals(testGame.times);
  });

  it("should get specific game number of differences based on its name", async () => {
    let numberOfDifferences = await gamesService.getGameNumberOfDifferences("Test Game");
    expect(numberOfDifferences).to.deep.equals(testGame.numberOfDifferences);
  });

  it("should add new time to a game's times based on its name", async () => {
    let oldTimes = await gamesService.getGameTimes(testGame.name);
    await gamesService.addNewTimeToGame(testTimeOne, testGame.name);
    let games = await gamesService.collection.find({}).toArray();
    expect(oldTimes.length + 1).to.equals(
        games.find((x) => x.name === testGame.name)?.times.length
    );
    expect(testTimeOne).to.deep.equals(
        games.find((x) => x.name === testGame.name)?.times[0]
    );
  });

  it("should insert a new game", async () => {
    let secondGame: Game = {
      name: "Test Game 2",
      numberOfDifferences: 9,
      times: testTimes,
      images: ["image3", "image4"],
    };
    await gamesService.addGame(secondGame);
    let games = await gamesService.collection.find({}).toArray();
    expect(games.length).to.equal(2);
    expect(games.find((x) => x.name === secondGame.name)).to.deep.equals(
      secondGame
    );
  });

  it("should not insert a new game if it has an invalid number of difference, credits, images or name", async () => {
    let secondGame: Game = {
        name: "Test Game",
        numberOfDifferences: 10,
        times: [testTimeOne],
        images: [],
    };
    try {
      await gamesService.addGame(secondGame);
    } catch {
      let games = await gamesService.collection.find({}).toArray();
      expect(games.length).to.equal(1);
    }
  });

  it("should not validate a game's name if it has the same name as another game in the database", async () => {
    expect(
      (await gamesService['validateName']("Test Game")).valueOf()
      ).to.be.false;
  })

  it("should modify an existing game data if a valid name is sent", async () => {
    let modifiedCourse: Game = {
      name: "Test Game",
      numberOfDifferences: 4,
      times: testTimes,
      images: ["image1", "image2"],
    };

    await gamesService.modifyGame(modifiedCourse);
    let games = await gamesService.collection.find({}).toArray();
    expect(games.length).to.equal(1);
    expect(
      games.find((x) => x.name === testGame.name)?.numberOfDifferences
    ).to.deep.equals(modifiedCourse.numberOfDifferences);
  });

  it("should not modify an existing game data if no valid name is passed", async () => {
    let modifiedGame: Game = {
        name: "Invalid name",
        numberOfDifferences: 4,
        times: testTimes,
        images: ["image1", "image2"],
    };

    await gamesService.modifyGame(modifiedGame);
    let games = await gamesService.collection.find({}).toArray();
    expect(games.length).to.equal(1);
    expect(
      games.find((x) => x.name === testGame.name)?.name
    ).to.not.equals(modifiedGame.name);
  });

  it("should delete an existing game data if a valid name is sent", async () => {
    await gamesService.deleteGame("Test Game");
    let games = await gamesService.collection.find({}).toArray();
    expect(games.length).to.equal(0);
  });

  it("should not delete a game if it has an invalid name ", async () => {
    try {
      await gamesService.deleteGame("Invalid name");
    } catch {
      let games = await gamesService.collection.find({}).toArray();
      expect(games.length).to.equal(1);
    }
  });

    // Error handling
  describe("Error handling", async () => {
    it("should throw an error if we try to get all games on a closed connection", async () => {
      await client.close();
      expect(
        gamesService.getAllGames()
      ).to.eventually.be.rejectedWith(Error);
    });

    it("should throw an error if we try to add a game on a closed connection",  async () => {
      await client.close();
      gamesService['validateGame'] = async () => {return true}
      expect(
        gamesService.addGame(testGame)
      ).to.eventually.be.rejectedWith(Error);
    });

    it("should throw an error if we try to get a specific game on a closed connection", async () => {
      await client.close();
      expect(
        gamesService.getGame(testGame.name)
      ).to.eventually.be.rejectedWith(Error);
    });

    it("should throw an error if we try to delete a specific game on a closed connection", async () => {
      await client.close();
      expect(
        gamesService.deleteGame(testGame.name)
      ).to.eventually.be.rejectedWith(Error);
    });

    it("should throw an error if we try to modify a specific name on a closed connection", async () => {
      await client.close();
      expect(
        gamesService.modifyGame({} as Game)
      ).to.eventually.be.rejectedWith(Error);
    });

    it("should throw an error if we try to get an invalid game's times", async () => {
      expect(
        gamesService.getGameTimes("Invalid name")
      ).to.eventually.be.rejectedWith(Error);
    });
  });
});
