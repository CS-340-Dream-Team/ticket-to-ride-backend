import { RequestMongoDBDao } from "../../src/daos/mongo/RequestMongoDBDao";
import { Request } from "../../src/model/Request";

test("request is inserted into database", () => {
	let requestDao = new RequestMongoDBDao();
	let body = '{ "messageText": "Test message" }';
	let gameId = 0;
	let token = "0c82a54f22f775a3ed8b97b2dea74036";
	let req = new Request("/chat/new/0", "POST", JSON.parse(body), token, gameId);
	return requestDao
		.saveRequest(req)
		.then(_ => {
			console.log('here')
			return requestDao.getRequestById(req.id).then(saved_request => {
				console.log(saved_request);
				expect(saved_request.authToken).toBe(token);
				return requestDao.removeRequestById(req.id);
			});
		})
		.catch(err => {
			console.log(err.message);
		});
});

test("placeholder", () => {
	expect(1).toBe(1);
});
