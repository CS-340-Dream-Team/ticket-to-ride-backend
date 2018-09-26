import { BaseHandler } from "./BaseHandler";
import { Request, Response } from "express";

export class GamesHandler extends BaseHandler{

    constructor() {
        super();
    }

    handle(req: Request): Response {
        return;
    }
}