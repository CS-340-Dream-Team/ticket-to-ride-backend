import { IPersistenceProviderPlugin } from "../../plugin-management/IPersistenceProviderPlugin";
import { IGameDao } from "../../daos/IGameDao";
import { IUserDao } from "../../daos/IUserDao";
import { ISessionDao } from "../../daos/ISessionDao";
import { IRequestDao } from "../../daos/IRequestDao";

export class DummyPlugin implements IPersistenceProviderPlugin {
	gameDao: IGameDao = {
		saveGame() {},
		getGame() {
			return JSON;
		},
	};

	userDao: IUserDao = {
		saveUser() {},
		getUser() {
			return JSON;
		},
	};

	sessionDao: ISessionDao = {
		saveSession() {},
		getSession() {
			return JSON;
		},
	};

	requestDao: IRequestDao = {
		saveRequest() {},
		getRequestsByGameId(gameID: number) {
			return [];
		},
	};

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
