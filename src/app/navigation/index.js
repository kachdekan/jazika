import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Spinner } from 'native-base';
import auth from '@react-native-firebase/auth';
import { useEffect, useState } from 'react';
import { AppNavigator } from './app.navigator';
import { AuthNavigator } from './auth.navigator';
import { useSelector, useDispatch } from 'react-redux';
import { getUserData, setUserTokenFrom, setKey } from 'jzk/services';
import { setTokenIsSet, setUserDetailsOnLogin } from 'jzk/redux/wallet.slice';
import { getRoscaData } from 'jzk/redux/spaces.slice';

const Stack = createNativeStackNavigator();

export function Navigation() {
  const dispatch = useDispatch();
  const { id, account } = useSelector((s) => s.wallet.userDetails);
  const tokenIsSet = useSelector((s) => s.wallet.isTokenSet);
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (user) => {
      if (user) {
        const userData = await getUserData(user.phoneNumber.substring(1));
        if (userData?.token && userData?.addresses) {
          dispatch(setUserDetailsOnLogin(userData));
          setUserTokenFrom(userData.token);
          setKey(userData.account.accountId, userData.account.privateKey);
          dispatch(setTokenIsSet(true));
          dispatch(getRoscaData(userData.addresses[1].address));
        }
      }
    });
    return subscriber;
  }, [dispatch]);
  const hasAccount = !!(account && id && tokenIsSet);

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
