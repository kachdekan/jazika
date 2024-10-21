import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DummyScreen from '../dummy.screen';
import { LoginScreen } from '../wallet';
import { CreateGroupScreen } from '../groups';
import { BottomTabs } from './bottom.tabs';
import { useSelector } from 'react-redux';

const AppStack = createNativeStackNavigator();

export function AppNavigator() {
  const isLoggedIn = true; //useSelector((s) => s.wallet.isLoggedIn);
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
        </AppStack.Group>
      }
    </AppStack.Navigator>
  );
}
