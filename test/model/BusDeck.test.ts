import { BusDeck } from "../../src/model/BusDeck";
import {BusCard} from "../../src/model/BusCard";
import {BusColor} from "../../src/model/BusColor"
test("constructor",()=>{
    let deck= new BusDeck();
    let count=[0,0,0,0,0,0,0,0,0];
    for(let x=0; x<110;x++){
        count[deck.cards[x].color]+=1;
    }
    let check=[12,12,12,12,12,12,12,12,14]
    expect(count).toEqual(check);
})
test("shuffle", ()=>{
    let deck = new BusDeck();
    let cards:BusCard[] =[]
    for(let numCards =0;numCards<12;numCards++)
       {
        cards.push(new BusCard(BusColor.black))
        cards.push(new BusCard(BusColor.blue))
        cards.push(new BusCard(BusColor.green))
        cards.push(new BusCard(BusColor.orange))
        cards.push(new BusCard(BusColor.purple))
        cards.push(new BusCard(BusColor.red))
        cards.push(new BusCard(BusColor.white))
        cards.push(new BusCard(BusColor.wild))
        cards.push(new BusCard(BusColor.yellow))
       }
       cards.push(new BusCard(BusColor.wild))
       cards.push(new BusCard(BusColor.wild))
       expect(deck).not.toEqual(cards);
})

test("drawCard",()=>{
    let deck= new BusDeck();
    deck.drawCard();
    expect(deck.cards.length).toEqual(109)
    deck.cards=[]
    //throw error for drawing card when there are none to draw
    
    deck.discard.push(new BusCard(BusColor.blue))
    deck.discard.push(new BusCard(BusColor.blue))
    deck.discard.push(new BusCard(BusColor.blue))
    deck.drawCard()
    expect(deck.cards.length).toEqual(2)
    expect(deck.cards[0]).toBeInstanceOf(BusCard)
    expect(deck.cards[1]).toBeInstanceOf(BusCard)
    expect(deck.discard.length).toEqual(0)
})
// test("discardCard", ()=>{
//     let deck = new BusDeck();
//     let card = deck.drawCard();
//     deck.discardCard(card);
//     expect(deck.discard.length).toEqual(1);
// })