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
    
       for(let numCards =0;numCards<12;numCards++)
       {
        this.cards.push(new BusCard(BusColor.black));
        this.cards.push(new BusCard(BusColor.blue));
        this.cards.push(new BusCard(BusColor.green));
        this.cards.push(new BusCard(BusColor.orange));
        this.cards.push(new BusCard(BusColor.purple));
        this.cards.push(new BusCard(BusColor.red));
        this.cards.push(new BusCard(BusColor.white));
        this.cards.push(new BusCard(BusColor.wild));
        this.cards.push(new BusCard(BusColor.yellow));
       }
       this.cards.push(new BusCard(BusColor.wild));
       this.cards.push(new BusCard(BusColor.wild));
       this.shuffle();
    }
    
    drawCard():BusCard{
        if(this.cards.length===0)
        {
            this.cards=this.discard;
            this.discard=[];
            this.shuffle();
        }
        if(this.cards.length===0)
        {
            throw new Error(ErrorMsgs.NOT_ENOUGH_CARDS)
        }
        return this.cards.pop() as BusCard;
    }
    
    discardCard(card:BusCard):void{
        this.discard.push(card);
    }
}