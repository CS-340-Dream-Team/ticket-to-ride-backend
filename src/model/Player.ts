import { PlayerColor } from "./PlayerColor";
import { BusCard } from "./BusCard";
import { RouteCard } from "./RouteCard";

const numStartingBusPieces = 45;

export class Player{
    name:string;
    color: PlayerColor;
    points: number;
    busPieces: number;
    busCards: BusCard[];
    routeCards: RouteCard[];

    constructor(name: string, color: PlayerColor){
        this.name=name;
        this.color= color;
        this.points = 0;
        this.busPieces = numStartingBusPieces;
        this.busCards = [];
        this.routeCards = [];
    }

}