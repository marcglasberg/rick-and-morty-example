import { Store } from 'kiss-for-react';
import { Environment } from '../infra/environment';
import { State } from '../state/state';
import { Dependencies } from './dependencies';
import { RealDependencies } from './real-dependencies';
import { SimulatedDependencies } from './simulated-dependencies';

/** The store calls this once, when it's created, to create the dependencies. */
export function createDependencies(store: Store<State>): Dependencies {
  switch (store.environment as Environment) {
    case Environment.production:
      return new RealDependencies();
    default:
      return new SimulatedDependencies();
  }
}
