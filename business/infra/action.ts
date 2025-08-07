import NetInfo from '@react-native-community/netinfo';
import { KissAction } from "kiss-for-react";
import { Dao } from "../dao/dao";
import { RealDao } from '../dao/real-dao';
import { State } from "../state/state";

export let DAO: Dao = new RealDao();

/** For test use only. Do not call in production code. */
export function setDao(newDao: Dao): void {
  DAO = newDao;
}

/** Base action. All other actions should extend this one. */
export abstract class Action extends KissAction<State> {

  protected hasInternet(): Promise<boolean> {
    return NetInfo.fetch()
      .then(state => state.isConnected ?? true)
      .catch(error => {
        console.error('Error checking internet connectivity:', error);
        return true; // Default to assuming internet is available in case of error.
      });
  }
}
