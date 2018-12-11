import { ISessionDao } from "../ISessionDao";
import { SessionDto } from "../../model/UserRegistration";

const mariadb = require("mariadb");
export class SessionMariaDBDao implements ISessionDao {
	constructor() {}

	saveSession(user: SessionDto): Promise<boolean> {
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
						`INSERT INTO Sessions values (
							"${user.username}",
							"${user.token}"
						)`
					)
					.then(conn.destroy()); // Close the connection
			});
	}

	getAllSessions(): Promise<SessionDto[]> {
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
					.query(`SELECT * FROM Sessions`)
					.then((sessions: Object[]) => {
						let ret_sessions: SessionDto[] = [];
						for (let session of sessions) {
							ret_sessions.push(session as SessionDto);
						}
						return ret_sessions;
					})
					.then(conn.destroy()); // Close the connection
			});
	}

	removeSessionsByUser(userName: string): Promise<null> {
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
					.query(`DELETE FROM Sessions where username = "${userName}"`)
					.then((user: SessionDto) => {
						return user;
					})
					.then(conn.destroy()); // Close the connection
			});
	}
}
