import { IRequestDao } from "../IRequestDao";
import { Request } from "../../model/Request";
const mariadb = require("mariadb");

export class RequestMariaDBDao implements IRequestDao {
	constructor() {}

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
				conn
					.query(
						`INSERT INTO Requests values (
							${req.id},
							"${req.url}",
							"${req.method}",
							"${req.body}",
							"${req.authToken}",
							${req.gameId}
						)`
					)
					.then(conn.destroy()); // Close the connection
			});
	}

	getRequestById(requestId: number): Promise<Request> {
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
				conn
					.query(`SELECT * FROM Requests where request_id = ${requestId}`)
					.then((request: Request) => {
						return request;
					})
					.then(conn.destroy()); // Close the connection
			});
	}

	removeRequestById(requestId: number): Promise<Request> {
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
				conn
					.query(`DELETE FROM Requests where request_id = ${requestId}`)
					.then((request: Request) => {
						return request;
					})
					.then(conn.destroy()); // Close the connection
			});
	}

	getRequestsByGameId(gameId: number): Request[] {
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
				conn
					.query(`SELECT * FROM Requests where game_id = ${gameId}`)
					.then((request: Request) => {
						return request;
					})
					.then(conn.destroy()); // Close the connection
			});
	}
}
