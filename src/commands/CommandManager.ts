import {Command} from "./Command"

// This class will be used for commands within games to update all games with new moves
export class CommandManager {

    gameCommandQueues: Array<Command[]>;

    constructor(){
        this.gameCommandQueues = [];
    }

    addGame() {
        this.gameCommandQueues.push([]);
    }

    addCommand(gameId: number, commandType: string, commandInfo: Object): Command {
        let command = new Command(commandType, commandInfo);
        this.gameCommandQueues[gameId].push(command);
        return command;
    }

    getGameList(){
    }

    //Create save() function

}