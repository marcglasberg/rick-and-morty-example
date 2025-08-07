import { Action } from '../infra/action';

export class ToggleLike extends Action {
    constructor(public cardId: string) {
        super();
    }

    reduce() {
        let newLikedCards
            = this.state.likedCards.toggleCard(this.cardId);

        return this.state.withLikedCards(newLikedCards);
    }
}
