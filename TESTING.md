# Testing

This project uses Jest for unit testing of Kiss actions and store state.

## Running Tests

To run all tests:

```bash
npm test
```

To run a specific test file:

```bash
# Run the ToggleLike action test
npm run test:toggle-like
```

## Using the VS Code Jest Extension

This project is configured to work with the Jest VS Code extension (by Orta). With this extension installed, you can:

1. See test results directly in the editor
2. Run tests by clicking the "Run Test" or "Debug Test" buttons that appear above each test
3. View test coverage
4. Debug tests with breakpoints

Notes:

- I disabled "Jest: Auto Run" setting.
- Use the Jest output panel to see detailed test results
- For test specific files, you can right-click and select "Jest: Run Tests in Current File"

## Test Structure

Tests for Kiss actions generally follow this pattern:

1. Set up the store with an initial state
2. Dispatch one or more actions
3. Wait for the actions to complete
4. Verify the new state

### BDD Format for Test Descriptions

Test descriptions should follow the Behavior-Driven Development (BDD) format using the pattern:

```text
Given [initial context/state].
When [action is performed].
And [additional context if needed].
But [exception to the rule if needed].
Then [expected outcome].
```

Each clause should be on a separate line for clarity. Always end with a period.

For example, to test that the ToggleLike action toggles a card's liked status:

```typescript
test(`
Given a card that is not liked.
When the ToggleLike action is dispatched with that card's ID.
Then the card should be marked as liked in the state.
`, async () => {

  // 1. Set up the store with initial state
  const store = createStore<State>({
    initialState: State.initialState,
    logger: () => {},
    logStateChanges: false
  });

  const cardId = '123';

  // Check initial state - card shouldn't be liked
  expect(store.state.likedCards.isCardLiked(cardId)).toBe(false);

  // 2. Dispatch the action
  await store.dispatchAndWait(new ToggleLike(cardId));

  // 4. Verify the new state
  expect(store.state.likedCards.isCardLiked(cardId)).toBe(true);
});
```

## Adding New Tests

To add a new test for an action:

1. Create a new file named `action-name.test.ts` in the same directory as the action
2. Import the necessary dependencies
3. Mock any external dependencies if needed
4. Write your test cases following the BDD pattern described above
5. Remember to format test descriptions with the Given/When/Then structure on multiple lines

### Another test example

Just dispatch actions and wait for them to finish. Then, verify the new state or check if some error was thrown.

```typescript
class State {
  constructor(
    public items: string[], 
    public selectedItem: number
  ) {}
}

test(`
Given a store with items A, B, C.
When the SelectItem action is dispatched with indexes 2 and 42.
Then the selected item should be B, in the first case.
And the second case should throw a UserException.
`, 
async () => {

  const store = createStore<State>({
    initialState: new State(['A', 'B', 'C'], -1);
  });
  
  // Should select item 2
  await store.dispatchAndWait(new SelectItem(2));
  expect(store.state.selectedItem).toBe('B');

  // Fail to select item 42
  let status = await store.dispatchAndWait(new SelectItem(42));    
  expect(status.originalError).toBeInstanceOf(UserException);          
});
```
