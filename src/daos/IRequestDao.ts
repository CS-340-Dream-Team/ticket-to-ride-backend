import { Request } from "../model/Request";

export interface IRequestDao {
	saveRequest(req: Request): Promise<boolean>;
	getRequestsByGameId(gameId: number): Promise<Request[]>;
	removeRequestsByGameId(gamdId: number): Promise<null>;
	clearRequests(): Promise<null>;
}
