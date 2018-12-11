import { IUserDao } from "../IUserDao";
import { MongoClient, Db, Collection } from "mongodb";
import { UserDto } from "../../model/UserRegistration";
export class UserMongoDBDao implements IUserDao {
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

	saveUser(user: UserDto): Promise<boolean> {
		return this.client
			.connect()
			.then(client => {
				const db: Db = client.db(this.dbName);
				const users = db.collection("users");
				return users.insertOne(user);
			})
			.then(() => true);
	}

	getUserByName(userName: string): Promise<UserDto> {
		return this.client.connect().then((client: MongoClient) => {
			const db: Db = client.db(this.dbName);
			const users = db.collection("users");
			return users.findOne({ username: userName });
		});
	}

	getAllUsers(): Promise<UserDto[]> {
		return this.client.connect().then((client: MongoClient) => {
			const db: Db = client.db(this.dbName);
			const users = db.collection("users");
			let ret_users: UserDto[] = [];
			return users
				.find()
				.toArray()
				.then(saved_users => {
					saved_users.forEach(user => {
						ret_users.push({ username: user.username, password: user.password } as UserDto);
					});
					return ret_users;
				});
		});
	}

	removeUserByName(userName: string): Promise<null> {
		return this.client
			.connect()
			.then((client: MongoClient) => {
				const db: Db = client.db(this.dbName);
				return db.collection("users").deleteOne({ username: userName });
			})
			.then(() => null);
	}
}
