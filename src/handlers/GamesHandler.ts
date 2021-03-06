import { BaseHandler } from "./BaseHandler";
import { Request, Response } from "express";
import { Command } from "../commands/Command";
import { ErrorMsgs } from "../model/ErrorMsgs";
export class GamesHandler extends BaseHandler {
	constructor() {
		super();
	}

	handle(req: Request, res: Response): void {
		if (req.method === "DELETE") {
			this.deleteGame(req, res);
		} else if (req.method === "POST") {
			if (req.params.id) {
				if (req.url === `/games/${req.params.id}/start`) {
					this.startGame(req, res);
				} else if (req.url === `/games/${req.params.id}/join`) {
					this.joinGame(req, res);
				}
			} else {
				this.createGame(req, res);
			}
		} else if (req.method === "GET") {
			this.getGameList(req, res);
		}
	}

	private deleteGame(req: Request, res: Response): void {
		try {
			let command = this.model.deleteGame(req.params.id);
			res.status(200).send({
				command: command,
			});
		} catch (e) {
			if (e.message === ErrorMsgs.GAME_DOES_NOT_EXIST) {
				res.status(403).send({
					message: e.message,
				});
			} else {
				res.status(400).send({
					message: e.message,
				});
			}
		}
	}

	private joinGame(req: Request, res: Response): void {
		try {
			let command = this.model.joinGame(req.headers.authorization, req.params.id);
			res.status(200).send({
				command: command,
			});
		} catch (e) {
			if (e.message === ErrorMsgs.GAME_DOES_NOT_EXIST) {
				res.status(403).send({
					message: e.message,
				});
			} else if (e.message === ErrorMsgs.PLAYER_ALREADY_IN_GAME) {
				res.status(409).send({
					message: e.message,
				});
			} else {
				res.status(400).send({
					message: e.message,
				});
			}
		}
	}

	private createGame(req: Request, res: Response): void {
		try {
			let command = this.model.createGame(req.headers.authorization, req.body.name);
			res.status(200).send({
				command: command,
			});
		} catch (e) {
			if (
				e.message === ErrorMsgs.GAME_ALREADY_EXISTS ||
				e.message === ErrorMsgs.PLAYER_ALREADY_IN_GAME_CANNOT_CREATE
			) {
				res.status(409).send({
					message: e.message,
				});
			} else if (e.message === ErrorMsgs.UNSTARTED_LIMIT) {
				res.status(403).send({
					message: e.message,
				});
			} else if (e.message === ErrorMsgs.GAMENAME_UNDEFINED) {
				res.status(400).send({
					message: e.message,
				});
			} else {
				res.status(400).send({
					message: e.message,
				});
			}
		}
	}

	private startGame(req: Request, res: Response): void {
		try {
			let command = this.model.startGame(req.headers.authorization, req.params.id);
			res.status(200).send({
				command: command,
			});
		} catch (e) {
			if (e.message === ErrorMsgs.GAME_DOES_NOT_EXIST) {
				res.status(400).send({
					command: new Command("showError", { message: e.message }),
				});
			} else if (e.message === ErrorMsgs.NOT_ENOUGH_PLAYERS) {
				res.status(406).send({
					command: new Command("showError", { message: e.message }),
				});
			} else if (e.message === ErrorMsgs.NOT_HOST) {
				res.status(401).send({
					command: new Command("showError", { message: e.message }),
				});
			} else {
				res.status(400).send({
					command: new Command("showError", { message: e.message }),
				});
			}
		}
	}

	private getGameList(req: Request, res: Response) {
		try {
			let gamesList = this.model.getGameList(req.headers.authorization);
			res.status(200).send({
				command: gamesList,
			});
		} catch (e) {
			res.status(400).send({
				message: e.message,
			});
		}
	}
}
