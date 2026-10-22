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
    expect(await AsyncStorage.getItem('state')).toBe('[1,42]');
    const restored = await new AppPersistor().readState();
    expect(restored?.likedCards.ids).toEqual([1, 42]);
    await new AppPersistor().deleteState();
    expect(await AsyncStorage.getItem('state')).toBeNull();
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
