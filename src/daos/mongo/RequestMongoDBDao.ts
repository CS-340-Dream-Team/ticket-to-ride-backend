import { IRequestDao } from "../IRequestDao";
import { Request } from "../../model/Request";
import { MongoClient, Db, Collection } from "mongodb";

export class RequestMongoDBDao implements IRequestDao {
	private client: MongoClient;
	private dbName: string;
	constructor({ url = "mongodb://localhost:27017", dbName = "ttr" } = {}) {
		this.client = new MongoClient(url, {
			auth: {
				user: "root",
				password: "super-secret-password",
			},
		});
		this.dbName = dbName;
	}

	saveRequest(req: Request): Promise<boolean> {
		return this.client
			.connect()
			.then(client => {
				const db: Db = client.db(this.dbName);
				const requests = db.collection("requests");
				return requests.insertOne(req);
			})
			.then(() => true);
	}

	getRequestsByGameId(gameId: number): Promise<Request[]> {
		return this.client.connect().then(client => {
			const db: Db = client.db(this.dbName);
			const requests = db.collection("requests");
			let ret_requests: Request[] = [];
			return requests
				.find({ gameId: gameId })
				.toArray()
				.then(saved_requests => {
					saved_requests.forEach(saved_request => {
						ret_requests.push({
							url: saved_request.url,
							method: saved_request.method,
							body: saved_request.body,
							authToken: saved_request.authToken,
							gameId: saved_request.gameId,
						} as Request);
					});
					return ret_requests;
				});
		});
	}

	removeRequestsByGameId(gameId: number): Promise<null> {
		return this.client
			.connect()
			.then((client: MongoClient) => {
				const db: Db = client.db(this.dbName);
				return db.collection("requests").deleteMany({ gameId: gameId });
			})
			.then(() => null);
	}

	clearRequests(): Promise<null> {
		return this.client
			.connect()
			.then((client: MongoClient) => {
				const db: Db = client.db(this.dbName);
				return db.collection("requests").deleteMany({});
			})
			.then(() => null);
	}
}
