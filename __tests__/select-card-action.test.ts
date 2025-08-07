import { createStore } from 'kiss-for-react';
import { SelectCard } from '../business/actions/select-card-actions';
import { State } from '../business/state/state';

describe('SelectCard Action', () => {

  test(`
    Given no card is selected.
    When we select a card with id "123".
    Then card "123" is selected.
  `, async () => {
    
    const store = createStore<State>({
      initialState: State.initialState,
      logger: () => { }, 
      logStateChanges: false
    });    

    // Given no card is selected.
    expect(store.state.selectedCardId).toBeNull();

    // When we select a card with id "123".
    await store.dispatchAndWait(new SelectCard('123'));

    // Then card "123" is selected.
    expect(store.state.selectedCardId).toBe('123');
  });

  test(`                                             
    Given card "123" is selected.
    When we select a card with id "456".
    Then card "456" is selected.
  `, async () => {
    
    const initialState = new State({ selectedCardId: '123' });
    const store = createStore<State>({
      initialState,
      logger: () => { }, 
      logStateChanges: false
    });    

    // Given card "123" is selected.
    expect(store.state.selectedCardId).toBe('123');

    // When we select a card with id "456".
    await store.dispatchAndWait(new SelectCard('456'));

    // Then card "456" is selected.
    expect(store.state.selectedCardId).toBe('456');
  });
});
