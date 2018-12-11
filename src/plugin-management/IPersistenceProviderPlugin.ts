import { IGameDao } from "../daos/IGameDao";
import { IUserDao } from "../daos/IUserDao";
import { ISessionDao } from "../daos/ISessionDao";
import { IRequestDao } from "../daos/IRequestDao";

export interface IPersistenceProviderPlugin {
	getGameDao(): IGameDao;
	getUserDao(): IUserDao;
	getSessionDao(): ISessionDao;
	getRequestDao(): IRequestDao;
}
