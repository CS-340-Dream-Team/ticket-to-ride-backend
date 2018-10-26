import {Player} from "./Player"
import { Chat } from "./Chat";
import {BusDeck} from "./BusDeck"
import {RouteDeck} from "./RouteDeck"
import { DrawSpread } from "./DrawSpread";
export class Game{

    playersJoined: Player[];
    host: Player;
    name: string;
    static _id: number = 0
    id: number;
    numPlayers: number;
    started:boolean;
    chat: Chat;
    busDeck:BusDeck;
    routeDeck:RouteDeck;
    spread:DrawSpread;

    constructor(host: Player, name: string){
        this.playersJoined= [];
        this.host= host;
        this.name= name;
        this.id = Game._id++;
        this.numPlayers=0;
        this.started=false;
        this.chat = new Chat();
        this.addPlayer(host);
        //New Stuff
        this.busDeck=new BusDeck();
        this.routeDeck=new RouteDeck();
        this.spread= new DrawSpread()
    }

    addPlayer(player:Player):boolean{
        if(this.numPlayers<5){
            //Player Duplication Check
            if(this.playersJoined.includes(player))
            {
                return false;
            }
            else
            {
                this.playersJoined.push(player);
                this.numPlayers+=1;
                return true;
            }
        }
        return false;
    }
    drawRouteCards(){
        //Check if there are enough routes
        return this.routeDeck.draw()
    }
    getSpread(){
        return this.spread.getSpread()
    }

}