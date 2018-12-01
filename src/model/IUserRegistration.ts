import { Player } from "./Player";

export interface IUserRegistration {
	password: string;
	tokens: string[];
	username: string;
	player: Player;
}
