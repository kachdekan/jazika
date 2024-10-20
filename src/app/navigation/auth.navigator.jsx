import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen, SignUpScreen, VerificationScreen, SetPasscodeScreen } from '../onboarding';

const AuthStack = createNativeStackNavigator();

export function AuthNavigator() {
  return (
    <AuthStack.Navigator initialRouteName="Welcome">
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <AuthStack.Group screenOptions={{ presentation: 'modal' }}>
        <AuthStack.Screen
          name="signup"
          component={SignUpScreen}
          options={{
            headerTitle: 'Sign Up',
          }}
        />
        <AuthStack.Screen
          name="verifyPhoneNo"
          component={VerificationScreen}
          options={{ headerTitle: 'Verification' }}
        />
        <AuthStack.Screen
          name="setPasscode"
          component={SetPasscodeScreen}
          options={{ headerTitle: 'Set Passcode' }}
        />
      </AuthStack.Group>
    </AuthStack.Navigator>
  );
}
