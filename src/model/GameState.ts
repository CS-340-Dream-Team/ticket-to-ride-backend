import { Game } from "./Game";
import { PlayerState } from "./PlayerState";
export class GameState {
	busDeckCount: number;
	routeDeckCount: number;
	playerStates: PlayerState[];
	constructor(game: Game, name: string) {
		this.busDeckCount = game.spread.getBusDeckCount();
		this.routeDeckCount = game.routeDeck.cards.length;
		this.playerStates = [];
		game.playersJoined.forEach(player => {
			let myPlayer = new PlayerState(player);
			if (player.name === name) {
				myPlayer.routeCards = player.routeCards;
				myPlayer.busCards = player.busCards;
			}
			this.playerStates.push(myPlayer);
		});
	}
}
