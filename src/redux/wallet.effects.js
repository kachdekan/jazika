import {
  setUserDetails,
  addUserDetailsToken,
  setLoggedIn,
  setIsConnected,
  setTokenIsSet,
} from './wallet.slice';
import { seedAccount } from '../services';

import {
  addUserData,
  addUserToken,
  getUserData,
  updateUserData,
  storeSecureData,
  getSecureData,
} from 'jzk/services';

export const walletListeners = (startListening) => {
  startListening({
    actionCreator: setUserDetails,
    effect: async (action, listenerApi) => {
      const userData = listenerApi.getState().wallet.userDetails;
      addUserData(userData);
    },
  });
  startListening({
    actionCreator: addUserDetailsToken,
    effect: async (action, listenerApi) => {
      const userPhone = listenerApi.getState().wallet.userDetails.phone;
      await addUserToken(action.payload, userPhone);
      const userData = await getUserData(userPhone);
      if (userData.token === action.payload) {
        await seedAccount(userData.address);
        listenerApi.dispatch(setTokenIsSet(true));
        listenerApi.dispatch(setLoggedIn(true));
      }
    },
  });
};
