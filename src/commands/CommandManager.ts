import {Command} from "./Command"
export class CommandManager {
    gameListCommands: Command[];
    playerListCommands: Command[];

    constructor(){
        this.gameListCommands= [];
        this.playerListCommands= [];
    }

    getGameList(){
        return this.gameListCommands;
    }

    //Create save() function

}