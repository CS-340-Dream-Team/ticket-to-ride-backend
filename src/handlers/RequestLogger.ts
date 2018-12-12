import { Request as ExpressRequest } from "express";
import { Request as DBRequest } from "../model/Request";
import { Game } from '../model/Game';
import { ServerModel } from '../model/ServerModel';
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

    private isPollingRequest(req: ExpressRequest) {
        return req.method === 'GET' && req.url.startsWith('/play/') ||
            req.method === 'GET' && req.url.startsWith('/chat/');
    }

    private shouldSaveToDB(req: DBRequest) {
        const loggingForThisGame = this.logging.indexOf(req.gameId) !== -1;
        return loggingForThisGame;
    }

    public saveRequest(req: ExpressRequest) {
        if (this.isPollingRequest(req)) {
            return;
        }

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

    private saveRequestToDB(req: DBRequest) {
        this.requestDao.saveRequest(req);
    }
}
