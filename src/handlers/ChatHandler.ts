import { BaseHandler } from "./BaseHandler";
import { Request, Response } from "express";
import {ErrorMsgs} from "../model/ErrorMsgs";

export class ChatHandler extends BaseHandler{

    constructor() {
        super();
    }

    handle(req: Request, res: Response): void {
        if (req.method == "POST") {
            this.addMessage(req, res);
        } else if (req.method == "GET") {
            this.getMessagesAfter(req, res);
        }
        
    }

    private addMessage(req: Request, res: Response): void {
        try {
            let prevTimestamp = req.params.timestamp as number;
            let command = this.model.addMessage(req.headers.authorization, req.body.messageText, prevTimestamp);
            res.status(200).send({
                commands: [command]
            });
        } catch(e) {
            res.status(400).json({
                message: e.message
            });
        }
    }

    private getMessagesAfter(req: Request, res: Response) {
        try {
            let timestamp = req.params.timestamp;
            let commands = this.model.getMessagesAfter(req.headers.authorization, timestamp);
            res.status(200).send({
                commands: commands
            });
        } catch(e) {
            res.status(400).json({
                message: e.message
            });
        }
    }
}