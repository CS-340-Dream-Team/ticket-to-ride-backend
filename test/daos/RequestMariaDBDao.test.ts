import { RequestMariaDBDao } from "../../src/daos/maria/RequestMariaDBDao";
import { Request } from "../../src/model/Request";

// test("request is inserted into database", () => {
// 	let requestDao = new RequestMariaDBDao();
// 	let body = '{ "messageText": "Test message" }';
// 	let gameId = 0;
// 	let token = "0c82a54f22f775a3ed8b97b2dea74036";
// 	let req = new Request("/chat/new/0", "POST", JSON.parse(body), token, gameId);
// 	return requestDao
// 		.saveRequest(req)
// 		.then(_ => {
// 			return requestDao.getRequestsByGameId(gameId).then(saved_requests => {
// 				expect(saved_requests.length).toBeGreaterThan(-1);
// 				return requestDao.removeRequestsByGameId(gameId);
// 			});
// 		})
// 		.catch(err => {
// 			console.log(err.message);
// 		});
// });

test("placeholder", () => {
	expect(1).toBe(1);
});
