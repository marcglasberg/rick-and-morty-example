import { Action } from '../infra/action';
import { State } from '../state/state';

/** Loads the next page of cards, and adds it to the end of the card list. */
export class FetchCards extends Action {

    nonReentrant = true;

    // Default values:
    // - initialDelay: 350 milliseconds
    // - multiplier: 2 (the default delays are: 350 millis, 700 millis, and 1.4 seg)
    // - maxRetries: 3 (will try a total of 4 times)
    // - maxDelay: 5 seconds
    retry = { on: true }

    checkInternet = { dialog: true }

    async reduce() {
        const nextPage = this.state.nextPage();

        // No more pages to fetch.
        if (nextPage === null) return null;

        // Delay just so we can see the loading spinner (remove in production).
        await new Promise(resolve => setTimeout(resolve, 200));

        const { cards, totalCount, totalPages } = await this.deps.loadCards({ page: nextPage });

        return (state: State) => state.copy({
            cardList: state.cardList.addCards(cards),
            totalCount,
            totalPages,
        });
    }
}
