import { KissAction } from 'kiss-for-react';
import { Dependencies } from '../dependencies/dependencies';
import { State } from '../state/state';
import { Environment } from './environment';

/** Base action. All other actions should extend this one. */
export abstract class Action extends KissAction<State> {

  /** The environment the store was created with. */
  get env(): Environment { return this.store.environment as Environment; }

  /** The services injected into the store, like `this.deps.loadCards()`. */
  get deps(): Dependencies { return this.store.dependencies as Dependencies; }
}
