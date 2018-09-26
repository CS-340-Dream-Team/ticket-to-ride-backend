import { BaseHandler } from "./BaseHandler";
import { Request, Response } from "express";

export class RegisterHandler extends BaseHandler{
   
    constructor() {
        super();
    }

    handle(req: Request, res: Response): void {
    }
}