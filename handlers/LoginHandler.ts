import { BaseHandler } from "./BaseHandler";
import { Request, Response } from "express";

export class LoginHandler extends BaseHandler{

    constructor() {
        super();
    }

    handle(req: Request): Response {
        return;
    }
}