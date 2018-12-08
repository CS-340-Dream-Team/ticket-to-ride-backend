import { IUserRegistration } from "./IUserRegistration";
import { Player } from "./Player";
import { PlayerColor } from "./PlayerColor";

export class UserRegistration implements IUserRegistration {
	username: string;
	password: string;
	tokens: string[];
	player: Player;

	constructor(username: string, password: string, token: string) {
		this.password = password;
		this.tokens = [];
		this.tokens.push(token);
		this.username = username;
		this.player = new Player(username, PlayerColor.None);
	}
}

export interface UserDto {
	username: string;
	password: string;
}

export interface SessionDto {
	username: string;
	token: string;
}