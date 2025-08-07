import { createStore } from 'kiss-for-react';
import { ToggleTheme } from '../business/actions/toggle-theme-action';
import { State } from '../business/state/state';

describe('ToggleTheme Action', () => {

  test(`
    Given the current theme is light.
    When we toggle the theme (ToggleTheme action with no params).
    Then the theme should change to dark.
  `, async () => {

    const store = createStore<State>({
      initialState: State.initialState.withColorScheme('light'),
      logger: () => { }, 
      logStateChanges: false
    });

    // Given the current theme is light.
    expect(store.state.colorScheme).toBe('light');

    // When we toggle the theme (ToggleTheme action with no params).
    await store.dispatchAndWait(new ToggleTheme());

    // Then the theme should change to dark.
    expect(store.state.colorScheme).toBe('dark');
  });

  test(`
    Given the current theme is dark.
    When we toggle the theme (ToggleTheme action with no params).
    Then the theme should change to light.
  `, async () => {
    
    const store = createStore<State>({
      initialState: new State({ colorScheme: 'dark' }),
      logger: () => { }, 
      logStateChanges: false
    });

    // Given the current theme is dark.
    expect(store.state.colorScheme).toBe('dark');

    // When we toggle the theme (ToggleTheme action with no params).
    await store.dispatchAndWait(new ToggleTheme());

    // Then the theme should change to light.
    expect(store.state.colorScheme).toBe('light');
  });

  test(`
    Given the current theme is null (system default).
    When we toggle the theme (ToggleTheme action with no params).
    Then the theme should change to light.
  `, async () => {

    const store = createStore<State>({
      initialState: State.initialState,
      logger: () => { }, 
      logStateChanges: false
    });

    // Given the current theme is null (system default).
    expect(store.state.colorScheme).toBeNull();

    // When we toggle the theme (ToggleTheme action with no params).
    await store.dispatchAndWait(new ToggleTheme());

    // Then the theme should change to light.
    expect(store.state.colorScheme).toBe('light');
  });

  test(`  
    Given the current theme is light.
    When we toggle the theme, but specify that the current theme is dark.    
    Then the theme remais light.
  `, async () => {

    // Arrange: Create a store with light theme.
    const store = createStore<State>({
      initialState: State.initialState.withColorScheme('light'),
      logger: () => { }, 
      logStateChanges: false
    });

    // Check initial state - theme should be light.
    expect(store.state.colorScheme).toBe('light');

    // Act: Dispatch the action with 'dark' theme.
    await store.dispatchAndWait(new ToggleTheme({ currentTheme: 'dark' }));

    // Assert: Theme should now be dark.
    expect(store.state.colorScheme).toBe('light');
  });

  test(`
    Given the current theme is dark.
    When we toggle the theme, but specify that the current theme is dark.    
    Then the theme changes to light.
  `, async () => {

    // Arrange: Create a store with dark theme.
    const store = createStore<State>({
      initialState: State.initialState.withColorScheme('dark'),
      logger: () => { }, 
      logStateChanges: false
    });

    // Check initial state - theme should be dark.
    expect(store.state.colorScheme).toBe('dark');

    // Act: Dispatch the action with 'light' theme.
    await store.dispatchAndWait(new ToggleTheme({ currentTheme: 'dark' }));

    // Assert: Theme should now be light.
    expect(store.state.colorScheme).toBe('light');
  });  
});
