import { BusCard } from "./BusCard";
import { BusColor } from "./BusColor";
import { ErrorMsgs } from "./ErrorMsgs";
import { Deck } from "./Deck";

export class BusDeck extends Deck {
	cards: BusCard[];
	discard: BusCard[];
	constructor(cards:BusCard[]=[],discard:BusCard[]=[],fromDB=false) {
		super();
		this.cards = cards;
		this.discard = discard;
		if(!fromDB){
			for (let numCards = 0; numCards < 12; numCards++) {
				this.cards.push(new BusCard(BusColor.black));
				this.cards.push(new BusCard(BusColor.blue));
				this.cards.push(new BusCard(BusColor.green));
				this.cards.push(new BusCard(BusColor.orange));
				this.cards.push(new BusCard(BusColor.purple));
				this.cards.push(new BusCard(BusColor.red));
				this.cards.push(new BusCard(BusColor.white));
				this.cards.push(new BusCard(BusColor.wild));
				this.cards.push(new BusCard(BusColor.yellow));
			}
			this.cards.push(new BusCard(BusColor.wild));
			this.cards.push(new BusCard(BusColor.wild));
			this.shuffle();
		}
	}

	drawCard(fromSpread: boolean): BusCard {
		if (this.deckEmpty() && fromSpread) {
			this.shuffleDiscardIntoDeck();
		} else if (this.deckEmpty() && !fromSpread) {
			if (this.discardEmpty()) {
				throw new Error(ErrorMsgs.NOT_ENOUGH_CARDS);
			} else {
				this.shuffleDiscardIntoDeck();
			}
		}
		return this.cards.pop() as BusCard;
	}

	discardCard(card: BusCard): void {
		this.discard.push(card);
	}

	shuffleDiscardIntoDeck() {
		this.discard.forEach(card => {
			this.cards.push(card);
		});
		this.discard = [];
		this.shuffle();
	}

	deckEmpty() {
		return this.cards.length === 0;
	}

	discardEmpty() {
		return this.discard.length === 0;
	}
}
