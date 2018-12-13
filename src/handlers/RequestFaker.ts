import { Request as DBRequest } from "../model/Request";
import { Request, Response } from "express";
import { ServerModel } from '../model/ServerModel';

import { LoginHandler } from "./LoginHandler";
import { RegisterHandler } from "./RegisterHandler";
import { MapHandler } from "./MapHandler";
import { GamesHandler } from "./GamesHandler";
import { ChatHandler } from "./ChatHandler";
import { GamePlayHandler } from "./GamePlayHandler";

export class RequestFaker {
    private loginHandler = new LoginHandler(ServerModel.getInstance());
    private registerHandler = new RegisterHandler(ServerModel.getInstance());
    private mapHandler = new MapHandler(ServerModel.getInstance());
    private gamesHandler = new GamesHandler(ServerModel.getInstance());
    private chatHandler = new ChatHandler(ServerModel.getInstance());
    private gamePlayHandler = new GamePlayHandler(ServerModel.getInstance());

    constructor() {

    }

    public fakeRequest(req: DBRequest) {
        const fakeRequest = <Request><unknown>req;
        const fakeResponse = <Response> new FakeResponse();
        // router.post("/login", (req: Request, res: Response) => {
        // 	this.loginHandler.handle(req, res);
        // });

        if (req.method.startsWith('/login')) this.loginHandler.handle(fakeRequest, fakeResponse)

		// router.post("/register", (req: Request, res: Response) => {
		// 	this.registerHandler.handle(req, res);
        // });

        // if (req.method.startsWith('/register')) this.registerHandler.handle(fakeRequest, fakeResponse);

		// // router.get("/map", (req: Request, res: Response) => {
		// // 	this.mapHandler.handle(req, res);
		// // });

        // if (req.method.startsWith('/map')) this.mapHandler.handle(fakeRequest, fakeResponse);

		// // router.post("/games", (req: Request, res: Response) => {
		// // 	this.gamesHandler.handle(req, res);
        // // });

        // if (req.method.startsWith('/games')) this.gamesHandler.handle(fakeRequest, fakeResponse);

		// // router.post("/chat/new/:timestamp", (req: Request, res: Response) => {
        // // 	this.chatHandler.handle(req, res);
        // // });

        // // router.get("/chat/:timestamp", (req: Request, res: Response) => {
        // // 	this.chatHandler.handle(req, res);
        // // });

        // if (req.method.startsWith('/chat')) this.chatHandler.handle(fakeRequest, fakeResponse);

		// // router.post("/play/segment", (req: Request, res: Response) => {
		// // 	this.gameplayHandler.handle(req, res);
		// // });

        // if (req.method.startsWith('/play')) this.gamePlayHandler.handle(fakeRequest, fakeResponse);
    }
}

class FakeResponse {
    send() {}
    json() {}
}
