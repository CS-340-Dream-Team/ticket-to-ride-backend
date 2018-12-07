import { Request } from "../model/Request";

export interface IRequestDao {
	saveRequest(req: Request): Promise<boolean>;
	getRequestsByGameId(gameId: number): Promise<Request[]>;
	getRequestById(requestId: number): Promise<Request>;
	removeRequestById(requestId: number): Promise<null>;
}
