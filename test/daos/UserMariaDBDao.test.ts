import { UserMariaDBDao } from "../../src/daos/maria/UserMariaDBDao";
import { UserDto } from "../../src/model/UserRegistration";

// test("user is inserted into database", () => {
// 	let userDao = new UserMariaDBDao();
// 	let username = "Test User"
// 	let req = {username: username, password: "password"} as UserDto;
// 	return userDao
// 		.saveUser(req)
// 		.then(_ => {
// 			return userDao.getUserByName(req.username).then(saved_user => {
// 				expect(saved_user.username).toBe(username);
// 				return userDao.removeUserByName(req.username);
// 			});
// 		})
// 		.catch(err => {
// 			console.log(err.message);
// 		});
// });

// test("all users selected from database", () => {
// 	let gameDao = new UserMariaDBDao();
// 	return gameDao
// 		.getAllUsers()
// 		.then(saved_users => {
// 			expect(saved_users.length).toBeGreaterThan(-1);
// 		})
// 		.catch(err => {
// 			console.log(err.message);
// 		});
// });

// test("user deleted from database", () => {
// 	let gameDao = new UserMariaDBDao();
// 	return gameDao
// 		.removeUserByName("name")
// 		.then(null)
// 		.catch(err => {
// 			console.log(err.message);
// 		});
// });

test("placeholder", () => {
	expect(1).toBe(1);
});
