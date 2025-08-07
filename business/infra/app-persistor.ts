import AsyncStorage from '@react-native-async-storage/async-storage';
import { Persistor } from "kiss-for-react";
import { LikedCards } from '../state/liked-cards';
import { State } from "../state/state";

export class AppPersistor extends Persistor<State> {

  /**
   * Read the saved state from the persistence. 
   * Return `null` if the state is not yet persisted. 
   * Called only once when the app starts.
   */
  async readState(): Promise<State | null> {
    if (typeof window === 'undefined') return null;  

    // Reads the JSON as a string.
    let serialized: string | null = await AsyncStorage.getItem('state');
    if (serialized === null) return null;

    // Deserialize the JSON string to a list of integers.
    let likedCardIds: number[] = JSON.parse(serialized);

    // Create a new LikedCards instance with the IDs
    let likedCards = new LikedCards(likedCardIds);

    // Return a new state with the liked cards
    return State.initialState.copy({
      likedCards: likedCards,
    });
  }

  /** Save an initial-state (empty) to the persistence. */
  async saveInitialState(state: State): Promise<void> {
    if (typeof window === 'undefined') return;

    const serialized = JSON.stringify([]);
    await AsyncStorage.setItem('state', serialized);
  }

  /** Delete the saved state from the persistence.*/
  async deleteState() {
    if (typeof window === 'undefined') return;
    await AsyncStorage.removeItem('state');
  }

  /** State is small, so we save `newState` everytime, ignoring `lastPersistedState`. */
  async persistDifference(_lastPersistedState: State | null, newState: State) {
    if (typeof window === 'undefined') return;
    
    let likedCards = newState.likedCards;
    const serialized = JSON.stringify(likedCards.ids);
    await AsyncStorage.setItem('state', serialized);
  }
}