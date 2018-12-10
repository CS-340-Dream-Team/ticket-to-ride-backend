import { GameMongoDBDao } from "../../src/daos/mongo/GameMongoDBDao";
import { Game } from "../../src/model/Game";
import { Player } from "../../src/model/Player";
import { PlayerColor } from "../../src/model/PlayerColor";

// test("game is inserted into database", () => {
// 	let gameDao = new GameMongoDBDao();
//  let player=new Player("Betty",PlayerColor.Blue);
// 	let game = new Game(player,"test_game")
// 	return gameDao
// 		.saveGame(game)
// 		.then(_ => {
// 			gameDao.getGameById(game.id).then(saved_game => {
// 				expect(saved_game.name).toBe("test_game");
// 				gameDao.removeGameById(game.id);
// 			});
// 		})
// 		.catch(err => {
// 			console.log(err.message);
// 		});
// });

test("placeholder", () => {
	expect(1).toBe(1);
});
