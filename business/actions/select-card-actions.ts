import { Action } from '../infra/action';

export class SelectCard extends Action {
    constructor(public cardId: string) {
        super();
    }

    reduce() {
        return this.state.withSelectedCardId(this.cardId);
    }
}