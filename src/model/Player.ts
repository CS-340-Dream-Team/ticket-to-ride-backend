import { PlayerColor } from "./PlayerColor";
import { BusCard } from "./BusCard";
import { RouteCard } from "./RouteCard";

const numStartingBusPieces = 45;

export class Player {
  name: string;
  color: PlayerColor;
  points: number;
  busPieces: number;
  busCards: BusCard[];
  routeCards: RouteCard[];
  routeCardBuffer: RouteCard[];

  constructor(name: string, color: PlayerColor) {
    this.name = name;
    this.color = color;
    this.points = 0;
    this.busPieces = numStartingBusPieces;
    this.busCards = [];
    this.routeCards = [];
    this.routeCardBuffer = [];
  }

  get pointsGained(): number {
    return this.routeCards
      .filter(route => route.complete)
      .reduce((sum, route) => sum + route.points, 0);
  }

  get pointsLost(): number {
    return this.routeCards
      .filter(route => !route.complete)
      .reduce((sum, route) => sum + route.points, 0);
  }
}
