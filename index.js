import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';
//import '@walletconnect/react-native-compat';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import 'expo-dev-client';
import 'text-encoding';

import App from './src/app';
import { store } from './src/redux';

const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(ReduxApp);
