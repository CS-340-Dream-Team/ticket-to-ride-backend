import { BusCard } from "./BusCard";
import {BusColor} from "./BusColor"
import { ErrorMsgs } from "./ErrorMsgs";
import { Deck } from "./Deck";
export class BusDeck extends Deck{
    cards:BusCard[]
    discard:BusCard[]
    constructor(){
        super();
        this.cards=[]
        this.discard=[]
    /*
       for(let numCards =0;numCards<12;numCards++)
       {
        this.cards.push(new BusCard(BusColor.black))
        this.cards.push(new BusCard(BusColor.blue))
        this.cards.push(new BusCard(BusColor.green))
        this.cards.push(new BusCard(BusColor.orange))
        this.cards.push(new BusCard(BusColor.purple))
        this.cards.push(new BusCard(BusColor.red))
        this.cards.push(new BusCard(BusColor.white))
        this.cards.push(new BusCard(BusColor.wild))
        this.cards.push(new BusCard(BusColor.yellow))
       }
       this.cards.push(new BusCard(BusColor.wild))
       this.cards.push(new BusCard(BusColor.wild))
       */
    }
    /*
    drawCard():BusCard|undefined{
        if(this.cards.length>0)
            return this.cards.pop()
        else if(this.discard.length===0)
        {
            this.cards=this.discard;
            this.discard=[]
            this.shuffle()
        }
        else{
            throw new Error(ErrorMsgs.NOT_ENOUGH_CARDS)
        }
            
    }
    */
    discardCard(card:BusCard){
        this.discard.push(card);
    }
}