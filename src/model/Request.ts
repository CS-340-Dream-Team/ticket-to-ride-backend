export class Request {
	static _id: number = 0;
	id: number;
	url: string;
	method: string;
	body: JSON;
	authToken: string;
	gameId: number;

	constructor(url: string, method: string, body: JSON, authToken: string, gameId: number) {
		this.id = Request._id++;
		this.url = url;
		this.method = method;
		this.body = body;
		this.authToken = authToken;
		this.gameId = gameId;
	}
}
