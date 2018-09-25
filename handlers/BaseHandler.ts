import { Request, Response } from "express";

export class BaseHandler {
    handle(req: Request): Response {
        return;
    }
}