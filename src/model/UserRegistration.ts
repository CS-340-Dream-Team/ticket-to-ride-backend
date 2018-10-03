import { IUserRegistration } from "./IUserRegistration";
import { Player } from "./Player";
import { PlayerColor } from "./Color";

export class UserRegistration implements IUserRegistration{

    username:string;
    password:string;
    tokens:string[];
    player: Player;

    constructor(username:string, password:string, token:string){
        this.password=password;
        this.tokens= [];
        this.tokens.push(token);
        this.username=username;
        this.player = new Player(username, PlayerColor.None);
    }

}