import { CardList } from '../state/card-list';

/** One page of cards, and the totals of the whole collection. */
export interface CardsPage {
  readonly cards: CardList;
  readonly totalCount: number;
  readonly totalPages: number;
}

/**
 * The services the actions use. They are injected into the store (see `createDependencies`),
 * and the actions read them as `this.deps`. They return app state objects, never the raw
 * GraphQL or REST data, so the rest of the app doesn't know where the data comes from.
 */
export interface Dependencies {
  loadCards({ page }: { page: number }): Promise<CardsPage>;
}
