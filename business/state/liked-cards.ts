
/**
 * Immutable class that holds a list of card IDs that are liked.
 * 
 * Note: Liked cards may not currently exist in the card list, because cards are
 * fetched everytime the app reopens. In other words, the liked cards list is 
 * independent of the card list.
 */
export class LikedCards {
  constructor(public readonly ids: number[] = []) { }

  /** Checks if a card is liked (its ID is in the liked cards list). */
  isCardLiked(id: string | number): boolean {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    return this.ids.includes(numericId);
  }

  /** Adds a card ID to the liked cards list. */
  addCard(id: string | number): LikedCards {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    // If the card is already liked, return the same list
    if (this.isCardLiked(numericId)) {
      return this;
    }

    // Otherwise add the card ID to the list
    return new LikedCards([...this.ids, numericId]);
  }

  /** Removes a card ID from the liked cards list. */
  removeCard(id: string | number): LikedCards {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    // If the card is not liked, return the same list
    if (!this.isCardLiked(numericId)) {
      return this;
    }

    // Otherwise remove the card ID from the list
    return new LikedCards(this.ids.filter(cardId => cardId !== numericId));
  }

  /**
   * Toggles a card's liked status.
   * If the card is already liked, it will be removed.
   * If the card is not liked, it will be added.
   */
  toggleCard(id: string | number): LikedCards {
    return this.isCardLiked(id) ? this.removeCard(id) : this.addCard(id);
  }

  static empty: LikedCards = new LikedCards();
}
