import { ISessionDao } from "../ISessionDao";
import { SessionDto } from "../../model/UserRegistration";

const mariadb = require("mariadb");
export class SessionMariaDBDao implements ISessionDao {
	constructor() {
		this.createTable();
	}

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
			})
      .catch((err: Error) => console.error(err));
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
			})
      .catch((err: Error) => console.error(err));
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
					.then((session: SessionDto) => {
						return session;
					})
					.then(conn.destroy()); // Close the connection
			})
      .catch((err: Error) => console.error(err));
	}

	clearSessions(): Promise<null> {
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
					.query(`DELETE FROM Sessions`)
					.then((session: null) => {
						return session;
					})
					.then(conn.destroy()); // Close the connection
			})
      .catch((err: Error) => console.error(err));
	}

	private createTable(): Promise<null> {
		return mariadb
			.createConnection({
				// Open a new connection
				user: "root",
				database: "test_db",
				host: "localhost",
				password: "super-secret-password",
				port: 3306,
			})
			.then((conn: any) =>
				conn.query(
					"CREATE TABLE IF NOT EXISTS Sessions(username VARCHAR(100) NOT NULL, token VARCHAR(100) NOT NULL UNIQUE, PRIMARY KEY (token));"
				).then(() => conn.destroy())
			).catch((err: Error) => console.error(err));
	}
}
