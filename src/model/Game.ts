import { Player } from "./Player";
import { Chat } from "./Chat";
import { BusDeck } from "./BusDeck";
import { Location } from "./Location";
import { RouteDeck } from "./RouteDeck";
import { DrawSpread } from "./DrawSpread";
import { GameMap } from "./GameMap";
import { PlayerColor } from "./PlayerColor";
import { GameOverStat } from "./IGameOverStat";
import { Segment } from "./Segment";
import { BusCard } from "./BusCard";
import { getMaxListeners } from "cluster";
import loadJSON from "../utils/jsonLoader";
import { USING_BETTY } from "./ServerModel";
const segments_json = loadJSON('src/data/segments.json');

export class Game {

  playersJoined: Player[];
  host: Player;
  name: string;
  static _id: number = 0;
  id: number;
  numPlayers: number;
  started: boolean;
  lastRound: boolean;
  turnsLeft: number;
  ended: boolean;
  chat: Chat;
  routeDeck: RouteDeck;
  spread: DrawSpread;
  gameMap: GameMap;
  turn: number;
  segments: Segment[] = [];

  constructor(host: Player, name: string) {
    if (USING_BETTY) {
      this.playersJoined = [new Player("Betty the Bot", PlayerColor.None)];
    } else {
      this.playersJoined = [];
    }
    this.host = host;
    this.name = name;
    this.id = Game._id++;
    this.numPlayers = USING_BETTY ? 1 : 0;
    this.started = false;
    this.lastRound = false;
    this.turnsLeft = -1;
    this.ended = false;
    this.chat = new Chat();
    this.addPlayer(host);
    this.routeDeck = new RouteDeck();
    this.spread = new DrawSpread();
    this.gameMap = new GameMap();
    this.turn = -1;
    for (let i = 0; i < segments_json.length; i++) {
      let s = segments_json[i];
      this.segments.push(new Segment(s['id'], s['start'], s['end'], s['length'], s['pair'], s['color']));
    }
  }

  segmentAlreadyClaimed(segmentId: number): boolean {
    return this.segments[segmentId-1].owner !== null;
  }

  markSegmentClaimed(segmentId: number, player: Player): void {
      this.segments[segmentId-1].claim(player);
  }

  getSegmentById(segmentId: number) {
      return this.segments[segmentId-1];
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

  calcLongestRoute(segments: Segment[]) {
    let playerLengths = []
    for (const player of this.players) {
      let lengths = [0];
      const playerSegments: Segment[] = segments.filter(
        segment => segment.owner === player
      );
      for (const segment of playerSegments) {
        lengths.push(this.longestPathForSegment(segment.start, segment.end, segment.length, [segment], playerSegments));
      }
      playerLengths.push({name: player.name, length: Math.max(...lengths)});
    }
    // Find best from playerLengths
    let maxLength = 0;
    let maxPlayer: string[] = [];
    for (const playerLength of playerLengths) {
      if (playerLength.length > maxLength) {
        maxPlayer = [playerLength.name];
        maxLength = playerLength.length;
      } else if (playerLength.length == maxLength) {
        maxPlayer.push(playerLength.name);
      }
    }
    return maxPlayer;
  }

  longestPathForSegment(start: Location, end: Location, length: number, visited: Segment[], allSegments: Segment[]) {
    let lengths = [length];
    for (const segment of allSegments) {
      if (!visited.includes(segment)) {
        if (segment.start.name === start.name) {
          lengths.push(this.longestPathForSegment(segment.end, end, length + segment.length, [...visited, segment], allSegments));
        } else if (segment.end.name === start.name) {
          lengths.push(this.longestPathForSegment(segment.start, end, length + segment.length, [...visited, segment], allSegments));
        } else if (segment.end.name === end.name) {
          lengths.push(this.longestPathForSegment(start, segment.start,length + segment.length, [...visited, segment], allSegments));
        } else if (segment.start.name === end.name) {
          lengths.push(this.longestPathForSegment(start, segment.end, length + segment.length, [...visited, segment], allSegments));
        }
      }
    }
    return Math.max(...lengths);
  }

  calculateScores(): GameOverStat[] {
    const stats: GameOverStat[] = [];
    let longestRoutePlayers = this.calcLongestRoute(this.segments);
    for (const player of this.players) {
      let isLongest: boolean = longestRoutePlayers.filter(name => name === player.name).length > 0;
      let pointsGained = player.pointsGained;
      let pointsLost = player.pointsLost;
      let name = player.name;
      const color: string = PlayerColor[player.color];
      if (longestRoutePlayers.includes(player.name)) {
        pointsGained += 10;
      }
      const totalPoints: number = pointsGained - pointsLost;
      stats.push({
        name,
        color,
        pointsGained,
        pointsLost,
        longestRoute: isLongest,
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
      player.segments=[];
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

  startLastRound(): void {
    this.lastRound = true;
    this.turnsLeft = this.playersJoined.length - 1;
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
          stack.push(this.spread.busDeck.drawCard(false))
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
