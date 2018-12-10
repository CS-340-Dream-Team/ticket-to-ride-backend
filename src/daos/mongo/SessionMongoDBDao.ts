import { ISessionDao } from "../ISessionDao";

export class SessionMongoDBDao implements ISessionDao {
	constructor() {}
	saveSession() {}
	getSession() {
		return JSON;
	}
	getAllSessions() {
		return [];
	}
}
