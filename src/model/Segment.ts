import { BusColor } from "./BusColor";
import { Location } from "./Location";
export class Segment{
    id:number
    start:Location
    end:Location
    length:number
    owner:string
    pair:number
    color:BusColor
    constructor(id:number, start:Location, end:Location,length:number,pair:number, color:BusColor){
        this.id=id
        this.start=start
        this.end=end
        this.length=length
        this.pair=pair
        this.color=color
        this.owner=""
        }
    claim(newOwner:string):void{
        this.owner=newOwner
    }
}