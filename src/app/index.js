import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider, Text } from 'native-base';

import { Navigation } from './navigation';
import { theme } from '../theme';

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar style="auto" />
      <Navigation />
    </NativeBaseProvider>
  );
}
