import { IUserDao } from "../IUserDao";

export class UserMongoDBDao implements IUserDao {
	constructor() {}
	saveUser() {}
	getUser(id: number) {
		return { username: "u", password: "p" };
	}
	getAllUsers() {
		return [];
	}
}
