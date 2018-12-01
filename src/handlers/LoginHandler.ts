import { BaseHandler } from "./BaseHandler";
import { Request, Response } from "express";
import { ErrorMsgs } from "../model/ErrorMsgs";

export class LoginHandler extends BaseHandler {
	constructor() {
		super();
	}

	handle(req: Request, res: Response): void {
		try {
			let token = this.model.login(req.body.username, req.body.password);
			res.status(200).send({
				token: token,
			});
		} catch (e) {
			if (e.message === ErrorMsgs.USER_DOES_NOT_EXIST) {
				res.status(403).send({
					message: e.message,
				});
			} else {
				res.status(400).json({
					message: e.message,
				});
			}
		}
	}
}
