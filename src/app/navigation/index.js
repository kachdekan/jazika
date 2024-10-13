import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppNavigator } from './app.navigator';
import { AuthNavigator } from './auth.navigator';
import { useSelector } from 'react-redux';

const Stack = createNativeStackNavigator();

export function Navigation() {
  const { address, id } = useSelector((s) => s.wallet.userDetails);
  const tokenIsSet = useSelector((s) => s.wallet.isTokenSet);
  const hasAccount = !!(address && id && tokenIsSet);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {hasAccount ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
