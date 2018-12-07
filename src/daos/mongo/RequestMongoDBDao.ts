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
			return requests.find({ gameId }).toArray();
		});
	}

	getRequestById(requestId: number): Promise<Request> {
		return this.client.connect().then((client: MongoClient) => {
			const db: Db = client.db(this.dbName);
			const requests = db.collection("requests");
			return requests.findOne({ id: requestId });
		});
	}

	removeRequestById(requestId: number): Promise<null> {
		return this.client
			.connect()
			.then((client: MongoClient) => {
				const db: Db = client.db(this.dbName);
				return db.collection("requests").deleteOne({ id: requestId });
			})
			.then(() => null);
	}
}
