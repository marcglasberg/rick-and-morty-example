import { Card } from '../business/state/card';
import { CardList } from '../business/state/card-list';
import { State } from '../business/state/state';

describe('State.nextPage method', () => {

    test(`
    Given a state with an empty card list and totalPages set to 5.
    When nextPage() is called.
    Then it should return 1 (first page).
  `, () => {
        // Given a state with an empty card list
        const state = new State({
            cardList: CardList.empty,
            totalPages: 5
        });

        // When nextPage() is called
        const nextPage = state.nextPage();

        // Then it should return 1 (first page)
        expect(nextPage).toBe(1);
    });

    test(`
    Given a state with 20 cards and totalPages set to 5.
    When nextPage() is called.
    Then it should return 2 (second page).
  `, () => {    // Create a list with 20 cards (1 page worth of cards)
        const cards = Array.from({ length: 20 }, (_, i) =>
            new Card(`card-${i}`, `Card ${i}`, 'Alive', 'Human', 'Male', 'Earth', 'Earth', 3, 'https://example.com/image.jpg'));

        // Given a state with 20 cards
        const state = new State({
            cardList: new CardList(cards),
            totalPages: 5
        });

        // When nextPage() is called
        const nextPage = state.nextPage();

        // Then it should return 2 (second page)
        expect(nextPage).toBe(2);
    });

    test(`
    Given a state with 40 cards and totalPages set to 5.
    When nextPage() is called.
    Then it should return 3 (third page).
  `, () => {
        // Create a list with 40 cards (2 pages worth of cards)
        const cards = Array.from({ length: 40 }, (_, i) =>
            new Card(`card-${i}`, `Card ${i}`, 'Alive', 'Human', 'Male', 'Earth', 'Earth', 3, 'https://example.com/image.jpg'));

        // Given a state with 40 cards
        const state = new State({
            cardList: new CardList(cards),
            totalPages: 5
        });

        // When nextPage() is called
        const nextPage = state.nextPage();

        // Then it should return 3 (third page)
        expect(nextPage).toBe(3);
    });

    test(`
    Given a state with 100 cards (all 5 pages) and totalPages set to 5.
    When nextPage() is called.
    Then it should return null (no more pages).
  `, () => {    // Create a list with 100 cards (5 pages worth of cards)
        const cards = Array.from({ length: 100 }, (_, i) =>
            new Card(`card-${i}`, `Card ${i}`, 'Alive', 'Human', 'Male', 'Earth', 'Earth', 3, 'https://example.com/image.jpg'));

        // Given a state with 100 cards
        const state = new State({
            cardList: new CardList(cards),
            totalPages: 5
        });

        // When nextPage() is called
        const nextPage = state.nextPage();

        // Then it should return null (no more pages)
        expect(nextPage).toBeNull();
    });

    test(`
    Given a state with 110 cards (more than totalPages) and totalPages set to 5.
    When nextPage() is called.
    Then it should return null (no more pages).
  `, () => {    // Create a list with 110 cards (more than 5 pages worth of cards)
        const cards = Array.from({ length: 110 }, (_, i) =>
            new Card(`card-${i}`, `Card ${i}`, 'Alive', 'Human', 'Male', 'Earth', 'Earth', 3, 'https://example.com/image.jpg'));

        // Given a state with 110 cards
        const state = new State({
            cardList: new CardList(cards),
            totalPages: 5
        });

        // When nextPage() is called
        const nextPage = state.nextPage();

        // Then it should return null (no more pages)
        expect(nextPage).toBeNull();
    });

    test(`
    Given a state with 19 cards (less than a full page) and totalPages set to 5.
    When nextPage() is called.
    Then it should still return 1 (first page).
  `, () => {    // Create a list with 19 cards (less than 1 page worth of cards)
        const cards = Array.from({ length: 19 }, (_, i) =>
            new Card(`card-${i}`, `Card ${i}`, 'Alive', 'Human', 'Male', 'Earth', 'Earth', 3, 'https://example.com/image.jpg'));

        // Given a state with 19 cards
        const state = new State({
            cardList: new CardList(cards),
            totalPages: 5
        });

        // When nextPage() is called
        const nextPage = state.nextPage();

        // Then it should still return 1 (first page) because Math.floor(19/20) = 0
        expect(nextPage).toBe(1);
    });

    test(`
    Given a state with 0 totalPages.
    When nextPage() is called.
    Then it should return 1 (first page).
  `, () => {
        // Given a state with 0 totalPages
        const state = new State({
            cardList: CardList.empty,
            totalPages: 0
        });

        // When nextPage() is called
        const nextPage = state.nextPage();

        // Then it should return 1 (first page) since nextPage === 1 condition passes
        expect(nextPage).toBe(1);
    });

    test(`
    Given a state with 25 cards and totalPages set to 2 and totalCount set to 25.
    When nextPage() is called.
    Then it should return null (no more pages) because all cards have been fetched.
  `, () => {
        // Create a list with 25 cards (all cards in the database)
        const cards = Array.from({ length: 25 }, (_, i) =>
            new Card(`card-${i}`, `Card ${i}`, 'Alive', 'Human', 'Male', 'Earth', 'Earth', 3, 'https://example.com/image.jpg'));

        // Given a state with 25 cards, 2 pages, and totalCount of 25
        const state = new State({
            cardList: new CardList(cards),
            totalPages: 2,
            totalCount: 25
        });

        // When nextPage() is called
        const nextPage = state.nextPage();

        // Then it should return null (no more pages) because we've already fetched all cards
        expect(nextPage).toBeNull();
    });

});
