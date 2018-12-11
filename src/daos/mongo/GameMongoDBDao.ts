import { IGameDao } from "../IGameDao";
import { Game } from "../../model/Game";
import { MongoClient, Db, Collection } from "mongodb";

export class GameMongoDBDao implements IGameDao {
	private client: MongoClient;
	private dbName: string;
	constructor({ url = "mongodb://localhost:27017", dbName = "ttr" } = {}) {
		this.client = new MongoClient(url, {
			auth: {
				user: "root",
				password: "super-secret-password",
			},
		});
		this.dbName = dbName;
	}

	saveGame(game: Game): Promise<boolean> {
		return this.client
			.connect()
			.then(client => {
				const db: Db = client.db(this.dbName);
				const games = db.collection("games");
				return games.insertOne(game);
			})
			.then(() => true);
	}

	getGameById(gameId: number): Promise<Game> {
		return this.client.connect().then((client: MongoClient) => {
			const db: Db = client.db(this.dbName);
			const games = db.collection("games");
			return games.findOne({ id: gameId });
		});
	}

	getAllGames(): Promise<Game[]> {
		return this.client.connect().then((client: MongoClient) => {
			const db: Db = client.db(this.dbName);
			const games = db.collection("games");
			let ret_games: Game[] = [];
			return games
				.find()
				.toArray()
				.then(saved_games => {
					saved_games.forEach(game => {
						ret_games.push({
							segments: game.segments,
							playersJoined: game.playersJoined,
							host: game.host,
							name: game.name,
							id: game.id,
							numPlayers: game.numPlayers,
							started: game.started,
							lastRound: game.lastRound,
							turnsLeft: game.turnsLeft,
							ended: game.ended,
							chat: game.chat,
							routeDeck: game.routeDeck,
							spread: game.spread,
							gameMap: game.gameMap,
							turn: game.turn,
						} as Game);
					});
					return ret_games;
				});
		});
	}

	removeGameById(gameId: number): Promise<null> {
		return this.client
			.connect()
			.then((client: MongoClient) => {
				const db: Db = client.db(this.dbName);
				return db.collection("games").deleteOne({ id: gameId });
			})
			.then(() => null);
	}
}
