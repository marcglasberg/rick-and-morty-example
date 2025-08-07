import { Card } from "./card";

/** Represents a list of cards. */
export class CardList {
  constructor(public readonly items: Card[] = []) { }

  get length(): number {
    return this.items.length;
  }

  setCards(cards: Card[]): CardList {
    return new CardList(cards);
  }

  addCards(cardsList: CardList): CardList {
    return new CardList([...this.items, ...cardsList.items]);
  }

  find(id: string): Card | undefined {
    return this.items.find(card => card.id === id);
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this.items.length; i++) {
      yield this.items[i];
    }
  }

  static empty: CardList = new CardList();
}

