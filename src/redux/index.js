import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';

import spaceReducer from './spaces.slice';
import walletReducer from './wallet.slice';
import { walletListeners } from './wallet.effects';
import { spacesListeners } from './spaces.effects';

const listenerMiddleware = createListenerMiddleware();

const combinedReducers = combineReducers({
  wallet: walletReducer,
  spaces: spaceReducer,
});

export const store = configureStore({
  reducer: combinedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

const listeners = [walletListeners, spacesListeners];
listeners.forEach((listener) => listener(listenerMiddleware.startListening));
