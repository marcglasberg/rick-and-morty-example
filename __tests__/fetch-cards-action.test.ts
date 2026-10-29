import { createStore } from 'kiss-for-react';
import { FetchCards } from '../business/actions/fetch-cards-action';
import { CardsPage, Dependencies } from '../business/dependencies/dependencies';
import { SimulatedDependencies } from '../business/dependencies/simulated-dependencies';
import { Environment } from '../business/infra/environment';
import { State } from '../business/state/state';
import { disposeAfterTest, disposeTestStores } from '../test-utils/dispose-after-test';

afterEach(disposeTestStores);

/** Each test creates its own store, with its own dependencies. Nothing global to reset. */
function createTestStore(dependencies: Dependencies = new SimulatedDependencies()) {
  return disposeAfterTest(createStore<State>({
    initialState: State.initialState,
    environment: Environment.testing,
    dependencies: () => dependencies,
    logger: () => { },
    logStateChanges: false,
  }));
}

describe('FetchCards Action', () => {

  test(`
    Given the cards have not been fetched yet.
    When the FetchCards action is dispatched.
    Then 20 cards (page 1) should be loaded from the dependencies.
  `, async () => {

    const store = createTestStore();

    // Given the cards have not been fetched yet.
    expect(store.state.cardList.items.length).toBe(0);
    expect(store.state.totalPages).toBe(0);
    expect(store.state.totalCount).toBe(0);

    // Next page is page-1 (the first one).
    expect(store.state.nextPage()).toBe(1);

    // When the FetchCards action is dispatched.
    await store.dispatchAndWait(new FetchCards());

    // Then the cards should be loaded from the dependencies.

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

    const store = createTestStore();

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
    Given all pages have been fetched.
    When the FetchCards action is dispatched again.
    Then no more cards should be loaded.
  `, async () => {

    const store = createTestStore();

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

  test(`
    Given a store with fake dependencies that record the requested pages.
    When the FetchCards action is dispatched twice.
    Then the dependencies are asked for page 1, and then for page 2.
  `, async () => {

    // A fake made just for this test: the simulated cards, recording the requested pages.
    class RecordingDependencies extends SimulatedDependencies {
      readonly requestedPages: number[] = [];

      async loadCards({ page }: { page: number }): Promise<CardsPage> {
        this.requestedPages.push(page);
        return super.loadCards({ page });
      }
    }

    const dependencies = new RecordingDependencies();
    const store = createTestStore(dependencies);

    // When the FetchCards action is dispatched twice.
    await store.dispatchAndWait(new FetchCards());
    await store.dispatchAndWait(new FetchCards());

    // Then the dependencies are asked for page 1, and then for page 2.
    expect(dependencies.requestedPages).toEqual([1, 2]);
  });
});
