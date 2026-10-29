import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { AppPersistor } from '../business/infra/app-persistor';
import { LikedCards } from '../business/state/liked-cards';
import { State } from '../business/state/state';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'));

describe('Persistence across native restarts', () => {
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
    Reflect.deleteProperty(globalThis, 'window');
  });
  afterEach(() => {
    jest.restoreAllMocks();
    if (windowDescriptor) Object.defineProperty(globalThis, 'window', windowDescriptor);
  });

  test(`
Given native execution without a browser window.
When likes are saved and a new persistor reads them.
Then likes survive restart using the existing state key.
`, async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');
    const state = State.initialState.copy({ likedCards: new LikedCards([1, 42]) });
    await new AppPersistor().persistDifference(null, state);
    expect(await AsyncStorage.getItem('state')).toBe('{"likedCardIds":[1,42],"colorScheme":null}');
    const restored = await new AppPersistor().readState();
    expect(restored?.likedCards.ids).toEqual([1, 42]);
    await new AppPersistor().deleteState();
    expect(await AsyncStorage.getItem('state')).toBeNull();
  });

  test(`
Given native execution without a browser window.
When the theme is saved and a new persistor reads it.
Then the theme survives restart.
`, async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');
    const state = State.initialState.withColorScheme('dark');
    await new AppPersistor().persistDifference(null, state);
    const restored = await new AppPersistor().readState();
    expect(restored?.colorScheme).toBe('dark');
  });

  test(`
Given likes saved by an older version of the app, as an array of IDs.
When a new persistor reads them.
Then the likes are restored, and the theme follows the system.
`, async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');
    await AsyncStorage.setItem('state', '[1,42]');
    const restored = await new AppPersistor().readState();
    expect(restored?.likedCards.ids).toEqual([1, 42]);
    expect(restored?.colorScheme).toBeNull();
  });

  test(`
Given a saved state.
When the state changes, but not the likes or the theme.
Then nothing is saved.
`, async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');
    const persistor = new AppPersistor();
    const saved = State.initialState.copy({ likedCards: new LikedCards([1]) });
    await persistor.persistDifference(null, saved);
    jest.mocked(AsyncStorage.setItem).mockClear();
    await persistor.persistDifference(saved, saved.copy({ totalCount: 826 }));
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  test(`
Given web rendering without a browser window.
When the persistor initializes or saves state.
Then it avoids browser storage during server rendering.
`, async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    const persistor = new AppPersistor();
    expect(await persistor.readState()).toBeNull();
    await persistor.saveInitialState(State.initialState);
    await persistor.persistDifference(null, State.initialState);
    await persistor.deleteState();
    expect(AsyncStorage.getItem).not.toHaveBeenCalled();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
  });
});
