import { IGameDao } from "../IGameDao";
import { Game } from "../../model/Game";
import { Segment } from "../../model/Segment";
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
				return conn
					.query(
						`INSERT INTO Games values (
							${game.id},
							${JSON.stringify(JSON.stringify(game))}
						)`
					)
					.then(conn.destroy());
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
				return conn
					.query(`SELECT game_state FROM Games where game_id = ${gameId}`)
					.then((game: Object[]) => {
						let saved_game = game[0] as { game_state: string };
						return JSON.parse(saved_game.game_state) as Game;
					})
					.then(conn.destroy()); // Close the connection
			});
	}

	getAllGames(): Promise<Game[]> {
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
					.query(`SELECT game_state FROM Games`)
					.then((games: Object[]) => {
						let ret_saved_games: Game[] = [];
						for (let game of games) {
							let saved_game = game as { game_state: string };
							ret_saved_games.push(JSON.parse(saved_game.game_state) as Game);
						}
						return ret_saved_games;
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
				return conn
					.query(`DELETE FROM Games where game_id = ${gameId}`)
					.then((game: Game) => {
						return game;
					})
					.then(conn.destroy()); // Close the connection
			});
	}
}
