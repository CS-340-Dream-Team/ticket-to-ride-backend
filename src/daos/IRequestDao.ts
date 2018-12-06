import { Request } from "../model/Request";

export interface IRequestDao {
	saveRequest(req: Request): void;
	getRequestsByGameId(gameId: number): Request[];
}
