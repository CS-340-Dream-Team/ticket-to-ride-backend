export class Request {
	url: string;
	method: string;
	body: JSON;
	authToken: string;
	gameId: number;

	constructor(url: string, method: string, body: JSON, authToken: string, gameId: number) {
		this.url = url;
		this.method = method;
		this.body = body;
		this.authToken = authToken;
		this.gameId = gameId;
	}
}
