import {Command} from "./Command"
import { Message } from "../model/Message";
import { Player } from "../model/Player";

// This class will be used for commands within games to update all games with new moves
export class CommandManager {

    gameCommandQueues: Array<Command[]>;
    chatCommandQueues: Array<Command[]>;

    constructor(){
        this.gameCommandQueues = [];
        this.chatCommandQueues = [];
    }

    addGame() {
        this.gameCommandQueues.push([]);
        this.chatCommandQueues.push([]);
    }

    addCommand(gameId: number, commandType: string, commandInfo: Object): Command {
        let command = new Command(commandType, commandInfo);
        this.gameCommandQueues[gameId].push(command);
        return command;
    }

    addChatCommand(gameId: number, message: Message, prevTimestamp: number): Command {
        let data = {
            messageText: message.messageText,
            sender: message.sender,
            timestamp: message.timestamp
        }
        let newCommand = new Command("updateMessageList", data);
        this.chatCommandQueues[gameId].push(newCommand);
        return newCommand;
    }

    getMessagesAfter(gameId: number, prevTimestamp: number): Command[] {
        let commands: Command[] = [];
        this.chatCommandQueues[gameId].forEach( command => {
            let message = command.data as Message
            if (message.timestamp > prevTimestamp) {
                commands.push(command);
            }
        });
        return commands;
    }

    getGameplayAfter(gameId: number, prevTimestamp: number): Command[] {
        let commands: Command[] = [];
        this.gameCommandQueues[gameId].forEach( command => {
            //FIXME figure out how to determine which commands to send
            // if (command.data.timestamp > prevTimestamp) {
                // commands.push(command);
            // }
        });
        return commands;
    }

    getGameList(){
    }

    //Create save() function

}