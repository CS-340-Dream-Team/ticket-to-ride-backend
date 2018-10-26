import { RouteCard } from "./RouteCard";
import { ErrorMsgs } from "./ErrorMsgs";
import { Deck } from "./Deck";
//import json
//import from "../data/routes.json";
export class RouteDeck extends Deck{
    cards:RouteCard[]
    constructor(){
        super();
        this.cards=[]
        //load cards from json
    }
    draw(){
        /*
        if(this.cards.length>2){
            let hand=[]
            for(let x=0;x<3;x++){
                hand.push(this.cards.pop())
            }
            return hand;  
        }
        else{
            throw new Error(ErrorMsgs.NOT_ENOUGH_CARDS)
        }
        */
    }
    discard(cards:RouteCard[]){
        cards.forEach(card => {
            this.cards.push(card)
        });
    }


}