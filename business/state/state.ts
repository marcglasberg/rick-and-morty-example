import { CardList } from "./card-list";
import { LikedCards } from "./liked-cards";

export class State {
  
  cardList: CardList; // List of cards of type `Card`
  selectedCardId: string | null; // Last card we tapped to view details
  totalCount: number; // Total number of cards
  totalPages: number; // Total number of pages of 20 cards each
  likedCards: LikedCards; // List of the IDs of liked cards 
  colorScheme: 'light' | 'dark' | null;

  constructor({
    cardList = CardList.empty,
    selectedCardId = null,
    totalCount = 0,
    totalPages = 0,
    likedCards = LikedCards.empty,
    colorScheme = null
  }: {
    cardList?: CardList,
    selectedCardId?: string | null,
    totalCount?: number,
    totalPages?: number,
    likedCards?: LikedCards,
    colorScheme?: 'light' | 'dark' | null
  } = {}) {
    this.cardList = cardList;
    this.selectedCardId = selectedCardId;
    this.totalCount = totalCount;
    this.totalPages = totalPages;
    this.likedCards = likedCards;
    this.colorScheme = colorScheme;
  }

  static initialState: State = new State();

  /*
  * The next page to fetch based on the current number of cards and total count.
  * If there are no more pages to fetch, return `null`.
  **/
  nextPage(): number | null {
    // Rick and Morty API has a limit of 20 cards per page.
    const apiPageSize = 20;

    let previousNumbOfCards = this.cardList.length;
    let pagesAlreadyFetched = Math.floor(previousNumbOfCards / apiPageSize);
    let nextPage = pagesAlreadyFetched + 1;

    // If we have already fetched all cards (based on totalCount), return null.
    if (previousNumbOfCards >= this.totalCount && this.totalCount > 0) {
      return null;
    }

    // If there are more pages to fetch, return the next page.
    if ((nextPage === 1) || (nextPage <= this.totalPages)) {
      return pagesAlreadyFetched + 1;
    }
    else {
      return null;
    }
  }

  withCardList(cardList: CardList): State {
    return this.copy({ cardList });
  }

  withSelectedCardId(selectedCardId: string): State {
    return this.copy({ selectedCardId });
  }

  withColorScheme(colorScheme: 'light' | 'dark'): State {
    return this.copy({ colorScheme });
  }

  withLikedCards(likedCards: LikedCards): State {
    return this.copy({ likedCards });
  }



  copy({
    cardList,
    selectedCardId,
    totalCount,
    totalPages,
    likedCards,
    colorScheme
  }: {
    cardList?: CardList,
    selectedCardId?: string | null,
    totalCount?: number,
    totalPages?: number,
    likedCards?: LikedCards,
    colorScheme?: 'light' | 'dark' | null
  } = {}): State {
    return new State({
      cardList: cardList ?? this.cardList,
      selectedCardId: selectedCardId ?? this.selectedCardId,
      totalCount: totalCount ?? this.totalCount,
      totalPages: totalPages ?? this.totalPages,
      likedCards: likedCards ?? this.likedCards,
      colorScheme: colorScheme ?? this.colorScheme
    });
  }

}
