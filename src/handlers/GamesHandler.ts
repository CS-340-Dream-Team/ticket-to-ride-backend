import { BaseHandler } from "./BaseHandler";
import { Request, Response } from "express";
import { Command } from "../commands/Command";
import {ErrorMsgs} from "../model/ErrorMsgs"
export class GamesHandler extends BaseHandler{

    constructor() {
        super();
    }

    handle(req: Request, res: Response): void {
        if (req.method === "DELETE") {
            this.deleteGame(req, res);
        } else if (req.method === "POST") {
            if (req.params.id) {
                this.joinGame(req, res);
            } else {
                this.createGame(req, res);
            }
        } else if (req.method === "GET") {
            this.getGamesList(req, res);
        }
    }

    private deleteGame(req: Request, res: Response): void {
        try {
            let command = this.model.deleteGame(req.params.id);
            res.status(200).send({
                command: command
            });
        } catch(e) {
            if(e.message===ErrorMsgs.GAME_DOES_NOT_EXIST)
            {
                res.status(403).send({
                    command: new Command("showError", { message: e.message })
                })
            }
            else{
                res.status(400).send({
                    command: new Command("showError", { message: e.message })
                })
            }
        }
    }

    private joinGame(req: Request, res: Response): void {
        try {
            let command = this.model.joinGame(req.headers.authorization, req.params.id);
            res.status(200).send({
                command: command
            });
        } catch(e) {
            if(e.message===ErrorMsgs.GAME_DOES_NOT_EXIST)
            {
                res.status(403).send({
                    command: new Command("showError", { message: e.message })
                })
            }
            else if(e.message === ErrorMsgs.PLAYER_ALREADY_IN_GAME){
                res.status(409).send({
                    command: new Command("showError", { message: e.message })
                })
            }
            else{
                res.status(400).send({
                    command: new Command("showError", { message: e.message })
                })
            }
        }
    }

    private createGame(req: Request, res: Response): void {
        try {
            let command = this.model.createGame(req.headers.authorization, req.body.name);
            res.status(200).send({
                command: command
            });
        } catch(e) {
            if(e.message === ErrorMsgs.GAME_ALREADY_EXISTS){
                res.status(409).send({
                    command: new Command("showError", { message: e.message })
                })
            }
            else{
                res.status(400).send({
                    command: new Command("showError", { message: e.message })
                })
            }
        }
    }

    private getGamesList(req: Request, res: Response) {
        try {
            let gamesList = this.model.getGamesList(req.headers.authorization);
            res.status(200).send({
                gamesList: gamesList
            });
        } catch(e) {
            res.status(400).send({
                command: new Command("showError", { message: e.message })
            })
        }
    }
}