import { ICommand } from "./ICommand";
import { BusColor } from "../model/BusColor";
import { ErrorMsgs } from "../model/ErrorMsgs";

export class GameCommand implements ICommand{

    type: string;
    data: Object;
    privateData: Object;
    player: string;
    id: number;
    message: string;

    constructor(type:string, data:Object, privateData:Object, player:string, id:number) {
        this.type = type;
        this.data = data;
        this.privateData = privateData;
        this.player = this.generatePlayer(player);
        this.id = id;
        this.message = this.generateMessage();
    }

    generatePlayer(player: string) {
        if (this.type === "incrementTurn") {
            let temp = this.data as {"playerTurnName": string};
            return temp.playerTurnName;
        }
        return player;
    }

    generateMessage() {
        if (this.type === "drawBusCard") {
            return this.drawBus();
        } else if(this.type === "drawRoutes"){
            return this.drawRoutes();
        } else if(this.type ==="discardRoutes"){
            return this.discardRoutes();
        } else if(this.type ==="incrementTurn"){
            return this.incrementTurn();
        } else if(this.type === "claimSegment") {
            return this.claimSegment();
        } else if(this.type === "lastRound"){
            return this.lastRound();
        }
        else{
            return "unknown";
        }
    }

    drawBus() {
        let public_data = this.data as {"cardColor": BusColor};
        if (public_data.cardColor != null) {
            let cardColor = public_data.cardColor;
            return this.player + " drew a "+ BusColor[cardColor] + " card.";
        } 
        return this.player + " drew a card from the top.";
    }

    drawRoutes() {
        return this.player + " drew route cards.";
    }

    discardRoutes() {
        let temp= this.data as {"numCardsKept":number};
        let numCards=temp.numCardsKept;
        return this.player+ " kept "+numCards+" route card" + (numCards === 1 ? "." : "s.");
    }

    incrementTurn() {
        let temp = this.data as {"playerTurnName": string};
        return "It is now " + temp.playerTurnName + "\'s turn.";
    }

    claimSegment() {
        let temp = this.data as {"segmentId": number};
        return this.player + " claimed segment " + temp.segmentId;
    }
    lastRound(){
        return this.player +" finished their last turn. This is now the last round.";
    }    
}