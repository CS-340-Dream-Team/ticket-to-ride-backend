import { Player } from "./Player";
import { Chat } from "./Chat";
import { BusDeck } from "./BusDeck";
import { RouteDeck } from "./RouteDeck";
import { DrawSpread } from "./DrawSpread";
import { GameMap } from "./GameMap";
import { PlayerColor } from "./PlayerColor";
import { GameOverStat } from "./IGameOverStat";
import { Segment } from "./Segment";
import { BusCard } from "./BusCard";

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
    this.turn = -1;
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
    this.players.forEach(player => {
      player.busCards=[];
      player.routeCards=[];
      player.points=0;
      player.color=0;
      player.busPieces=45;
      player.routeCardBuffer=[];
    });
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
  
  

  giveCardToPlayer(index: number, playerName: string) {
    let card = this.spread.drawCard(index);
      this.playersJoined.forEach(player => {
        if (player.name === playerName) {
          player.busCards.push(card);
        }
      });
    return card;
  }
  drawTen(playerName: string): BusCard[] {
    let stack:BusCard[]=[];
    this.playersJoined.forEach(player=>{
      if(player.name===playerName){
        for (let i = 0; i < 10; i++) {   
          stack.push(this.spread.busDeck.drawCard())
        }
        player.busCards.push(...stack);
      }
    })
    return stack;
}
  revokePlayerCard(playerName: string, index: number) {
    this.playersJoined.forEach(player => {
      if (player.name === playerName) {
        let lastIndex = player.busCards.length - 1;
        let card = player.busCards[lastIndex];
        player.busCards.splice(lastIndex, 1);
        this.spread.spread[index] = card;
      }
    });
  } 
}
