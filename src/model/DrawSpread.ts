import { BusCard } from "./BusCard";

export class DrawSpread{
    spread:BusCard[]
    constructor(){
       this.spread=[]
        
        
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