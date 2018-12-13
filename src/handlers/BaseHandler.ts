import { Request, Response } from "express";

export class BaseHandler {
	protected model: any;

	handle(req: Request, res: Response): void {}
}
