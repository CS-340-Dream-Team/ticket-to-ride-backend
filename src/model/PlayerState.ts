import { Player } from "./Player";
import { PlayerColor } from "./PlayerColor";
import { BusCard } from "./BusCard";
import { RouteCard } from "./RouteCard";
export class PlayerState{
    name: string
    color:PlayerColor
    points:number
    busPieces:number
    busCards:number|BusCard[]
    routeCards:number|RouteCard[]
    routesCompleted: RouteCard[];
    constructor(player:Player){
        this.name=player.name
        this.points=player.points;
        this.color=player.color;
        this.busCards=player.busCards.length;
        this.busPieces=player.busPieces;
        this.routeCards=player.routeCards.length;
        this.routesCompleted=player.routesCompleted;
    }
}
