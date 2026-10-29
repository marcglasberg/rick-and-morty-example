import { Store } from 'kiss-for-react';

const stores: Store<unknown>[] = [];

/** Marks the store to be disposed by `disposeTestStores`, at the end of the test. */
export function disposeAfterTest<St>(store: Store<St>): Store<St> {
  stores.push(store as Store<unknown>);
  return store;
}

/** Disposes the stores of the test. Use it as `afterEach(disposeTestStores)`. */
export async function disposeTestStores(): Promise<void> {
  await Promise.all(stores.splice(0).map((store) => store.dispose()));
}
