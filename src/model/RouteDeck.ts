import { RouteCard } from "./RouteCard";
import { ErrorMsgs } from "./ErrorMsgs";
import { Deck } from "./Deck";
import { Location } from "./Location";
import loadJSON from "../utils/jsonLoader";
//import json
//import from "../data/routes.json";
export class RouteDeck extends Deck {
	cards: RouteCard[];
	constructor() {
		super();
		this.cards = [];
		//load cards from json
		this.loadCards();
		this.shuffle();
	}
	loadCards() {
		try {
			type Route = {
				name: string;
				points: number;
				start: { name: string; latLong: { lat: number; long: number } };
				end: { name: string; latLong: { lat: number; long: number } };
			};

			let routes: Route[] = loadJSON("src/data/routes.json");

			routes.forEach(route => {
				let start = route.start;
				let end = route.end;
				let start_loc = new Location(start.name, start.latLong);
				let end_loc = new Location(end.name, end.latLong);
				this.cards.push(new RouteCard(route.name, route.points, start_loc, end_loc));
			});
		} catch (e) {
			console.log("Could not read data JSON. Check that the file exists at the expected path.");
		}
	}
	draw(): RouteCard[] {
		if (this.cards.length === 0) {
			throw new Error(ErrorMsgs.NOT_ENOUGH_CARDS);
		}
		let hand: RouteCard[] = [];
		for (let x = 0; x < 3; x++) {
			if (this.cards.length > 0) {
				let card = this.cards.pop();
				if (card) {
					hand.push(card);
				}
			}
		}
		return hand;
	}
	discard(cards: RouteCard[]) {
		cards.forEach(card => {
			this.cards.unshift(card);
		});
	}
	getNumCards(): number {
		return this.cards.length;
	}
}
