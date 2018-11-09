import { Game } from "./Game";
import { Player } from "./Player";
import { UserRegistration } from "./UserRegistration";
import { Command } from "../commands/Command";
import {ErrorMsgs} from "./ErrorMsgs"
import { CommandManager } from "../commands/CommandManager";
import { Message } from "./Message";
import {GameState} from "./GameState"
import hat from "hat";
import { BusDeck } from "./BusDeck";
import { DrawSpread } from "./DrawSpread";
import { GameCommand } from "../commands/GameCommand";
import { RouteCard } from "./RouteCard";
import { ICommand } from "../commands/ICommand";
import { BusCard } from "./BusCard";

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
        let game = this.getGameById(gameId);
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
        game.playersJoined.forEach(player => {
			if(game)
			{
				player.routeCardBuffer=game.drawRoutes();
				this.commandManager.addCommand(game.id,"drawRoutes",game.routeDeck.getNumCards(),player.routeCardBuffer,player.name);
			}
			
		});
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
    drawRoutes(bearerToken:string|undefined):GameCommand{
        let game=this.getGameByToken(bearerToken)
        let user= this.getUserByToken(bearerToken)
        let player=user.player;
        if(game===undefined)
        {
            throw new Error("Game is undefined")
        }
        let hand=game.drawRoutes()
        player.routeCardBuffer=hand
        let command=this.commandManager.addCommand(game.id,"drawRoutes",game.routeDeck.getNumCards(),hand, player.name);
        return command;
    }
    discardRoutes(bearerToken: string | undefined, routeCards: RouteCard[]): GameCommand {
        let game=this.getGameByToken(bearerToken)
        let user= this.getUserByToken(bearerToken)
        let player=user.player;
        if(game===undefined)
        {
            throw new Error("Game is undefined")
        }
        routeCards.forEach(card => {
            for(let i=0;i<0;i++){
                if(card.name===player.routeCardBuffer[i].name){
                    player.routeCardBuffer.splice(i,1)
                }
            }  
        });
        player.routeCards.push(...player.routeCardBuffer)
        let publicData={numCardsKept:player.routeCardBuffer.length}
        let privateData={cardsKept:player.routeCardBuffer}
        player.routeCardBuffer=[]
        game.routeDeck.discard(routeCards)
        
        
        let command=this.commandManager.addCommand(game.id,"discardRoutes",publicData,privateData,player.name)
        return command;
    }
    
    getSpread(bearerToken: string):Command{
        let game= this.getGameByToken(bearerToken);
        if(!game)
        {
            throw new Error(ErrorMsgs.GAME_DOES_NOT_EXIST)
        }
        return new Command("updateSpread", {
            spread: game.spread.getSpread(),
            deckSize: game.spread.getBusDeckCount()
        });
    }
    private getGameByToken(bearerToken: string|undefined):Game|undefined{
        let user=this.getUserByToken(bearerToken)
        let returnGame = null;
        Object.values(this.startedGames).forEach(game => {
            game.playersJoined.forEach(player => {
                if (player.name === user.player.name) {
                    returnGame = game;
                }
            });
        });
        if (returnGame != null) {
            return returnGame;
        }
        else {
            throw new Error(ErrorMsgs.PLAYER_NOT_IN_A_GAME)
        }
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

    getGameData(bearerToken: string | undefined, prevId: string):ICommand[]{
        let user = this.getUserByToken(bearerToken);
        let player = user.player;
        let game = this.getGameByPlayer(player);
        var opponentName;
        game.playersJoined.forEach( gamePlayer => {
            if (gamePlayer.name != player.name) {
                opponentName = gamePlayer.name;
            }
        })
        return [
                new Command("updatePlayers", {
                    players: [
                        {
                            name: player.name,
                            color: 1,
                            points: 0,
                            busPieces: 45,
                            busCards: [
                                {
                                    color: 0
                                } as BusCard,
                                {
                                    color: 1
                                } as BusCard,
                                {
                                    color: 2
                                } as BusCard,
                                {
                                    color: 3
                                } as BusCard
                            ],
                            routeCards: []
                        },
                        {
                            name: opponentName,
                            color: 2,
                            points: 0,
                            busPieces: 45,
                            busCards: 4,
                            routeCards: 0
                        },
                    ]
                }),
            ]
        // let gameState=new GameState(game,player.name)
        // let commands=[]
        // let updateClient=new Command("updatePlayers",gameState.playerStates)
        // let commandUpdates=this.commandManager.getGameplayAfter(game.id, +prevId, player.name);
        // if (prevId === '-1') {
        //     commands.push(new Command("updateClientPlayer", {clientPlayer: player}))
        // }
        // commands.push(updateClient);
        // commands.push(...commandUpdates)  
        // return commands;  
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