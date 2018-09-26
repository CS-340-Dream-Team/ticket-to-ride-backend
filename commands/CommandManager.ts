import {RegisterCommand} from "./RegisterCommand"
import {LoginCommand} from "./LoginCommand"
import {UpdateGameListCommand} from "./UpdateGameListCommand"
import {UpdatePlayerListCommand} from "./UpdatePlayerListCommand"
export class CommandManager {
    gameListCommands:Array<UpdateGameListCommand>;
    playerListCommands: Array<UpdatePlayerListCommand>;
    
    getGameList(){
        return this.gameListCommands;
    }
}