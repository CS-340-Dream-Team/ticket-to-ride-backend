import { IGameDao } from "../IGameDao";
import { Game } from "../../model/Game";
const mariadb = require("mariadb");

export class GameMariaDBDao implements IGameDao {
	constructor() {}

	saveGame(game: Game): Promise<boolean> {
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
						`INSERT INTO Games values (
							${game.id},
							"${game}"
						)`
					)
					.then(conn.destroy()); // Close the connection
			});
	}

	getGameById(gameId: number): Promise<Game> {
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
					.query(`SELECT game_state FROM Games where game_id = ${gameId}`)
					.then((game: Game) => {
						return game;
					})
					.then(conn.destroy()); // Close the connection
			});
	}

	removeGameById(gameId: number): Promise<null> {
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
					.query(`DELETE FROM Games where game_id = ${gameId}`)
					.then((game: Game) => {
						return game;
					})
					.then(conn.destroy()); // Close the connection
			});
	}
}
