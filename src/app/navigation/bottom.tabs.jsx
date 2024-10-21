import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../wallet';
import { AccountScreen } from '../account';
import { GroupsLandingScreen, GroupHomeScreen } from '../groups';
import DummyScreen from '../dummy.screen';
import { Icon, Box, Text, Avatar, Pressable, HStack } from 'native-base';

const Tab = createBottomTabNavigator();

export function BottomTabs() {
  const hasGroups = true;
  return (
    <Tab.Navigator screenOptions={TabScreenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Groups" component={hasGroups ? GroupHomeScreen : GroupsLandingScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

const HeaderRightIcons = () => {
  const navigation = useNavigation();
  return (
    <HStack space="5" mr="3">
      <Pressable
        onPress={() => navigation.navigate('Notifications')}
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <Icon as={Ionicons} name="notifications" size={22} color="primary.700" />
      </Pressable>
    </HStack>
  );
};

const AccPressable = () => {
  const navigation = useNavigation();
  return (
    // fix avatar text color to primary.700
    <Pressable
      onPress={() => navigation.navigate('Account')}
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <Avatar bg="primary.200" ml="2" size="sm" _text={{ color: 'primary.800' }}>
        <Icon as={Ionicons} name="person" size={22} color="coolGray.700" />
      </Avatar>
    </Pressable>
  );
};

const TabIcons = {
  Home: ['home', 'home-outline'],
  Groups: ['people', 'people-outline'],
  Account: ['settings', 'settings-outline'],
};

const TabScreenOptions = ({ route }) => ({
  tabBarIcon: ({ focused }) => {
    const [iconFill, iconLine] = TabIcons[route.name];
    return (
      <Box bg={focused ? 'primary.200' : '#ffffff'} rounded="2xl" px="5" py="1" mt="1">
        <Icon
          as={Ionicons}
          name={focused ? iconFill : iconLine}
          size={22}
          key={route.name}
          color="coolGray.700"
        />
      </Box>
    );
  },
  tabBarLabel: () => {
    return (
      <Text fontSize="xs" color="coolGray.700" key={route.name} mb="1">
        {route.name}
      </Text>
    );
  },
  headerLeft: () => <AccPressable />,
  headerRight: () => <HeaderRightIcons />,
  tabBarHideOnKeyboard: true,
  tabBarStyle: {
    height: 60,
  },
});
