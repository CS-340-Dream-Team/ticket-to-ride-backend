import { Request as DBRequest } from "../model/Request";
import { Request, Response } from "express";
import { ServerModel } from '../model/ServerModel';

import { MapHandler } from "./MapHandler";
import { ChatHandler } from "./ChatHandler";
import { GamePlayHandler } from "./GamePlayHandler";

export class RequestFaker {
    private mapHandler = new MapHandler(ServerModel.getInstance());
    private chatHandler = new ChatHandler(ServerModel.getInstance());
    private gamePlayHandler = new GamePlayHandler(ServerModel.getInstance());

    constructor() {

    }

    private getURLParam(url: string) {
        const parts = url.split('/');
        return +parts[parts.length - 1];
    }

    private addParamsIfPresent(fakeRequest: Request) {
        if (fakeRequest.url.startsWith('/play/bus/')) {
            fakeRequest.params = { index: this.getURLParam(fakeRequest.url) }
        }

        else if (fakeRequest.url.startsWith('/chat/timestamp')) {
            fakeRequest.params = { timestamp: this.getURLParam(fakeRequest.url) }
        }

        else if (fakeRequest.url.startsWith('/chat/')) {
            fakeRequest.params = { timestamp: this.getURLParam(fakeRequest.url) }
        }

        return fakeRequest;
    }

    public fakeRequest(req: DBRequest) {
        let fakeRequest = <Request><unknown>req;
        fakeRequest.headers = {authorization: req.authToken};
        const fakeResponse = <Response><unknown> new FakeResponse();
        // router.post("/login", (req: Request, res: Response) => {
        // 	this.loginHandler.handle(req, res);
        // });

        fakeRequest = this.addParamsIfPresent(fakeRequest);
		// // router.get("/map", (req: Request, res: Response) => {
		// // 	this.mapHandler.handle(req, res);
		// // });

        if (req.url.startsWith('/map')) this.mapHandler.handle(fakeRequest, fakeResponse);

		// // router.post("/chat/new/:timestamp", (req: Request, res: Response) => {
        // // 	this.chatHandler.handle(req, res);
        // // });

        // // router.get("/chat/:timestamp", (req: Request, res: Response) => {
        // // 	this.chatHandler.handle(req, res);
        // // });

        else if (req.url.startsWith('/chat')) this.chatHandler.handle(fakeRequest, fakeResponse);

		// // router.post("/play/segment", (req: Request, res: Response) => {
		// // 	this.gameplayHandler.handle(req, res);
		// // });

        else if (req.url.startsWith('/play')) this.gamePlayHandler.handle(fakeRequest, fakeResponse);

        else console.warn(`Request path not recognized... ignoring: ${JSON.stringify(fakeRequest.url)}`);
    }
}

class FakeResponse {
    send() {}
    json() {}
    status() {
        return {send: function() {}}
    }
}
