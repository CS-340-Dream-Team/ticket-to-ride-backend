import { BusCard } from "./BusCard";
import { Game } from "./Game";
import { BusDeck } from "./BusDeck";
import { ErrorMsgs } from "./ErrorMsgs";

export class DrawSpread{
    spread:BusCard[];
    busDeck:BusDeck;

    constructor(){
        this.busDeck=new BusDeck()
        this.spread = this.busDeck.cards.slice(0,5);
        this.busDeck.cards.splice(0, 5);
    }

    private getNumCards():number{
        return this.spread.length;
    }

    private hasThreeWilds():boolean{
        let count=0;
        this.spread.forEach(card => {
            if(card.isWild()){
                count++;
            }
        });
        if(count>=3){
            return true
        }
        return false;
    }
    
    getSpread():BusCard[]{
        return this.spread;
    }
    getBusDeckCount():number{
        return this.busDeck.cards.length;
    }
    drawFour():BusCard[]{
        let cards=[]
        for(let i=0;i<4;i++){
            let card=this.busDeck.drawCard();
            if(card){
                cards.push(card);
            }
        }
        return cards;
    }

    drawCard(index: number) {
        if (index >= 0 && index <= 4) {
            let card = this.spread[index];
            this.spread[index] = this.busDeck.drawCard();
            if (this.hasThreeWilds()) {
                this.spread.forEach((oldCard) => {
                    this.busDeck.discardCard(oldCard);
                });
                this.spread = this.busDeck.cards.slice(0,5);
                this.busDeck.cards.splice(0, 5);
            }
            return card;
        }
        else if (index == 5) {
            return this.busDeck.drawCard();
        }
        else {
            throw new Error(ErrorMsgs.INVALID_BUS_CARD_INDEX);
        }
    }

    replaceCard(index: number, oldCard: BusCard) {
        let card = this.spread[index];
        this.busDeck.cards.unshift(card);
        this.spread[index] = oldCard;
    }
}