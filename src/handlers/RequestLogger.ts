import { Request as ExpressRequest } from "express";
import { Request as DBRequest } from "../model/Request";
import { Game } from '../model/Game';
import {ServerModel} from '../model/ServerModel';
import { IRequestDao } from "../daos/IRequestDao";
import { PluginManager } from "../plugin-management/PluginManager";

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

    private constructor() {
        const pluginManager = new PluginManager();
        const persistenceProvider = pluginManager.getProvider();
        this.requestDao = persistenceProvider.getRequestDao();
    }

    public startLoggingForGame(game: Game) {
        this.logging.push(game.id);
    }

    private isPollingRequest(req: DBRequest) {
        return req.method === 'GET' && req.url.startsWith('/play/') ||
            req.method === 'GET' && req.url.startsWith('/chat/');
    }

    private shouldSaveToDB(req: DBRequest) {
        const loggingForThisGame = this.logging.indexOf(req.gameId) !== -1;
        return loggingForThisGame && !this.isPollingRequest(req);
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
        } catch (e) {

        }

        if (game) {
            const reqToSave = new DBRequest(req.url, req.method, req.body, <string>req.headers.authorization, game.id);
            if (this.shouldSaveToDB(reqToSave)) {
                this.saveRequestToDB(reqToSave);
            }
        }
    }

    private async saveRequestToDB(req: DBRequest) {
        await this.requestDao.saveRequest(req);
        await this.saveNewGameInstanceIfNRequests(req.gameId, this.getNumDeltas());
    }

    private async saveNewGameInstanceIfNRequests(gameId: number, N: number) {
        const requestsForGame = await this.requestDao.getRequestsByGameId(gameId);
        if (requestsForGame.length > this.getNumDeltas()) { // TODO replace with N
            await ServerModel.getInstance().saveGameWithId(gameId);
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
