import { BusColor } from "./BusColor";
import { ICard } from "./ICard";
export class BusCard implements ICard{
    color:BusColor
    constructor(color:BusColor){
        this.color=color
    }
}