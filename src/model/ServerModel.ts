import { Game } from "../model/Game";
import { Player } from "./Player";
import hat from "hat";
import { UserRegistration } from "./UserRegistration";
import { Command } from "../commands/Command";
import {ErrorMsgs} from "./ErrorMsgs"
import { hostname, userInfo } from "os";
export class ServerModel {

    private static _instance : ServerModel;
    private activeGames: Game[];
    private players: Player[];
    private loggedInUsers: UserRegistration[];
    private allUsers: UserRegistration[];
    private unstartedGameLimit: number;
    private constructor() {
        if (ServerModel._instance) {
            throw new Error("Error: Instantiation failed");
        }
        ServerModel._instance = this;
        this.activeGames = [];
        this.players = [];
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
        let index = this.activeGames.indexOf(game);
        this.activeGames.splice(index, 1);
        return new Command("updateGameList", { gameList: this.activeGames });
    }

    joinGame(bearerToken: string | undefined, gameId: number): Command {
        let user = this.getUserByToken(bearerToken);
        let gameToJoin = this.getGameById(gameId);
        if (!gameToJoin) {
            throw new Error(ErrorMsgs.GAME_DOES_NOT_EXIST);
        }
        if (gameToJoin.playersJoined.indexOf(user.player) === -1) {
            gameToJoin.addPlayer(user.player);
        } else {
            throw new Error(ErrorMsgs.PLAYER_ALREADY_IN_GAME);
        }
        return new Command("updatePlayerList", { playerList: gameToJoin.playersJoined });
    }

    createGame(bearerToken: string | undefined, gameName: string): Command {
        let hostUser = this.getUserByToken(bearerToken);
        let game = this.getGameByName(gameName);
        if (game) {
            throw new Error(ErrorMsgs.GAME_ALREADY_EXISTS);
        }
        if (this.getNumUnstartedGames()+1>this.unstartedGameLimit){
            //403
            throw new Error(ErrorMsgs.UNSTARTED_LIMIT);
        }
        if (gameName==="")
        {
            throw new Error(ErrorMsgs.GAMENAME_UNDEFINED);
        }
        this.activeGames.push(new Game(hostUser.player, gameName));
        return new Command("updateGameList", { gameList: this.activeGames });
    }
    startGame(bearerToken:string| undefined, gameId:number):Command{
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
        //TODO update later
        return new Command("startGame",{})
    }
    getGameList(bearerToken: string | undefined): Command {
        this.getUserByToken(bearerToken);
        return new Command("updateGameList", { gameList: this.activeGames });
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
    private getUsernameByToken(bearerToken: string|undefined):string{
        let name = this.getUserByToken(bearerToken).username
        return name;
    }
    private getGameByName(name: string): Game | null {
        for (let game of this.activeGames) {
            if (game.name == name) {
                return game;
            }
        }
        return null;
    }

    private getGameById(id: number): Game | null {
        for (let game of this.activeGames) {
            if (game.id == id) {
                return game;
            }
        }
        return null;
    }

    private extractToken(bearerToken: string): string {
        let bearer = "Bearer: ";
        if (!bearerToken.startsWith(bearer)) {
            throw new Error(ErrorMsgs.INVALID_AUTHORIZATION);
        }
        return bearerToken.replace(bearer, "");
    }
    private getNumUnstartedGames():number{
        let unstartedGames=0;
        this.activeGames.forEach(game => {
            if(game.started===false)
                unstartedGames++;
        });
        return unstartedGames;
    }
}