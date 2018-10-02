import { Request, Response } from "express";
import { ServerModel } from "../model/ServerModel";

export class BaseHandler {
    protected model: ServerModel;

    constructor() {
        this.model = ServerModel.getInstance();
    }

    handle(req: Request, res: Response): void {
    }
}