import { PlayerColor } from "./PlayerColor";
import { BusCard } from "./BusCard";
import { RouteCard } from "./RouteCard";
import { BusColor } from './BusColor';
import { Segment } from "./Segment";
import SegmentGraph from "../utils/SegmentGraph";

const numStartingBusPieces = 45;

export class Player {
  name: string;
  color: PlayerColor;
  points: number;
  segments: Segment[];
  busPieces: number;
  busCards: BusCard[];
  routeCards: RouteCard[];
  routesCompleted: RouteCard[];
  routeCardBuffer: RouteCard[];

  constructor(name: string, color: PlayerColor) {
    this.name = name;
    this.color = color;
    this.points = 0;
    this.segments = [];
    this.busPieces = numStartingBusPieces;
    this.busCards = [];
    this.routeCards = [];
    this.routesCompleted = [];
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

  private getCardCounts(cards: BusCard[]): Map<string, number> {
    return new Map<string, number>(
        [
            ['red', cards.filter(card => card.color === BusColor.red).length],
            ['orange', cards.filter(card => card.color === BusColor.orange).length],
            ['yellow', cards.filter(card => card.color === BusColor.yellow).length],
            ['green', cards.filter(card => card.color === BusColor.green).length],
            ['blue', cards.filter(card => card.color === BusColor.blue).length],
            ['purple', cards.filter(card => card.color === BusColor.purple).length],
            ['black', cards.filter(card => card.color === BusColor.black).length],
            ['white', cards.filter(card => card.color === BusColor.white).length],
            ['wild', cards.filter(card => card.color === BusColor.wild).length]
        ]
    );
  }

  private getWithDefault(map: Map<any, any>, key: any, defaultVal: any) {
      return map.get(key) || defaultVal;
  }

    public hasCards(cards: BusCard[]) {
        const currentCardCounts = this.getCardCounts(this.busCards);
        const proposedCardCounts = this.getCardCounts(cards);

        let ret = true;
        for (const key of currentCardCounts.keys()) {
            if (this.getWithDefault(currentCardCounts, key, 0) < this.getWithDefault(proposedCardCounts, key, 0)) {
                ret = false;
            }
        }
        return ret;
    }

    private removeSingleCardOfColor(color: BusColor) {
        for (let i = 0; i < this.busCards.length; i++) {
            let card = this.busCards[i];
            if (card.color === color) {
                this.busCards.splice(i, 1);
                break;
            }
        }
    }

    public removeCards(cards: BusCard[]) {
        for (const card of cards) {
            this.removeSingleCardOfColor(card.color);
        }
    }

    public addSegment(segment: Segment) {
        this.segments.push(JSON.parse(JSON.stringify(segment)));
        const graph = new SegmentGraph(this.segments);
        this.routesCompleted = this.routeCards.filter(route => {
            return graph.isRouteComplete(route);
        });
    }

    public getRoutesCompleted(): RouteCard[] {
        return this.routesCompleted;        
    }
}
