import { UserDto } from "../../src/model/UserRegistration";
import { UserMongoDBDao } from "../../src/daos/mongo/UserMongoDBDao";

// test("user is inserted into database", () => {
// 	let user = { username: "betty", password:"the bot" } as UserDto
//     let userDao = new UserMongoDBDao();
// 	return userDao
// 		.saveUser(user)
// 		.then(_ => {
// 			return userDao.getUserByName(user.username).then(saved_user => {
// 				expect(saved_user.password).toBe(user.password);
// 				// return userDao.removeUserByName(user.username);
// 			});
// 		})
// 		.catch(err => {
// 			console.log(err.message);
// 		});
// });

// test("get all users from database", () => {
//     let userDao = new UserMongoDBDao();
// 	return userDao
// 		.getAllUsers()
// 		.then(users => {
// 			expect(users.length).toBeGreaterThan(-1);
// 		})
// 		.catch(err => {
// 			console.log(err.message);
// 		});
// });


test("placeholder", () => {
	expect(1).toBe(1);
});
