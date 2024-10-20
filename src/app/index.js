import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base';
import { TamaguiProvider } from 'tamagui';
import config from '../config/uiconfig';

import { Navigation } from './navigation';
import { theme } from '../theme';

export default function App() {
  return (
    <TamaguiProvider config={config}>
      <NativeBaseProvider theme={theme}>
        <StatusBar style="auto" />
        <Navigation />
      </NativeBaseProvider>
    </TamaguiProvider>
  );
}
