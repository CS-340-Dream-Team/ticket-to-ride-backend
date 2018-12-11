import { DaoFactory } from "../DaoFactory";
import { GameMongoDBDao } from "./GameMongoDBDao";
import { RequestMongoDBDao } from "./RequestMongoDBDao";
import { SessionMongoDBDao } from "./SessionMongoDBDao";
import { UserMongoDBDao } from "./UserMongoDBDao";

export class MongoDBDaoFactory implements DaoFactory {
	constructor() {}
	createGameDao(): GameMongoDBDao {
		return new GameMongoDBDao();
	}
	createUserDao(): UserMongoDBDao {
		return new UserMongoDBDao();
	}
	createSessionDao(): SessionMongoDBDao {
		return new SessionMongoDBDao();
	}
	createRequestDao(): RequestMongoDBDao {
		return new RequestMongoDBDao();
	}
}
