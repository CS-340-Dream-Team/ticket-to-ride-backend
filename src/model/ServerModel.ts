import { Game } from "./Game";
import { Player } from "./Player";
import { UserRegistration } from "./UserRegistration";
import { Command } from "../commands/Command";
import {ErrorMsgs} from "./ErrorMsgs"
import { CommandManager } from "../commands/CommandManager";
import { Message } from "./Message";

import hat from "hat";
import { BusDeck } from "./BusDeck";
import { DrawSpread } from "./DrawSpread";

export class ServerModel {


    private static _instance : ServerModel;
    private commandManager: CommandManager;
    private unstartedGames: Game[];
    private startedGames: { [key:number]:Game; };
    private loggedInUsers: UserRegistration[];
    private allUsers: UserRegistration[];
    private unstartedGameLimit: number;

    private constructor() {
        if (ServerModel._instance) {
            throw new Error("Error: Instantiation failed");
        }

        ServerModel._instance = this;
        this.commandManager = new CommandManager();
        this.unstartedGames = [];
        this.startedGames = {};
        this.loggedInUsers = [];
        this.allUsers = [];
        this.unstartedGameLimit=6;
    }

    public static getInstance(): ServerModel {
        if (ServerModel._instance === undefined) {
            ServerModel._instance = new ServerModel();
        }

        return ServerModel._instance;
    }

    login(username: string, password: string): string {
        if (!username || !password) {
            throw new Error(ErrorMsgs.USERNAME_OR_PASSWORD_UNDEFINED);
        }
        var user = this.getUserByUsername(username);
        if (!user || (user && user.password !== password)) {
            throw new Error(ErrorMsgs.WRONG_USERNAME_OR_PASSWORD);
        }
        this.loggedInUsers.push(user);
        let token = hat();
        user.tokens.push(token);
        return token;
    }

    register(username: string, password: string): string {
        if (!username || !password) {
            throw new Error(ErrorMsgs.USERNAME_OR_PASSWORD_UNDEFINED);
        }
        var user = this.getUserByUsername(username);
        if (user) {
            throw new Error(ErrorMsgs.USERNAME_EXISTS);
        }
        let token = hat();
        user = new UserRegistration(username, password, token);
        this.allUsers.push(user);
        this.loggedInUsers.push(user);
        let id = hat();
        user.tokens.push(token);

        return token;
    }

    deleteGame(id: number): Command {
        var game = this.getGameById(id);
        if (!game) {
            throw new Error(ErrorMsgs.GAME_DOES_NOT_EXIST);
        }
        let index = this.unstartedGames.indexOf(game);
        this.unstartedGames.splice(index, 1);
        return new Command("updateGameList", { gameList: this.unstartedGames });
    }

    joinGame(bearerToken: string | undefined, gameId: number): Command {
        let user = this.getUserByToken(bearerToken);
        let gameToJoin = this.getGameById(gameId);
        if (!gameToJoin) {
            throw new Error(ErrorMsgs.GAME_DOES_NOT_EXIST);
        }
        if(this.isPlayerInAGame(user.player)) {
            throw new Error(ErrorMsgs.PLAYER_ALREADY_IN_GAME);
        }
        gameToJoin.addPlayer(user.player);
        return new Command("updatePlayerList", { playerList: gameToJoin.playersJoined });
    }

    createGame(bearerToken: string | undefined, gameName: string): Command {
        let hostUser = this.getUserByToken(bearerToken);
        let game = this.getGameByName(gameName);
        if (gameName === "")
        {
            throw new Error(ErrorMsgs.GAMENAME_UNDEFINED);
        }
        if (game) {
            throw new Error(ErrorMsgs.GAME_ALREADY_EXISTS);
        }
        if (this.unstartedGames.length + 1 > this.unstartedGameLimit){
            throw new Error(ErrorMsgs.UNSTARTED_LIMIT);
        }
        if (this.isPlayerInAGame(hostUser.player)) {
            throw new Error(ErrorMsgs.PLAYER_ALREADY_IN_GAME_CANNOT_CREATE);
        }
        this.unstartedGames.push(new Game(hostUser.player, gameName));
        return new Command("updateGameList", { gameList: this.unstartedGames });
    }

