import { BusCard } from "./BusCard";
import { Game } from "./Game";
import { BusDeck } from "./BusDeck";
import { ErrorMsgs } from "./ErrorMsgs";
import { BusColor } from "./BusColor";

export class DrawSpread {
	spread: BusCard[];
	busDeck: BusDeck;

	constructor() {
		this.busDeck = new BusDeck();
		this.spread = this.busDeck.cards.slice(0, 5);
		this.busDeck.cards.splice(0, 5);
		this.checkForThreeWilds();
	}

	getSpread(): BusCard[] {
		return this.spread;
	}

	private hasThreeWilds(): boolean {
		let count = 0;
		this.spread.forEach(card => {
			if (card.color === BusColor.wild) {
				count++;
			}
		});
		if (count >= 3) {
			return true;
		}
		return false;
	}

	private hasAllWilds() {
		let allWilds = true;
		this.spread.forEach(card => {
			if (card.color !== BusColor.wild) {
				allWilds = false;
			}
		});
		return allWilds;
	}

	getBusDeckCount(): number {
		return this.busDeck.cards.length;
	}

	drawFour(): BusCard[] {
		let cards = [];
		for (let i = 0; i < 4; i++) {
			let card = this.busDeck.drawCard(false);
			if (card) {
				cards.push(card);
			}
		}
		return cards;
	}

	drawCard(index: number) {
		if (index >= 0 && index <= 4) {
			let card = this.spread[index];
			if (this.busDeck.deckEmpty() && this.busDeck.discardEmpty()) {
				this.spread.splice(index, 1);
			} else {
				if (this.busDeck.deckEmpty()) {
					this.busDeck.shuffleDiscardIntoDeck();
				}
				this.spread[index] = this.busDeck.drawCard(true);
				this.checkForThreeWilds();
			}
			return card;
		} else if (index == 5) {
			return this.busDeck.drawCard(false);
		} else {
			throw new Error(ErrorMsgs.INVALID_BUS_CARD_INDEX);
		}
	}

	private checkForThreeWilds() {
		while (this.hasThreeWilds() && (this.hasReplacements() || this.spread.length < 5)) {
			this.spread.forEach(oldCard => {
				this.busDeck.discardCard(oldCard);
			});
			this.replaceSpread();
		}
		if (this.hasAllWilds()) {
			let randomColor = Math.floor(Math.random() * 8);
			this.spread[0] = new BusCard(randomColor);
		}
	}

	private replaceCard(index: number, oldCard: BusCard) {
		let card = this.spread[index];
		this.busDeck.cards.unshift(card);
		this.spread[index] = oldCard;
	}

	private replaceSpread() {
		for (let i = 0; i < 5; i++) {
			if (!this.busDeck.deckEmpty() || !this.busDeck.discardEmpty()) {
				this.spread[i] = this.busDeck.drawCard(true);
			}
		}
	}

	private hasReplacements() {
		let nonWilds = 0;
		this.busDeck.cards.forEach(card => {
			if (card.color !== BusColor.wild) {
				nonWilds++;
			}
		});
		this.busDeck.discard.forEach(card => {
			if (card.color !== BusColor.wild) {
				nonWilds++;
			}
		});
		if (nonWilds > 0) {
			return true;
		}
		return false;
	}
}
