import { BusCard } from "./BusCard";
import { Game } from "./Game";
import { BusDeck } from "./BusDeck";

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
    
    private replaceCard(card:BusCard)
    {

    }
    /*
    drawCard(index:number):BusCard{
        
    }
    */
   getSpread():BusCard[]{
    return this.spread;
   }

}