import { IPersistenceProviderPlugin } from "../../plugin-management/IPersistenceProviderPlugin";
import { IGameDao } from "../../daos/IGameDao";
import { IUserDao } from "../../daos/IUserDao";
import { ISessionDao } from "../../daos/ISessionDao";
import { IRequestDao } from "../../daos/IRequestDao";
import { DaoFactory } from "../../daos/DaoFactory";
import { MongoDBDaoFactory } from "../../daos/mongo/MongoDBDaoFactory";

export class MongoDBPlugin implements IPersistenceProviderPlugin {
	factory: DaoFactory;
	gameDao: IGameDao;
	userDao: IUserDao;
	requestDao: IRequestDao;
	sessionDao: ISessionDao;
	constructor() {
		this.factory = new MongoDBDaoFactory();
		this.gameDao = this.factory.createGameDao();
		this.userDao = this.factory.createUserDao();
		this.sessionDao = this.factory.createSessionDao();
		this.requestDao = this.factory.createRequestDao();
	}

	getGameDao(): IGameDao {
		return this.gameDao;
	}
	getUserDao(): IUserDao {
		return this.userDao;
	}
	getSessionDao(): ISessionDao {
		return this.sessionDao;
	}
	getRequestDao(): IRequestDao {
		return this.requestDao;
	}
}
