import { Request, Response } from "express";
import { ServerFacade } from "../facade/ServerFacade";

export class BaseHandler {
    protected serverFacade: ServerFacade;

    constructor() {
        this.serverFacade = new ServerFacade();
    }

    handle(req: Request, res: Response): void {
    }
}