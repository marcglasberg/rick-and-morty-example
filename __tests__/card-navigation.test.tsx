import React from 'react';
import { Button } from 'react-native';
import { Stack } from 'expo-router';
import { fireEvent, renderRouter, screen, testRouter } from 'expo-router/testing-library';
import { createStore, StoreProvider } from 'kiss-for-react';
import { State } from '../business/state/state';
import { useOpenCard } from '../hooks/useOpenCard';

jest.mock('../components/HapticFeedback', () => ({ triggerHaptic: jest.fn() }));

test(`
Given the home route is focused.
When two card presses arrive before Router commits navigation.
Then one Back returns home and a subsequent card press opens normally.
`, async () => {
  const store = createStore<State>({ initialState: State.initialState, logger: () => {}, logStateChanges: false });
  function Home() {
    const openCard = useOpenCard();
    return <Button title="Double open" onPress={() => { openCard('1'); openCard('1'); }} />;
  }
  function Layout() {
    return <StoreProvider store={store}><Stack /></StoreProvider>;
  }
  function Detail() { return <Button title="Details loaded" onPress={() => {}} />; }
  const rendered = await renderRouter({ _layout: Layout, index: Home, 'card/[id]': Detail });
  await fireEvent.press(screen.getByText('Double open'));
  expect(rendered.getPathname()).toBe('/card/1');
  expect(store.state.selectedCardId).toBe('1');
  await testRouter.back('/');
  expect(screen.getByText('Double open')).toBeTruthy();
  await fireEvent.press(screen.getByText('Double open'));
  expect(rendered.getPathname()).toBe('/card/1');
  await testRouter.back('/');
});
