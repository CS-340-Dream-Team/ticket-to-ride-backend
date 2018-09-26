import { Request, Response } from "express";
import { ServerFacade } from "../facade/ServerFacade";

export class BaseHandler {
    protected serverFacade: ServerFacade;

    handle(req: Request): Response {
        return;
    }
}