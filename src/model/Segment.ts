import { BusColor } from "./BusColor";
import { Location } from "./Location";
import { Player } from "./Player";
const PointValues: number[] = [1, 2, 6, 7, 10, 15];

export class Segment {
  id: number;
  start: Location;
  end: Location;
  length: number;
  owner: Player | null;
  pair: number;
  color: BusColor;
  constructor(
    id: number,
    start: Location,
    end: Location,
    length: number,
    pair: number,
    color: BusColor
  ) {
    this.id = id;
    this.start = start;
    this.end = end;
    this.length = length;
    this.pair = pair;
    this.color = color;
    this.owner = null;
  }
  claim(newOwner: Player): void {
    this.owner = newOwner;
  }

  get pointValue(): number {
    return PointValues[this.length - 1];
  }
}
