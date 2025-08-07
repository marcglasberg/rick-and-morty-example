import { Action, DAO } from '../infra/action';
import { State } from '../state/state';

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

        let nextPage = this.state.nextPage();

        // No more pages to fetch.
        if (nextPage == null) {
            return null;
        }
        //
        else {
            // Delay just so we can see the loading spinner (remove in production).            
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Fetch the next page of cards.
            console.log('Fetching page:', nextPage);
            const { cards, totalCount, totalPages } = await DAO.loadCards({ page: nextPage });

            // Add the newly fetched cards to the existing card list.
            let allCards = this.state.cardList.addCards(cards);

            return (state: State) => this.state.copy({
                cardList: allCards,
                totalCount: totalCount,
                totalPages: totalPages,
            }
            );
        }
    }
}