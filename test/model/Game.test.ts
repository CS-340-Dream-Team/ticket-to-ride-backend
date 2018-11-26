import { Game } from "../../src/model/Game";
import { Player } from "../../src/model/Player";
import { PlayerColor } from "../../src/model/PlayerColor";
import { Segment } from "../../src/model/Segment";
import { Location } from "../../src/model/Location";
import { LatLong } from "../../src/model/LatLong";
import { BusColor } from "../../src/model/BusColor";

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

// test("adds host and 4 players to fill playersJoined list", () => {
//     let host = new Player("host", PlayerColor.Blue);
//     let game = new Game(host, "gameName");
//     let player2 = new Player("player2", PlayerColor.Blue);
//     let player3 = new Player("player3", PlayerColor.Blue);
//     let player4 = new Player("player4", PlayerColor.Blue);
//     let player5 = new Player("player5", PlayerColor.Blue);
//     let player6 = new Player("player6", PlayerColor.Blue);
//     if (game.playersJoined.length == 1) {
//         expect(game.playersJoined.length).toBe(1);
//         expect(game.addPlayer(player2)).toBe(true);
//     }
//     expect(game.playersJoined.length).toBe(2);
//     expect(game.addPlayer(player3)).toBe(true);
//     expect(game.playersJoined.length).toBe(3);
//     expect(game.addPlayer(player4)).toBe(true);
//     expect(game.playersJoined.length).toBe(4);
//     expect(game.addPlayer(player5)).toBe(true);
//     expect(game.playersJoined.length).toBe(5);
// })

test("Calculates longest route correctly", () => {
    let host = new Player("host", PlayerColor.Blue);
    let game = new Game(host, "gameName");
    let player2 = new Player("player2", PlayerColor.Blue);
    let player3 = new Player("player3", PlayerColor.Blue);
    let player4 = new Player("player4", PlayerColor.Blue);
    game.addPlayer(player2);
    game.addPlayer(player3);
    game.addPlayer(player4);

    let a = new Location('A', new LatLong(1, 1));
    let b = new Location('B', new LatLong(2, 2));
    let c = new Location('C', new LatLong(3, 3));
    let d = new Location('D', new LatLong(4, 4));
    let e = new Location('E', new LatLong(5, 5));
    let f = new Location('F', new LatLong(6, 6));
    let g = new Location('G', new LatLong(7, 7));
    let h = new Location('H', new LatLong(8, 8));
    let i = new Location('I', new LatLong(9, 9));
    let j = new Location('J', new LatLong(10, 10));

    let segments = [
        new Segment(1, a, b, 4, 0, BusColor.wild),
        new Segment(2, a, c, 4, 0, BusColor.wild),
        new Segment(3, b, c, 4, 0, BusColor.wild),
        new Segment(4, b, e, 4, 0, BusColor.wild),
        new Segment(5, c, d, 4, 0, BusColor.wild),
        new Segment(6, c, i, 4, 0, BusColor.wild),
        new Segment(7, d, e, 4, 0, BusColor.wild),
        new Segment(8, d, i, 4, 0, BusColor.wild),
        new Segment(9, i, j, 4, 0, BusColor.wild),
        new Segment(10, e, f, 4, 0, BusColor.wild),
        new Segment(11, d, g, 4, 0, BusColor.wild),
        new Segment(12, f, g, 4, 0, BusColor.wild),
        new Segment(13, g, h, 4, 0, BusColor.wild),
        new Segment(14, d, h, 4, 0, BusColor.wild),
        new Segment(15, j, h, 4, 0, BusColor.wild)
    ];
    segments[0].owner = player3;
    segments[1].owner = player2;
    segments[2].owner = player3;
    segments[3].owner = host;
    segments[4].owner = player3;
    segments[5].owner = player2;
    segments[6].owner = player3;
    segments[7].owner = player2;
    segments[8].owner = player2;
    segments[9].owner = player3;
    segments[10].owner = player3;
    segments[11].owner = player3;
    segments[12].owner = player2;
    segments[13].owner = player3;
    segments[14].owner = player2;

    let hostSegments = segments.filter(segment => segment.owner == host);
    let player2Segments = segments.filter(segment => segment.owner == player2);
    let player3Segments = segments.filter(segment => segment.owner == player3);

    expect(game.longestPathForSegment(d, i, 4, [segments[7]], player2Segments)).toBe(16);
    expect(game.longestPathForSegment(c, i, 4, [segments[5]], player2Segments)).toBe(20);
    expect(game.longestPathForSegment(i, c, 4, [segments[5]], player2Segments)).toBe(20);
    expect(game.longestPathForSegment(b, e, 4, [segments[3]], hostSegments)).toBe(4);
    expect(game.longestPathForSegment(b, c, 4, [segments[2]], player3Segments)).toBe(32);
    expect(game.calcLongestRoute(segments)).toEqual([player3.name]);
})