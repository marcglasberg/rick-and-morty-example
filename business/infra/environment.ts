/** Where the app is running. Given to the store, which uses it to create the dependencies. */
export enum Environment {
  /** Loads the cards from the Rick and Morty API. */
  production = 'production',

  /** Runs the app with fake cards, without the server. */
  simulation = 'simulation',

  /** Runs the tests. */
  testing = 'testing',
}
