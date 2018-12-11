import { SessionMariaDBDao } from "../../src/daos/maria/SessionMariaDBDao";
import { SessionDto } from "../../src/model/UserRegistration";

// test("session is inserted into database", () => {
// 	let sessionDao = new SessionMariaDBDao();
// 	let username = "Test User";
// 	let req = {username: username, token: "0c82a54f22f775a3ed8b97b2dea74036"} as SessionDto;
// 	return sessionDao
// 		.saveSession(req)
// 		.then(_ => {
// 			return sessionDao.getAllSessions().then(saved_sessions => {
// 				expect(saved_sessions.length).toBeGreaterThan(-1);
// 				return sessionDao.removeSessionsByUser(username);
// 			});
// 		})
// 		.catch(err => {
// 			console.log(err.message);
// 		});
// });

test("placeholder", () => {
	expect(1).toBe(1);
});
