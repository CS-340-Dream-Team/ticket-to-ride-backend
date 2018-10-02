import { Game } from "../model/Game";
import { Player } from "./Player";
import hat from "hat";
import { UserRegistration } from "./UserRegistration";
import { Command } from "../commands/Command";

export class ServerModel {

    private static _instance : ServerModel;
    private activeGames: Game[];
    private players: Player[];
    private loggedInUsers: UserRegistration[];
    private allUsers: UserRegistration[];
    //error messages
    private readonly USER_DOES_NOT_EXIST = "User does not exist. Invalid login.";
    private readonly USERNAME_EXISTS = "Username already exists.";
    private readonly GAME_DOES_NOT_EXIST = "Game does not exist.";
    private readonly NO_AUTHORIZATION = "No authorization provided.";
    private readonly INVALID_AUTHORIZATION = "Invalid authorization.";
    private readonly PLAYER_ALREADY_IN_GAME = "Player already joined this game. Cannot join.";
    private readonly GAME_ALREADY_EXISTS = "Game with this name already exists.";
    

    private constructor() {
        if (ServerModel._instance) {
            throw new Error("Error: Instantiation failed");
        }
        ServerModel._instance = this;
        this.activeGames = [];
        this.players = [];
        this.loggedInUsers = [];
        this.allUsers = [];
    }

    public static getInstance(): ServerModel {
        if (ServerModel._instance === undefined) {
            ServerModel._instance = new ServerModel();
        }

        return ServerModel._instance;
    }

    login(username: string, password: string): string {
        var user = this.getUserByUsername(username);
        if (!user) {
            throw new Error(this.USER_DOES_NOT_EXIST);
        }
        this.loggedInUsers.push(user);
        let token = hat();
        user.tokens.push(token);
        return token;
    }

    register(username: string, password: string): string {
        var user = this.getUserByUsername(username);
        if (user) {
            throw new Error(this.USERNAME_EXISTS);
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
            throw new Error(this.GAME_DOES_NOT_EXIST);
        }
        let index = this.activeGames.indexOf(game);
        this.activeGames.splice(index, 1);
        return new Command("updateGameList", { gameList: this.activeGames });
    }

    joinGame(token: string | undefined, gameId: number): Command {
        let user = this.getUserByToken(token);
        let gameToJoin = this.getGameById(gameId);
        if (!gameToJoin) {
            throw new Error(this.GAME_DOES_NOT_EXIST);
        }
        if (gameToJoin.playersJoined.indexOf(user.player) === -1) {
            gameToJoin.playersJoined.push(user.player);
        } else {
            throw new Error(this.PLAYER_ALREADY_IN_GAME);
        }
        return new Command("updatePlayerList", { playerList: gameToJoin.playersJoined });
    }

    createGame(hostToken: string | undefined, gameName: string): Command {
        let hostUser = this.getUserByToken(hostToken);
        let game = this.getGameByName(gameName);
        if (game) {
            throw new Error(this.GAME_ALREADY_EXISTS);
        }
        this.activeGames.push(new Game(hostUser.player, gameName));
        return new Command("updateGameList", { gameList: this.activeGames });
    }

    getGamesList(token: string | undefined): Game[] {
        this.getUserByToken(token);
        return this.activeGames;
    }

    private getUserByUsername(username: string): UserRegistration | null {
        for (let user of this.allUsers) {
            if (user.username === username) {
                return user;
            }
        }
        return null;
    }

    private getUserByToken(token: string | undefined): UserRegistration {
        if (!token) {
            throw new Error(this.NO_AUTHORIZATION);
        }
        for (let user of this.loggedInUsers) {
            if (user.tokens.includes(token)) {
                return user;
            }
        }

        throw new Error(this.INVALID_AUTHORIZATION);
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
}