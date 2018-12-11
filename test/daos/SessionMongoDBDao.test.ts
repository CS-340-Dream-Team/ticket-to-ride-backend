import { SessionDto } from "../../src/model/UserRegistration";
import { SessionMongoDBDao } from "../../src/daos/mongo/SessionMongoDBDao";

// test("request is inserted into database", () => {
// 	let session = { username: "betty", token: "sneaky token" } as SessionDto;
// 	let sessionDao = new SessionMongoDBDao();
// 	return sessionDao
// 		.saveSession(session)
// 		.then(_ => {
// 			return sessionDao.getAllSessions().then(saved_sessions => {
// 				expect(saved_sessions.length).toBeGreaterThan(-1);
// 				return sessionDao.removeSessionsByUser(session.username);
// 			});
// 		})
// 		.catch(err => {
// 			console.log(err.message);
// 		});
// });

test("placeholder", () => {
	expect(1).toBe(1);
});
