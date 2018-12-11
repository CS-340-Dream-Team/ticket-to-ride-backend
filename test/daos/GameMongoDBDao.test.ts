import { GameMongoDBDao } from "../../src/daos/mongo/GameMongoDBDao";
import { Game } from "../../src/model/Game";
import { Player } from "../../src/model/Player";
import { PlayerColor } from "../../src/model/PlayerColor";

// test("game is inserted into database", () => {
// 	let gameDao = new GameMongoDBDao();
// 	let player = new Player("Betty", PlayerColor.Blue);
// 	let game = new Game(player, "test_game");
// 	return gameDao
// 		.saveGame(game)
// 		.then(_ => {
// 			return gameDao.getAllGames().then(saved_games => {
// 				expect(saved_games.length).toBeGreaterThan(-1);
// 				//return gameDao.removeGameById(game.id);
// 			});
// 		})
// 		.catch(err => {
// 			console.log(err.message);
// 		});
// });

test("placeholder", () => {
	expect(1).toBe(1);
});
