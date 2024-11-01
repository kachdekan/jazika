import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base';
import { TamaguiProvider } from 'tamagui';
import config from '../config/uiconfig';
import { useEffect } from 'react';
import { Navigation } from './navigation';
import { theme } from '../theme';
import { LogBox } from 'react-native';

export default function App() {
  useEffect(() => {
    //LogBox.ignoreLogs(['Encountered two children with the same key ...'])
    LogBox.ignoreAllLogs();
  }, []);
  return (
    <TamaguiProvider config={config}>
      <NativeBaseProvider theme={theme}>
        <StatusBar style="auto" />
        <Navigation />
      </NativeBaseProvider>
    </TamaguiProvider>
  );
}
