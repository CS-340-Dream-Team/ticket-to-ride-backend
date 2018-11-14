import {Player} from "./Player"
import { Chat } from "./Chat";
import {BusDeck} from "./BusDeck"
import {RouteDeck} from "./RouteDeck"
import { DrawSpread } from "./DrawSpread";
import { GameMap } from "./GameMap";
import { PlayerColor } from "./PlayerColor";
export class Game{

    playersJoined: Player[];
    host: Player;
    name: string;
    static _id: number = 0
    id: number;
    numPlayers: number;
    started:boolean;
    chat: Chat;
    routeDeck:RouteDeck;
    spread:DrawSpread;
    gameMap:GameMap;

    constructor(host: Player, name: string){
        this.playersJoined= [new Player('Betty the Bot', PlayerColor.None)];
        this.host= host;
        this.name= name;
        this.id = Game._id++;
        this.numPlayers=1;
        this.started=false;
        this.chat = new Chat();
        this.addPlayer(host);
        this.routeDeck=new RouteDeck();
        this.spread= new DrawSpread();
        this.gameMap = new GameMap();
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
    drawRoutes(){
        //Check if there are enough routes
        return this.routeDeck.draw()
    }
    getSpread(){
        return this.spread.getSpread()
    }
    assignColors():void{
        for (let x = 0; x <this.playersJoined.length; x++) {
            this.playersJoined[x].color=x+1;
        }
    }
    initBusCards():void{
        this.playersJoined.forEach(player => {
            player.busCards=this.spread.drawFour();
        });
    }

}