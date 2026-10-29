import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Persistor } from "kiss-for-react";
import { LikedCards } from '../state/liked-cards';
import { State } from "../state/state";

/** The part of the state that is saved. The cards are not saved, as they are fetched again. */
interface SavedState {
  likedCardIds: number[];
  colorScheme: 'light' | 'dark' | null;
}

export class AppPersistor extends Persistor<State> {

  /**
   * Read the saved state from the persistence.
   * Return `null` if the state is not yet persisted.
   * Called only once when the app starts.
   */
  async readState(): Promise<State | null> {
    if (Platform.OS === 'web' && typeof window === 'undefined') return null;

    // Reads the JSON as a string.
    const serialized: string | null = await AsyncStorage.getItem('state');
    if (serialized === null) return null;

    const parsed: SavedState | number[] = JSON.parse(serialized);

    // Older versions of the app saved only the liked card IDs, as an array.
    const saved: SavedState = Array.isArray(parsed)
      ? { likedCardIds: parsed, colorScheme: null }
      : parsed;

    return State.initialState.copy({
      likedCards: new LikedCards(saved.likedCardIds),
      colorScheme: saved.colorScheme,
    });
  }

  /** Save an initial-state (empty) to the persistence. */
  async saveInitialState(state: State): Promise<void> {
    await this.save(state);
  }

  /** Delete the saved state from the persistence.*/
  async deleteState() {
    if (Platform.OS === 'web' && typeof window === 'undefined') return;
    await AsyncStorage.removeItem('state');
  }

  /**
   * The saved part of the state is small, so we save all of it,
   * but only if it changed since it was last saved.
   */
  async persistDifference(lastPersistedState: State | null, newState: State) {
    if (lastPersistedState !== null
      && lastPersistedState.likedCards === newState.likedCards
      && lastPersistedState.colorScheme === newState.colorScheme) return;

    await this.save(newState);
  }

  private async save(state: State): Promise<void> {
    if (Platform.OS === 'web' && typeof window === 'undefined') return;

    const saved: SavedState = {
      likedCardIds: [...state.likedCards.ids],
      colorScheme: state.colorScheme,
    };
    await AsyncStorage.setItem('state', JSON.stringify(saved));
  }
}
