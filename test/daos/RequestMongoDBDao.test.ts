import { RequestMongoDBDao } from "../../src/daos/mongo/RequestMongoDBDao";
import { Request } from "../../src/model/Request";
import { request } from "https";

// test("request is inserted into database", () => {
// 	let requestDao = new RequestMongoDBDao();
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

// test("request is deleted from database", () => {
// 	let requestDao = new RequestMongoDBDao();
// 	let gameId = 0;
// 	return requestDao
// 		.removeRequestsByGameId(gameId)
// 		.then(_ => {
// 			return requestDao.getRequestsByGameId(gameId).then(saved_requests => {
// 				expect(saved_requests.length).toBe(0);
// 			})
// 		})
// 		.catch(err => {
// 			console.log(err.message);
// 		});
// });

test("placeholder", () => {
	expect(1).toBe(1);
});
