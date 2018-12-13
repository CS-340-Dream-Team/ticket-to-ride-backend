import { BaseHandler } from "./BaseHandler";
import { Request, Response } from "express";
import { ErrorMsgs } from "../model/ErrorMsgs";
import { ServerModel } from "../model/ServerModel";
export class RegisterHandler extends BaseHandler {
	constructor(serverModel: ServerModel) {
		super();
		this.model = serverModel;
	}

	handle(req: Request, res: Response): void {
		try {
			let token = this.model.register(req.body.username, req.body.password);
			res.status(200).send({
				token: token,
			});
		} catch (e) {
			if (e.message === ErrorMsgs.USERNAME_EXISTS) {
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
}
