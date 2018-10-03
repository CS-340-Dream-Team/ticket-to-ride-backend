import {Player} from "./Player"
export class Game{

    playersJoined: Player[];
    host: Player;
    name: string;
    static _id: number = 0
    id: number;
    numPlayers: number;

    constructor(host: Player, name: string){
        this.playersJoined= [];
        this.host= host;
        this.name= name;
        this.id = Game._id++;
        this.numPlayers=0;
        this.addPlayer(host);
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

}