import { DaoFactory } from "../DaoFactory";
import { GameMariaDBDao } from "./GameMariaDBDao";
import { RequestMariaDBDao } from "./RequestMariaDBDao";
import { UserMariaDBDao } from "./UserMariaDBDao";
import { SessionMariaDBDao } from "./SessionMariaDBDao";

export class MariaDBDaoFactory implements DaoFactory{
    constructor(){}
    createGameDao(): GameMariaDBDao{
        return new GameMariaDBDao();
    };
	createUserDao(): UserMariaDBDao{
        return new UserMariaDBDao();
    }
	createSessionDao(): SessionMariaDBDao{
        return new SessionMariaDBDao();
    }
	createRequestDao(): RequestMariaDBDao{
        return new RequestMariaDBDao();
    }
}