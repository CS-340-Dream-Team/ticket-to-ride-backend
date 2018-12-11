import { ISessionDao } from "../ISessionDao";
import { SessionDto } from "../../model/UserRegistration";
import { MongoClient, Db, Collection } from "mongodb";

export class SessionMongoDBDao implements ISessionDao {
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

	saveSession(session: SessionDto): Promise<boolean> {
		return this.client
			.connect()
			.then(client => {
				const db: Db = client.db(this.dbName);
				const sessions = db.collection("sessions");
				return sessions.insertOne(session);
			})
			.then(() => true);
	}

	getAllSessions(): Promise<SessionDto[]> {
		return this.client.connect().then((client: MongoClient) => {
			const db: Db = client.db(this.dbName);
			const sessions = db.collection("sessions");
			let ret_sessions: SessionDto[] = [];
			return sessions
				.find()
				.toArray()
				.then(saved_sessions => {
					saved_sessions.forEach(session => {
						ret_sessions.push({ username: session.username, token: session.token } as SessionDto);
					});
					return ret_sessions;
				});
		});
	}

	removeSessionsByUser(userName: string): Promise<null> {
		return this.client
			.connect()
			.then((client: MongoClient) => {
				const db: Db = client.db(this.dbName);
				return db.collection("sessions").deleteMany({ username: userName });
			})
			.then(() => null);
	}
}
