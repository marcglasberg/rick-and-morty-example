import { SimulatedDao } from '@/business/dao/simulated-dao';
import { createStore } from 'kiss-for-react';
import { FetchCards } from '../business/actions/fetch-cards-action';
import { setDao } from '../business/infra/action';
import { State } from '../business/state/state';

describe('FetchCards Action', () => {

  beforeEach(() => {
    setDao(new SimulatedDao());
  });

  test(`
    Given the cards have not been fetched yet.
    When the FetchCards action is dispatched.
    Then 20 cards (page 1) should be loaded from the DAO.
  `, async () => {

    const store = createStore<State>({
      initialState: State.initialState,
      logger: () => { },
      logStateChanges: false
    });

    // Given the cards have not been fetched yet.
    expect(store.state.cardList.items.length).toBe(0);
    expect(store.state.totalPages).toBe(0);
    expect(store.state.totalCount).toBe(0);

    // Next page is page-1 (the first one).
    expect(store.state.nextPage()).toBe(1);

    // When the FetchCards action is dispatched.
    await store.dispatchAndWait(new FetchCards());

    // Then the cards should be loaded from the DAO. 

    // 20 in the page.
    expect(store.state.cardList.items.length).toBe(20);

    // 2 pages in total.
    expect(store.state.totalPages).toBe(2);

    // 25 cards in total.
    expect(store.state.totalCount).toBe(25);

    // Next page is page-2.
    expect(store.state.nextPage()).toBe(2);

    expect(store.state.cardList.items[0].title).toBe('Rick Sanchez');
    expect(store.state.cardList.items[1].title).toBe('Morty Smith');
  });

  test(`
    Given the first page of cards has been loaded (20 cards total).
    When the FetchCards action is dispatched again.
    Then the second page should be loaded and added to the existing list (total 25 cards).
  `, async () => {

    // Create a store with the initial state
    const store = createStore<State>({
      initialState: State.initialState,
      logger: () => { },
      logStateChanges: false
    });

    // Given the first page of cards has been loaded (20 cards total)
    await store.dispatchAndWait(new FetchCards());

    // Verify that the first page was loaded correctly
    expect(store.state.cardList.items.length).toBe(20);
    expect(store.state.totalPages).toBe(2);
    expect(store.state.totalCount).toBe(25);    
    expect(store.state.nextPage()).toBe(2);

    // Capture the first card title for verification later
    const firstCardTitle = store.state.cardList.items[0].title;

    // When the FetchCards action is dispatched again
    await store.dispatchAndWait(new FetchCards());

    // Then the second page should be loaded and added to the existing list (total 25 cards)
    expect(store.state.cardList.items.length).toBe(25); // All 25 cards should now be loaded
    expect(store.state.totalPages).toBe(2);
    expect(store.state.totalCount).toBe(25);

    // There are no next pages.
    expect(store.state.nextPage()).toBe(null);

    // Verify that we have the first page cards still in the list
    expect(store.state.cardList.items[0].title).toBe(firstCardTitle);

    // And the last card from the simulated data should be present
    expect(store.state.cardList.items[24].title).toBe('Armothy');
  });

  test(`
    Given the first page of cards has been loaded (20 cards total).
    When the FetchCards action is dispatched again.
    Then the second page should be loaded and added to the existing list (total 25 cards).
  `, async () => {

    // Create a store with the initial state
    const store = createStore<State>({
      initialState: State.initialState,
      logger: () => { },
      logStateChanges: false
    });

    // Given the first page of cards has been loaded (20 cards total)
    await store.dispatchAndWait(new FetchCards());

    // Verify that the first page was loaded correctly
    expect(store.state.cardList.items.length).toBe(20);
    expect(store.state.totalPages).toBe(2);
    expect(store.state.totalCount).toBe(25);    
    expect(store.state.nextPage()).toBe(2);

    // Capture the first card title for verification later
    const firstCardTitle = store.state.cardList.items[0].title;

    // When the FetchCards action is dispatched again
    await store.dispatchAndWait(new FetchCards());

    // Then the second page should be loaded and added to the existing list (total 25 cards)
    expect(store.state.cardList.items.length).toBe(25); // All 25 cards should now be loaded
    expect(store.state.totalPages).toBe(2);
    expect(store.state.totalCount).toBe(25);    
    expect(store.state.nextPage()).toBe(null);

    // Verify that we have the first page cards still in the list
    expect(store.state.cardList.items[0].title).toBe(firstCardTitle);

    // And the last card from the simulated data should be present
    expect(store.state.cardList.items[24].title).toBe('Armothy');
  });

  test(`
    Given all pages have been fetched.
    When the FetchCards action is dispatched again.
    Then no more cards should be loaded.
  `, async () => {

    // Create a store with initial state
    const store = createStore<State>({
      initialState: State.initialState,
      logger: () => { },
      logStateChanges: false
    });

    // First, fetch page 1
    await store.dispatchAndWait(new FetchCards());
    expect(store.state.cardList.items.length).toBe(20);

    // Then fetch page 2 (all remaining cards)
    await store.dispatchAndWait(new FetchCards());
    expect(store.state.cardList.items.length).toBe(25);

    // Given all pages have been fetched (we now have 25 cards and 2 pages)
    expect(store.state.totalCount).toBe(25);
    expect(store.state.totalPages).toBe(2);

    // Save the current number of cards
    const currentCardCount = store.state.cardList.items.length;

    // When the FetchCards action is dispatched again
    // It should detect we have all pages and not fetch more
    await store.dispatchAndWait(new FetchCards());

    // Then no more cards should be loaded
    expect(store.state.cardList.items.length).toBe(currentCardCount);
  });
});

