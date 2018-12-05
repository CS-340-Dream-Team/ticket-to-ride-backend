import { IGameDao } from "./IGameDao";
import { IRequestDao } from "./IRequestDao";
import { IUserDao } from "./IUserDao";
import { ISessionDao } from "./ISessionDao";
export interface DaoFactory {
	createGameDao(): IGameDao;
	createUserDao(): IUserDao;
	createSessionDao(): ISessionDao;
	createRequestDao(): IRequestDao;
}
