import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DummyScreen from '../dummy.screen';
import { LoginScreen } from '../wallet';
import {
  CreateGroupScreen,
  ApplyLoanStep1,
  ApplyLoanStep2,
  ApplyLoanStep3,
  ApplyLoanStep4,
  ApplyLoanStep5,
  RepayLoanScreen,
} from '../groups';
import { BottomTabs } from './bottom.tabs';
import { useSelector } from 'react-redux';

const AppStack = createNativeStackNavigator();

export function AppNavigator() {
  const isLoggedIn = useSelector((s) => s.wallet.isLoggedIn);
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
      {
        //Group Screens
        <AppStack.Group screenOptions={{ presentation: 'modal' }}>
          {/*<AppStack.Screen
            name="joinSpace"
            component={JoinSpaceScreen}
            options={{ headerTitle: 'Join a Space' }}
          />*/}
          <AppStack.Screen
            name="createGroup"
            component={CreateGroupScreen}
            options={{ headerTitle: 'Create a Group' }}
          />
          {/*
          <AppStack.Screen
            name="inviteMembers"
            component={InviteMembersScreen}
            options={{ headerTitle: 'Invite Members' }}
          />*/}
          <AppStack.Screen
            name="appyLoanS1"
            component={ApplyLoanStep1}
            options={{
              headerShown: false,
            }}
          />
          <AppStack.Screen
            name="appyLoanS2"
            component={ApplyLoanStep2}
            options={{
              headerShown: false,
            }}
          />
          <AppStack.Screen
            name="appyLoanS3"
            component={ApplyLoanStep3}
            options={{
              headerShown: false,
            }}
          />
          <AppStack.Screen
            name="appyLoanS4"
            component={ApplyLoanStep4}
            options={{
              headerShown: false,
            }}
          />
          <AppStack.Screen
            name="appyLoanS5"
            component={ApplyLoanStep5}
            options={{
              headerShown: false,
            }}
          />
          <AppStack.Screen name="repayLoan" component={RepayLoanScreen} />
        </AppStack.Group>
      }
    </AppStack.Navigator>
  );
}
