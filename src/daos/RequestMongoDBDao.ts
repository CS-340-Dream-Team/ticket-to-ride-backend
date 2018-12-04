import { IRequestDao } from "./IRequestDao";
import { Request } from "../model/Request";

export class RequestMongoDBDao implements IRequestDao {
	//TODO: add DB connection

	constructor() {}

	saveRequest(): void {
		//TODO: save request to database
	}

	getRequestsByGameId(gameId: number): Request[] {
		//TODO: grab requests from database by game id
		let body = '{ messageText: "Test message" }';
		return [
			new Request(
				"/chat/new/0",
				"POST",
				JSON.parse(body),
				"0c82a54f22f775a3ed8b97b2dea74036",
				gameId
			),
		];
	}
}
