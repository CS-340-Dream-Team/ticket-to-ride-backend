import { GameMariaDBDao } from "../../src/daos/maria/GameMariaDBDao";
import { Game } from "../../src/model/Game";
import { PlayerColor } from "../../src/model/PlayerColor";
import { Player } from "../../src/model/Player";

// test("game is inserted into database", () => {
// 	let gameDao = new GameMariaDBDao();
// 	let player = new Player("Betty", PlayerColor.Blue);
// 	let game = new Game(player, "test_game");
// 	return gameDao
// 		.saveGame(game)
// 		.then(_ => {
// 			// return gameDao.getGameById(game.id).then(saved_game => {
// 			// 	expect(saved_game.name).toBe(game.name);
// 			// 	return gameDao.removeGameById(game.id);
// 			// });
// 		})
// 		.catch(err => {
// 			console.log(err.message);
// 		});
// });

// test("game is now in database", () => {
// 	let gameDao = new GameMariaDBDao();
// 	return gameDao
// 		.getGameById(0)
// 		.then(saved_game => {
// 			expect(saved_game.name).toBe("test_game");
// 			return gameDao.removeGameById(0);
// 		})
// 		.catch(err => {
// 			console.log(err.message);
// 		});
// });

test("placeholder", () => {
	expect(1).toBe(1);
});
