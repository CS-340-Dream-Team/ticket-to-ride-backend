import { Player } from "./Player";

export class Message {
	messageText: string;
	timestamp: number;
	sender: Player;

	constructor(text: string, sender: Player) {
		this.messageText = text;
		this.timestamp = new Date().getTime();
		this.sender = sender;
	}
}
