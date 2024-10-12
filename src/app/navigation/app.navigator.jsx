import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DummyScreen from '../dummy.screen';
import { LoginScreen } from '../wallet';
import { BottomTabs } from './bottom.tabs';

const AppStack = createNativeStackNavigator();

export function AppNavigator() {
  const isLoggedIn = false;
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="Main"
        component={isLoggedIn ? BottomTabs : LoginScreen}
        options={{ headerShown: false }}
      />
      {
        //Essential screens
        <AppStack.Group screenOptions={{ presentation: 'modal' }}>
          <AppStack.Screen
            name="DummyModal"
            component={DummyScreen}
            options={{ headerTitle: '' }}
          />
        </AppStack.Group>
      }
    </AppStack.Navigator>
  );
}