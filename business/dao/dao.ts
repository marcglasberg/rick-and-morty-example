import { CardList } from '../state/card-list';

export abstract class Dao {
    abstract loadCards({ page }: { page: number }): Promise<{ cards: CardList, totalCount: number, totalPages: number }>;
}