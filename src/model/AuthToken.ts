import {Player} from "./Player"

export class AuthToken{
    token:string;
    player:Player;
    constructor(token:string, player:Player){
        this.token=token;
        this.player=player
    }
}