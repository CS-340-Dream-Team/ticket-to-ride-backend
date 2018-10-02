import { BaseHandler } from "./BaseHandler";
import { Request, Response } from "express";
import { Command } from "../commands/Command";

export class RegisterHandler extends BaseHandler{
   
    constructor() {
        super();
    }

    handle(req: Request, res: Response): void {
        try {
            let token = this.model.register(req.body.userName,req.body.password);
            res.status(200).send({
                token: token
            });
        } catch(e) {
            res.status(400).send({
                command: new Command("showError", { message: e.message })
            })
        }
    }
}