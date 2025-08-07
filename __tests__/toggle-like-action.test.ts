import { createStore } from 'kiss-for-react';
import { ToggleLike } from '../business/actions/toggle-like-action';
import { LikedCards } from '../business/state/liked-cards';
import { State } from '../business/state/state';

describe('ToggleLike Action', () => {

  test(`
    Given card "123" is not in the liked cards list.
    When we toggle like/unlike card "123".
    Then card "123" should be added to the liked cards list.
  `, async () => {

    const store = createStore<State>({
      initialState: State.initialState,
      logger: () => { }, // Empty function as logger
      logStateChanges: false
    });    

    // Given card "123" is not in the liked cards list.
    expect(store.state.likedCards.isCardLiked('123')).toBe(false);

    // When we toggle like/unlike card "123".
    await store.dispatchAndWait(new ToggleLike('123'));

    // Then card "123" should be added to the liked cards list.
    expect(store.state.likedCards.isCardLiked('123')).toBe(true);
  });

  test(`
    Given card "123" is in the liked cards list.
    When we toggle like/unlike card "123".
    Then card "123" should be removed from the liked cards list.
  `, async () => {
        
    const likedCards = new LikedCards([123]);
    const initialState = new State({ likedCards });
    const store = createStore<State>({
      initialState,
      logger: () => { }, // Empty function as logger
      logStateChanges: false
    });    

    // Given card "123" is in the liked cards list.
    expect(store.state.likedCards.isCardLiked('123')).toBe(true);

    // When we toggle like/unlike card "123".
    await store.dispatchAndWait(new ToggleLike('123'));

    // Then card "123" should be removed from the liked cards list.
    expect(store.state.likedCards.isCardLiked('123')).toBe(false);
  });

  test(`
    Given card "123" is not in the liked cards list.
    When we toggle like/unlike card "123" multiple times.
    Then card "123" should alternate between being liked and not liked.
  `, async () => {

    const store = createStore<State>({
      initialState: State.initialState,
      logger: () => { }, // Empty function as logger
      logStateChanges: false
    });    

    // Given card "123" is not in the liked cards list.
    expect(store.state.likedCards.isCardLiked('123')).toBe(false);

    // When we toggle like/unlike card "123" multiple times.
    // First toggle
    await store.dispatchAndWait(new ToggleLike('123'));
    // Then card "123" should be added to the liked cards list.
    expect(store.state.likedCards.isCardLiked('123')).toBe(true);

    // Second toggle
    await store.dispatchAndWait(new ToggleLike('123'));
    // Then card "123" should be removed from the liked cards list.
    expect(store.state.likedCards.isCardLiked('123')).toBe(false);

    // Third toggle
    await store.dispatchAndWait(new ToggleLike('123'));
    // Then card "123" should be added to the liked cards list again.
    expect(store.state.likedCards.isCardLiked('123')).toBe(true);
  });
});