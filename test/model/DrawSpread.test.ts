import { BusDeck } from "../../src/model/BusDeck";
import {BusCard} from "../../src/model/BusCard";
import {BusColor} from "../../src/model/BusColor"
import { DrawSpread } from "../../src/model/DrawSpread";

test("draw card to replace spread", ()=> {
    let spread = new DrawSpread();
    let deck = spread.busDeck;
    spread.spread = [
        new BusCard(BusColor.black),
        new BusCard(BusColor.black),
        new BusCard(BusColor.black),
        new BusCard(BusColor.wild),
        new BusCard(BusColor.wild),
    ];
    deck.cards = [
        new BusCard(BusColor.blue),
        new BusCard(BusColor.blue),
        new BusCard(BusColor.blue),
        new BusCard(BusColor.blue),
        new BusCard(BusColor.blue),
        new BusCard(BusColor.wild),
    ];
    spread.drawCard(0);
    expect(spread.spread).toEqual([
        new BusCard(BusColor.blue),
        new BusCard(BusColor.blue),
        new BusCard(BusColor.blue),
        new BusCard(BusColor.blue),
        new BusCard(BusColor.blue),
    ])
}) 

test("draw card to replace spread with empty deck and discard", ()=> {
    let spread = new DrawSpread();
    let deck = spread.busDeck;
    spread.spread = [
        new BusCard(BusColor.black),
        new BusCard(BusColor.black),
        new BusCard(BusColor.black),
        new BusCard(BusColor.wild),
        new BusCard(BusColor.wild),
    ];
    deck.cards = [new BusCard(BusColor.wild)];
    deck.discard = [];
    spread.drawCard(0);
    spread.spread.sort((a, b) => a.color - b.color);
    expect(spread.spread).toEqual([
        new BusCard(BusColor.black),
        new BusCard(BusColor.black),
        new BusCard(BusColor.wild),
        new BusCard(BusColor.wild),
        new BusCard(BusColor.wild),
    ])
})

test("draw card to replace spread with empty deck 1 in the discard", ()=> {
    let spread = new DrawSpread();
    let deck = spread.busDeck;
    spread.spread = [
        new BusCard(BusColor.black),
        new BusCard(BusColor.black),
        new BusCard(BusColor.black),
        new BusCard(BusColor.wild),
        new BusCard(BusColor.wild),
    ];
    deck.cards = [new BusCard(BusColor.wild)];
    deck.discard = [
        new BusCard(BusColor.blue)
    ];
    spread.drawCard(0);
    spread.spread.sort((a, b) => a.color - b.color);
    expect(spread.spread).toEqual([
        new BusCard(BusColor.blue),
        new BusCard(BusColor.black),
        new BusCard(BusColor.black),
        new BusCard(BusColor.wild),
        new BusCard(BusColor.wild),
    ])
})

test("draw card to replace spread with 3 in spread, 0 in deck, 3 in discard", ()=> {
    let spread = new DrawSpread();
    let deck = spread.busDeck;
    spread.spread = [
        new BusCard(BusColor.black),
        new BusCard(BusColor.wild),
        new BusCard(BusColor.wild),
    ];
    deck.cards = [new BusCard(BusColor.wild)];
    deck.discard = [
        new BusCard(BusColor.blue),
        new BusCard(BusColor.blue),
        new BusCard(BusColor.blue),
    ];
    spread.drawCard(0);
    spread.spread.sort((a, b) => a.color - b.color);
    expect(spread.spread).toEqual([
        new BusCard(BusColor.blue),
        new BusCard(BusColor.blue),
        new BusCard(BusColor.blue),
        new BusCard(BusColor.wild),
        new BusCard(BusColor.wild),
    ])
})

test("draw card to replace spread with 3 in spread and only wilds left after", ()=> {
    let spread = new DrawSpread();
    let deck = spread.busDeck;
    spread.spread = [
        new BusCard(BusColor.black),
        new BusCard(BusColor.wild),
        new BusCard(BusColor.wild),
    ];
    deck.cards = [
        new BusCard(BusColor.wild),
        new BusCard(BusColor.wild),
        new BusCard(BusColor.wild),
    ];
    deck.discard = [
        // new BusCard(BusColor.wild),
        // new BusCard(BusColor.wild),
        // new BusCard(BusColor.wild),
    ];
    spread.drawCard(0);
    spread.spread.sort((a, b) => a.color - b.color);
    expect(spread.spread).not.toEqual([
        new BusCard(BusColor.wild),
        new BusCard(BusColor.wild),
        new BusCard(BusColor.wild),
        new BusCard(BusColor.wild),
        new BusCard(BusColor.wild),
    ])
})

test("discardCard", ()=>{
    let spread = new DrawSpread();
    let deck = spread.busDeck;
    let card = deck.drawCard(false);
    deck.discardCard(card);
    expect(deck.discard.length).toEqual(1);
})
