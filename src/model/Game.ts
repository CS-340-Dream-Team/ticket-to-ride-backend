import { Player } from "./Player";
import { Chat } from "./Chat";
import { BusDeck } from "./BusDeck";
import { RouteDeck } from "./RouteDeck";
import { DrawSpread } from "./DrawSpread";
import { GameMap } from "./GameMap";
import { PlayerColor } from "./PlayerColor";
import { GameOverStat } from "./IGameOverStat";
import { Segment } from "./Segment";

export class Game {
  playersJoined: Player[];
  host: Player;
  name: string;
  static _id: number = 0;
  id: number;
  numPlayers: number;
  started: boolean;
  ended: boolean;
  chat: Chat;
  routeDeck: RouteDeck;
  spread: DrawSpread;
  gameMap: GameMap;
  turn: number;

  constructor(host: Player, name: string) {
    this.playersJoined = [new Player("Betty the Bot", PlayerColor.None)];
    this.host = host;
    this.name = name;
    this.id = Game._id++;
    this.numPlayers = 1;
    this.started = false;
    this.ended = false;
    this.chat = new Chat();
    this.addPlayer(host);
    this.routeDeck = new RouteDeck();
    this.spread = new DrawSpread();
    this.gameMap = new GameMap();
    this.turn = 0;
  }

  addPlayer(player: Player): boolean {
    if (this.numPlayers < 5) {
      //Player Duplication Check
      if (this.playersJoined.includes(player)) {
        return false;
      } else {
        this.playersJoined.push(player);
        this.numPlayers += 1;
        return true;
      }
    }
    return false;
  }

  calculateScores(segments: Segment[]): GameOverStat[] {
    const stats: GameOverStat[] = [];
    for (const player of this.players) {
      let { pointsGained, pointsLost, name } = player;
      const color: string = PlayerColor[player.color];
      const playerSegments: Segment[] = segments.filter(
        segment => segment.owner === player.name
      );
      pointsGained += playerSegments.reduce(
        (sum, segment) => sum + segment.pointValue,
        0
      );
      const totalPoints: number = pointsGained - pointsLost;
      stats.push({
        name,
        color,
        pointsGained,
        pointsLost,
        totalPoints,
        winner: false
      });
    }
    const indexOfWinner: number = stats.reduce(
      (maxIndex, stat, index, arr) =>
        stat.totalPoints > arr[maxIndex].totalPoints ? index : maxIndex,
      0
    );
    stats[indexOfWinner].winner = true;
    return stats;
  }

  endGame(): void {
    this.ended = true;
  }

  get players(): Player[] {
    return this.playersJoined;
  }

  drawRoutes() {
    //Check if there are enough routes
    return this.routeDeck.draw();
  }
  getSpread() {
    return this.spread.getSpread();
  }
  assignColors(): void {
    for (let x = 0; x < this.playersJoined.length; x++) {
      this.playersJoined[x].color = x + 1;
    }
  }
  initBusCards(): void {
    this.playersJoined.forEach(player => {
      player.busCards = this.spread.drawFour();
    });
  }
}
