import { IUserDao } from "../IUserDao";
import { UserDto } from "../../model/UserRegistration";
const mariadb = require("mariadb");
export class UserMariaDBDao implements IUserDao {
	constructor() {}

	saveUser(user: UserDto): Promise<boolean> {
		return mariadb
			.createConnection({
				// Open a new connection
				user: "root",
				database: "test_db",
				host: "localhost",
				password: "super-secret-password",
				port: 3306,
			})
			.then((conn: any) => {
				return conn
					.query(
						`INSERT INTO Users (username, password) values (
							"${user.username}",
							"${user.password}"
						)`
					)
					.then(conn.destroy()); // Close the connection
			});
	}

	getUserByName(userName: string): Promise<UserDto> {
		return mariadb
			.createConnection({
				// Open a new connection
				user: "root",
				database: "test_db",
				host: "localhost",
				password: "super-secret-password",
				port: 3306,
			})
			.then((conn: any) => {
				return conn
					.query(`SELECT username, password FROM Users where username = "${userName}"`)
					.then((user: Object[]) => {
						return user[0] as UserDto;
					})
					.then(conn.destroy()); // Close the connection
			});
	}

	getAllUsers(): Promise<UserDto[]> {
		return mariadb
			.createConnection({
				// Open a new connection
				user: "root",
				database: "test_db",
				host: "localhost",
				password: "super-secret-password",
				port: 3306,
			})
			.then((conn: any) => {
				return conn
					.query(`SELECT username, password FROM Users`)
					.then((users: Object[]) => {
						let ret_users: UserDto[] = [];
						for (let user of users) {
							ret_users.push(user as UserDto);
						}
						return ret_users;
					})
					.then(conn.destroy()); // Close the connection
			});
	}

	removeUserByName(userName: string): Promise<null> {
		return mariadb
			.createConnection({
				// Open a new connection
				user: "root",
				database: "test_db",
				host: "localhost",
				password: "super-secret-password",
				port: 3306,
			})
			.then((conn: any) => {
				return conn
					.query(`DELETE FROM Users where username = "${userName}"`)
					.then((user: null) => {
						return user;
					})
					.then(conn.destroy()); // Close the connection
			});
	}
}
