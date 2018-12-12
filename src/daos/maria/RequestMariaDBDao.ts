import { IRequestDao } from "../IRequestDao";
import { Request } from "../../model/Request";
import { json } from "body-parser";
const mariadb = require("mariadb");

export class RequestMariaDBDao implements IRequestDao {
	constructor() {
		this.createTable();
	}

	saveRequest(req: Request): Promise<boolean> {
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
						`INSERT INTO Requests (url, method, body, authToken, gameId) values (
							"${req.url}",
							"${req.method}",
							${JSON.stringify(JSON.stringify(req.body))},
							"${req.authToken}",
							${req.gameId}
						)`
					)
					.then(conn.destroy()); // Close the connection
			})
      .catch((err: Error) => console.error(err));
	}

	getRequestsByGameId(gameId: number): Promise<Request[]> {
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
						`SELECT url, method, body, authToken, gameId FROM Requests where gameId = ${gameId}`
					)
					.then((requests: Object[]) => {
						let ret_requests: Request[] = [];
						for (let request of requests) {
							ret_requests.push(request as Request);
						}
						return ret_requests;
					})
					.then(conn.destroy()); // Close the connection
			})
      .catch((err: Error) => console.error(err));
	}

	removeRequestsByGameId(gameId: number): Promise<null> {
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
					.query(`DELETE FROM Requests where gameId = ${gameId}`)
					.then((request: null) => {
						return request;
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
					"CREATE TABLE IF NOT EXISTS Requests(request_id INT NOT NULL AUTO_INCREMENT UNIQUE, url TEXT NOT NULL, method varchar(10),	 body JSON, authToken VARCHAR(100) NOT NULL, gameId INT NOT NULL);"
				).then(() => conn.destroy())
		).catch((err: Error) => console.error(err));
	}
}
