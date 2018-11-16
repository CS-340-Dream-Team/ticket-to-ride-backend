import { ICommand } from "./ICommand";
import { BusColor } from "../model/BusColor";

export class GameCommand implements ICommand{

    type:string
    data:Object
    privateData:Object
    player:string
    id:number
    message:string
    constructor(type:string, data:Object, privateData:Object, player:string, id:number){
        this.type=type
        this.data=data
        this.privateData=privateData
        this.player=player
        this.id =id
        this.message=this.generateMessage();
    }
    generateMessage(){
        if(this.type==="drawBus"){
            return this.drawBus();
        } else if(this.type ==="discardRoutes"){
            return this.discardRoutes();
        } else if(this.type ==="incrementTurn"){
            return this.incrementTurn();
        } else if(this.type==="drawRoutes"){
            return this.drawRoutes();
        }
        else{
            return "unknown";
        }
    }
    drawBus(){
        let card_type:BusColor=this.data as BusColor;
        if(this.data==""){
            return this.player + " drew a card from the top."
        }
        return this.player + " drew a "+ card_type.toString + " card."
    }
    drawRoutes(){
        return this.player + " drew route cards."
    }
    discardRoutes(){
        let temp= this.data as {"numCardsKept":number};
        let numCards=temp.numCardsKept;
        return this.player+ " kept "+numCards+" route card" + (numCards === 1 ? "." : "s.");
    }
    incrementTurn(){
        return "It is now "+this.player+"\'s turn."
    }
    
}