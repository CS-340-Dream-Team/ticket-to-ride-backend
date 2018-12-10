import { IPersistenceProviderPlugin } from "../../plugin-management/IPersistenceProviderPlugin";
import { IGameDao } from "../../daos/IGameDao";
import { IUserDao } from "../../daos/IUserDao";
import { ISessionDao } from "../../daos/ISessionDao";
import { IRequestDao } from "../../daos/IRequestDao";
import { Request } from "../../model/Request";
import {DaoFactory} from "../../daos/DaoFactory"
import { MariaDBDaoFactory } from "../../daos/maria/MariaDBDaoFactory";
import { MongoDBDaoFactory } from "../../daos/mongo/MongoDBDaoFactory";

export class DummyPlugin implements IPersistenceProviderPlugin {
	factory:DaoFactory;
	gameDao:IGameDao;
	userDao:IUserDao;
	requestDao:IRequestDao;
	sessionDao:ISessionDao;
	constructor(pluginType:boolean){
		
		if(pluginType){
			this.factory=new MariaDBDaoFactory();
		} else{
			this.factory=new MongoDBDaoFactory();
		}
		this.gameDao=this.factory.createGameDao();
		this.userDao=this.factory.createUserDao();
		this.sessionDao=this.factory.createSessionDao();
		this.requestDao=this.factory.createRequestDao();
	}
	// gameDao: IGameDao = {
	// 	saveGame() {return Promise.resolve(true)},

	// };

	// userDao: IUserDao = {
	// 	saveUser() {},
	// 	getUser(id: number) {
	// 		return {username: 'Betty the Bot', password: 'Super Secr3t'};
	// 	},
	// 	getAllUsers() {
	// 		return []
	// 	}
	// };

	// sessionDao: ISessionDao = {
	// 	saveSession() {},
	// 	getAllSessions() {
	// 		return [];
	// 	},
	// };

	// requestDao: IRequestDao = {
	// 	saveRequest(req: Request): Promise<boolean> {
	// 		return Promise.resolve(true);
	// 	},
	// 	getRequestsByGameId(gameId: number): Promise<Request[]> {
	// 		return Promise.resolve([]);
	// 	},
	// 	getRequestById(requestId: number): Promise<Request> {
	// 		return Promise.resolve({} as Request);
	// 	},
	// 	removeRequestById(requestId: number): Promise<null> {
	// 		return Promise.resolve(null);
	// 	},
	// };

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
	openConnection(): void {
		console.log();
		console.warn(
			"*** You are using the default persistence provider plugin, which does not do anything."
		);
		console.warn("*** Data will not persist if the process terminates.");
		console.log();
	}
	closeConnection(): void {}
}
