import {Command} from "./Command"
export class CommandManager {
    gameListCommands:Array<Command>;
    playerListCommands: Array<Command>;
    constructor(){
        this.gameListCommands=new Array<Command>();
        this.playerListCommands= new Array<Command>();

    }
    getGameList(){
        return this.gameListCommands;
    }
    //Create save() function

}