import { Request as ExpressRequest } from "express";
import { Request as DBRequest } from "../model/Request";
import { Game } from "../model/Game";
import { ServerModel } from "../model/ServerModel";
import { IRequestDao } from "../daos/IRequestDao";
import { PluginManager } from "../plugin-management/PluginManager";
import { RequestFaker } from "./RequestFaker";

export class RequestLogger {
	private static _instance: RequestLogger;

	public static get instance(): RequestLogger {
		if (!this._instance) {
			this._instance = new RequestLogger();
		}
		return this._instance;
	}

	private logging: number[] = [];
	private requestDao: IRequestDao;
	private faker = new RequestFaker();

	private constructor() {
		const pluginManager = new PluginManager();
		const persistenceProvider = pluginManager.getProvider();
		this.requestDao = persistenceProvider.getRequestDao();
	}

	public startLoggingForGame(game: Game) {
		this.logging.push(game.id);
	}

	private shouldLogRequest(req: DBRequest) {
		return (
			!(req.method === "GET" && req.url.startsWith("/play/")) &&
			!(req.method === "GET" && req.url.startsWith("/chat/")) && 
			!(req.url.startsWith("/games")) &&
			!(req.method === "GET" && req.url.startsWith("/map"))
		);
	}

	private shouldSaveToDB(req: DBRequest) {
		const loggingForThisGame = this.logging.indexOf(req.gameId) !== -1;
		return loggingForThisGame && this.shouldLogRequest(req);
	}

	public saveRequest(req: ExpressRequest) {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			// login screen
			return;
		}

		let game;
		try {
			game = ServerModel.getInstance().getGameByToken(authHeader);
		} catch (e) {}

		if (game) {
			const reqToSave = new DBRequest(
				req.url,
				req.method,
				req.body,
				<string>req.headers.authorization,
				game.id
			);
			if (this.shouldSaveToDB(reqToSave)) {
				this.saveRequestToDB(reqToSave);
			}
		}
	}

	public async loadAndRunRequestsForGameWithId(gameId: number) {
		const requests = await this.requestDao.getRequestsByGameId(gameId);
		if (!requests) {
			return;
		}

		console.log('Running ' + requests.length + ' requests for game with id ' + gameId);

		for (const request of requests) {
			this.faker.fakeRequest(request);
		}
	}

	private async saveRequestToDB(req: DBRequest) {
		await this.requestDao.saveRequest(req);
		await this.saveNewGameInstanceIfNRequests(req.gameId, req.authToken, this.getNumDeltas());
	}

	private async saveNewGameInstanceIfNRequests(gameId: number, authToken: string, N: number) {
		const requestsForGame = await this.requestDao.getRequestsByGameId(gameId);
		console.log(requestsForGame);
		if (requestsForGame.length > N) {
			await ServerModel.getInstance().saveGameWithId(gameId, authToken);
			await this.requestDao.removeRequestsByGameId(gameId);
		}
	}

	private getNumDeltas(): number {
		let numDeltas = +process.argv[3];
		if (!numDeltas || numDeltas <= 0) {
			throw new Error("No Command Delta Number Specified Or Number Invalid");
		}
		return numDeltas;
	}
}