    startGame(bearerToken: string | undefined, gameId: number): Command {
        let game = this.getGameById(gameId)
        let playerName= this.getUsernameByToken(bearerToken)
        if(!game)
        {
            throw new Error(ErrorMsgs.GAME_DOES_NOT_EXIST)
        }
        else if(game.numPlayers<2)
        {
            throw new Error(ErrorMsgs.NOT_ENOUGH_PLAYERS)
        }
        else if(game.host.name!==playerName)
        {
            throw new Error(ErrorMsgs.NOT_HOST)
        }
        game.started=true;
        this.deleteGame(game.id);
        this.startedGames[game.id] = game;
        game.assignColors();
        this.commandManager.addGame();
        return new Command("startGame",{})
    }

    
    getGameList(bearerToken: string | undefined): Command {
        let user = this.getUserByToken(bearerToken);
        let commandToReturn = new Command("updateGameList", { gameList: this.unstartedGames });
        Object.values(this.startedGames).forEach(game => {
            game.playersJoined.forEach(player => {
                if (player.name === user.username) {
                    commandToReturn = new Command("gameStarted", { game: game});
                }
            })
        });
        return commandToReturn;
    }
    drawRoutes(bearerToken:string|undefined): Command {
        let game=this.getGameByToken(bearerToken)
        if(game===undefined)
        {
            throw new Error("Game is undefined")
        }
        let hand=game.drawRoutes()
        return new Command("drawRoutes",hand)
    }
    /*
    getSpread(authorization: string):Command{
        let game= this.getGameByToken(authorization);
        
        let spread=game.getSpread();
        return new Command("spread",{spread})
        
      
    }
*/
    private getGameByToken(bearerToken: string|undefined):Game|undefined{
        let user=this.getUserByToken(bearerToken)
        Object.values(this.startedGames).forEach(game => {
            if (game.playersJoined.includes(user.player)) {
                return game;
            }
        });
        throw new Error(ErrorMsgs.PLAYER_NOT_IN_A_GAME)
    }

    addMessage(bearerToken: string | undefined, messageText: string, prevTimestamp: number): Command {
        let user = this.getUserByToken(bearerToken);
        let player = user.player;
        let game = this.getGameByPlayer(player);
        let message = new Message(messageText, player);
        this.startedGames[game.id].chat.messages.push(message); //TODO: make sure startedGames are in the same order?
        game.chat.messages.push(message);
        return this.commandManager.addChatCommand(game.id, message, prevTimestamp);
    }

    getMessagesAfter(bearerToken: string | undefined, prevTimestamp: number): Command[] {
        let user = this.getUserByToken(bearerToken);
        let player = user.player;
        let game = this.getGameByPlayer(player);
        return this.commandManager.getMessagesAfter(game.id, prevTimestamp);
    }

    getGameData(bearerToken: string | undefined, prevId: number) {
        let user = this.getUserByToken(bearerToken);
        let player = user.player;
        let game = this.getGameByPlayer(player);
        if (prevId == 0) {
            return this.initializeGame(game);
        }
        return this.commandManager.getGameplayAfter(game.id, prevId);
    }

    private initializeGame(game: Game): Command[] {
        let commands: Command[] = [];
        game.spread = new DrawSpread();

        commands.push(new Command("updateSpread", {
            spread: game.spread,
            deckNum: game.spread.busDeck.cards.length
        }));
        game.playersJoined.forEach( player => {
            
        });
        console.log(game.spread.getSpread);
        console.log(game.playersJoined);
        // commands.push(new Command("updatePlayers", {
        //     clientPlayer: player,
        //     otherPlayers: 
        // }));
        return commands;
    }

    private getUserByUsername(username: string): UserRegistration | null {
        for (let user of this.allUsers) {
            if (user.username === username) {
                return user;
            }
        }
        return null;
    }

    private getUserByToken(bearerToken: string | undefined): UserRegistration {
        if (!bearerToken) {
            throw new Error(ErrorMsgs.NO_AUTHORIZATION);
        }
        let token = this.extractToken(bearerToken);
        for (let user of this.loggedInUsers) {
            if (user.tokens.includes(token)) {
                return user;
            }
        }
        throw new Error(ErrorMsgs.INVALID_AUTHORIZATION);
    }

    private getUsernameByToken(bearerToken: string| undefined ): string {
        let name = this.getUserByToken(bearerToken).username
        return name;
    }

    private getGameByName(name: string): Game | null {
        for (let game of this.unstartedGames) {
            if (game.name == name) {
                return game;
            }
        }
        return null;
    }

    private getGameById(id: number): Game | null {
        for (let game of this.unstartedGames) {
            if (game.id == id) {
                return game;
            }
        }
        return null;
    }

    private getGameByPlayer(player: Player): Game {
        var foundGame = null;
        Object.values(this.startedGames).forEach(game => {
            for (let joinedPlayer of game.playersJoined) {
                if (joinedPlayer === player) {
                    foundGame = game;
                }
            }
        });
        if (foundGame) {
            return foundGame;
        }
        throw new Error(ErrorMsgs.PLAYER_NOT_IN_GAME);
    }

    private extractToken(bearerToken: string): string {
        let bearer = "Bearer: ";
        if (!bearerToken.startsWith(bearer)) {
            throw new Error(ErrorMsgs.INVALID_AUTHORIZATION);
        }
        return bearerToken.replace(bearer, "");
    }

    private isPlayerInAGame(player: Player): boolean {
        for (let game of this.unstartedGames) {
            if (game.playersJoined.includes(player)) {
                return true;
            }
        }
        return false;
    }
}