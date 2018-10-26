import { ICard } from "./ICard";

export class RouteCard implements ICard{
    name:string
    points:number
    start:Location
    end:Location
    constructor(name:string, points:number, start:Location, end:Location){
        this.name=name
        this.points=points
        this.start=start
        this.end=end
    }
}