import { ICard } from "./ICard";
import {Location} from "./Location"
export class RouteCard implements ICard{
    name:string
    points:number
    start:Location
    end:Location
    complete:boolean
    constructor(name:string, points:number, start:Location, end:Location){
        this.name=name
        this.points=points
        this.start=start
        this.end=end
        this.complete=false
    }
}