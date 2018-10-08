import { Game } from "../../src/model/Game";
import { Player } from "../../src/model/Player";
import { PlayerColor } from "../../src/model/PlayerColor";

test("adds host and 5 players to game to not allow 6th player", () => {
    let host = new Player("host", PlayerColor.Blue);
    let game = new Game(host, "gameName");
    let player2 = new Player("player2", PlayerColor.Blue);
    let player3 = new Player("player3", PlayerColor.Blue);
    let player4 = new Player("player4", PlayerColor.Blue);
    let player5 = new Player("player5", PlayerColor.Blue);
    let player6 = new Player("player6", PlayerColor.Blue);
    game.addPlayer(player2);
    game.addPlayer(player3);
    game.addPlayer(player4);
    game.addPlayer(player5);
    expect(game.addPlayer(player6)).toBe(false);
})

test("adds host twice to not allow duplicate players", () => {
    let host = new Player("host", PlayerColor.Blue);
    let game = new Game(host, "gameName");
    expect(game.addPlayer(host)).toBe(false);
})

test("adds host and 4 players to fill playersJoined list", () => {
    let host = new Player("host", PlayerColor.Blue);
    let game = new Game(host, "gameName");
    let player2 = new Player("player2", PlayerColor.Blue);
    let player3 = new Player("player3", PlayerColor.Blue);
    let player4 = new Player("player4", PlayerColor.Blue);
    let player5 = new Player("player5", PlayerColor.Blue);
    let player6 = new Player("player6", PlayerColor.Blue);
    expect(game.playersJoined.length).toBe(1);
    expect(game.addPlayer(player2)).toBe(true);
    expect(game.playersJoined.length).toBe(2);
    expect(game.addPlayer(player3)).toBe(true);
    expect(game.playersJoined.length).toBe(3);
    expect(game.addPlayer(player4)).toBe(true);
    expect(game.playersJoined.length).toBe(4);
    expect(game.addPlayer(player5)).toBe(true);
    expect(game.playersJoined.length).toBe(5);
})