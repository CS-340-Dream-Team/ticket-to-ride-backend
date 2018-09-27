import {Player} from "./Player"
export class Game{
    playersJoined: Array<Player>;
    host: Player;
    name: string;
    numPlayers: number;
    constructor(host:Player, name:string){
        this.playersJoined=new Array<Player>();
        this.host= host;
        this.name= name;
        this.numPlayers=0;
        this.addPlayer(host);
    }
    addPlayer(player:Player):boolean{
        if(this.numPlayers<5){
            this.playersJoined.push(player);
            this.numPlayers+=1;
            return true;
        }
        return false;
    }
}