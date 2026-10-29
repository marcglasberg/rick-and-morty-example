import React from 'react';
import { Button } from 'react-native';
import { Stack } from 'expo-router';
import CardDetailScreen from '../app/card/[id]/index';
import { fireEvent, renderRouter, screen, testRouter } from 'expo-router/testing-library';
import { createStore, StoreProvider } from 'kiss-for-react';
import { State } from '../business/state/state';
import { triggerHaptic } from '../components/HapticFeedback';
import { useOpenCard } from '../hooks/useOpenCard';
import { disposeAfterTest, disposeTestStores } from '../test-utils/dispose-after-test';

jest.mock('../components/HapticFeedback', () => ({ triggerHaptic: jest.fn() }));

afterEach(disposeTestStores);

test(`
Given the home route is focused.
When two card presses arrive before Router commits navigation.
Then one Back returns home and a subsequent card press opens normally.
`, async () => {
  const store = disposeAfterTest(createStore<State>({ initialState: State.initialState, logger: () => {}, logStateChanges: false }));
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


test.each(['1', '999999'])(`
Given a cold direct detail URL for card %s without loaded card data.
When Home is chosen from the actual detail screen and a card is pressed.
Then the existing history does not block opening that card.
`, async (id) => {
  const store = disposeAfterTest(createStore<State>({ initialState: State.initialState, logger: () => {}, logStateChanges: false }));
  function Home() {
    const openCard = useOpenCard();
    return <Button title="Open another card" onPress={() => { openCard('2'); openCard('2'); }} />;
  }
  function Layout() {
    return <StoreProvider store={store}><Stack /></StoreProvider>;
  }
  const rendered = await renderRouter(
    { _layout: Layout, index: Home, 'card/[id]': CardDetailScreen },
    { initialUrl: `/card/${id}` }
  );
  expect(screen.getByText('Card not found')).toBeTruthy();
  await fireEvent.press(screen.getByText('Home'));
  expect(rendered.getPathname()).toBe('/');
  await fireEvent.press(screen.getByText('Open another card'));
  expect(rendered.getPathname()).toBe('/card/2');
  expect(store.state.selectedCardId).toBe('2');
  await testRouter.back('/');
});


test(`
Given a synchronous error before navigation is queued.
When the error is reported and the user retries the card press.
Then the opening gate does not remain locked.
`, async () => {
  const store = disposeAfterTest(createStore<State>({ initialState: State.initialState, logger: () => {}, logStateChanges: false }));
  function Home() {
    const openCard = useOpenCard();
    return <Button title="Open card" onPress={() => openCard('2')} />;
  }
  function Layout() {
    return <StoreProvider store={store}><Stack /></StoreProvider>;
  }
  function Detail() { return <Button title="Details loaded" onPress={() => {}} />; }
  const rendered = await renderRouter({ _layout: Layout, index: Home, 'card/[id]': Detail });
  jest.mocked(triggerHaptic).mockImplementationOnce(() => { throw new Error('Haptics unavailable'); });
  await expect(fireEvent.press(screen.getByText('Open card'))).rejects.toThrow('Haptics unavailable');
  expect(rendered.getPathname()).toBe('/');
  expect(store.state.selectedCardId).toBeNull();
  await fireEvent.press(screen.getByText('Open card'));
  expect(rendered.getPathname()).toBe('/card/2');
});
