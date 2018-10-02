import {Player} from "./Player"
export class Game{

    playersJoined: Player[];
    host: Player;
    name: string;
    id: number = 0;
    numPlayers: number;

    constructor(host: Player, name: string){
        this.playersJoined= [];
        this.host= host;
        this.name= name;
        this.id += 1;
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