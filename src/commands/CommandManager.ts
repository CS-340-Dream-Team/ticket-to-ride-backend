import {Command} from "./Command"
import { Message } from "../model/Message";
import { Player } from "../model/Player";
import { ErrorMsgs } from "../model/ErrorMsgs";
import { GameCommand } from "./GameCommand";

// This class will be used for commands within games to update all games with new moves
export class CommandManager {

    gameCommandQueues: Array<GameCommand[]>;
    chatCommandQueues: Array<Command[]>;

    constructor(){
        this.gameCommandQueues = [];
        this.chatCommandQueues = [];
    }

    addGame() {
        this.gameCommandQueues.push([]);
        this.chatCommandQueues.push([]);
    }

    addCommand(gameId: number, commandType: string, publicData: Object, privateData:Object, player:string): GameCommand {
        let commandID=this.gameCommandQueues[gameId].length
        let command = new GameCommand(commandType, publicData, privateData, player, commandID);
        this.gameCommandQueues[gameId].push(command);
        return command;
    }
    /*
    Game commands need two data fields universal and specific. All commands will be returned as
    */
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
    private getPrivatizedCommand(player:string, command:GameCommand){
        if(player===command.player){
            return command;
        }
        else{
            return new GameCommand(command.type,command.data,{},command.player,command.id);
        }
    }
    getGameplayAfter(gameId: number, prevId: number, player:string): GameCommand[] {
        let commands: GameCommand[] = [];
        this.gameCommandQueues[gameId].forEach( command => {
            //FIXME figure out how to determine which commands to send
            if (command.id !== undefined) {
                if (command.id > prevId) {
                    commands.push(this.getPrivatizedCommand(player,command))
                }
            }
            else {
                throw new Error(ErrorMsgs.INVALID_COMMAND);
            }
        });
        return commands;
    }

    getGameList(){
    }

    //Create save() function

}