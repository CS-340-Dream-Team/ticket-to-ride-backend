import { Request } from "../model/Request";

export interface IRequestDao {
	saveRequest(): void;
	getRequestsByGameId(gameId: number): Request[];
}
