import { BusColor } from "./BusColor";
import { ICard } from "./ICard";
export class BusCard implements ICard{
    color:BusColor
    constructor(color:BusColor){
        this.color=color
    }
    isWild(){
        if(this.color===BusColor.wild)
            return true;
        else
            return false;

    }
}