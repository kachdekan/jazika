import { Box, Text } from 'native-base';
import { useLayoutEffect, useState, useCallback } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { ScrollView, YStack } from 'tamagui';
import {
  ChevronDown,
  CircleDollarSign,
  ArrowBigRightDash,
  ArrowBigDownDash,
  Coins,
  HandCoins,
  Menu,
} from '@tamagui/lucide-icons';
import { GroupHomeCard, SectionHeader } from 'jzk/components';
import { RefreshControl } from 'react-native';

export default function GroupHomeScreen({ navigation }) {
  const [groupName, setGroupName] = useState('Jazika Group');
  const [isLoadingBal, setIsLoadingBal] = useState(false);
  const [balance, setBalance] = useState({
    aptBal: 0,
    jkesBal: 0,
    balUSD: 910000,
  });
  const [refreshing, setRefreshing] = useState(false);
  const handleTitlePress = () => {
    // Add your logic here
    console.log('Title pressed');
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity onPress={handleTitlePress} style={styles.headerTitle}>
          <Text style={styles.titleText}>{groupName || 'Groups'}</Text>
          <ChevronDown size={26} color="#000" style={styles.chevron} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, groupName]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);
  return (
    <Box flex={1} bg="muted.100" alignItems="center">
      <ScrollView
        width="95%"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <YStack mt="$3">
          <GroupHomeCard
            color="$gray12"
            bg="$background"
            balance={balance.balUSD.toFixed(2)}
            apprxBalance={isLoadingBal ? 'isFetchingBal' : (balance.balUSD * 1).toFixed(2)}
            btn1={{
              icon: <CircleDollarSign size={30} />,
              color: '$green5',
              name: 'Fund',
              screen: 'depositFunds',
            }}
            btn2={{
              icon: <HandCoins size={30} />,
              color: '$orange5',
              name: 'Borrow',
              screen: 'transferFunds',
              params: balance,
            }}
            btn3={{
              icon: <Coins size={30} />,
              color: '$red5',
              name: 'Repay',
              screen: 'withdrawFunds',
              params: balance,
            }}
            btn4={{
              icon: <Menu size={30} />,
              color: '$blue5',
              name: 'More',
              screen: 'withdrawFunds',
              params: balance,
            }}
            itemBottom={true}
          />
        </YStack>
        <SectionHeader
          title="Activity"
          actionText="See all"
          action={() => console.log('See all')}
        />
      </ScrollView>
    </Box>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 4,
  },
  chevron: {
    marginTop: 2, // Slight adjustment to align with text
  },
});
