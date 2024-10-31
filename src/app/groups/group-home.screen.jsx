import { Box, Text, HStack, Avatar, VStack } from 'native-base';
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
import { GroupHomeCard, SectionHeader, NoItems } from 'jzk/components';
import { RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';

export default function GroupHomeScreen({ navigation }) {
  const { account, addresses } = useSelector((state) => state.wallet.userDetails);
  const groupDetails = useSelector((state) => state.spaces.roscaDetails);
  const [groupName, setGroupName] = useState(groupDetails.spaceName);
  const [isLoadingBal, setIsLoadingBal] = useState(false);
  const [balance, setBalance] = useState({
    USDTBal: 0,
    CKESBal: 10000 - groupDetails.loanBalance,
    balUSD: (10000 - groupDetails.loanBalance) * 0.0078,
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
  const txDate = new Date(Date.now() - 30 * 1000).toLocaleString();
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
            apprxBalance={isLoadingBal ? 'isFetchingBal' : (balance.CKESBal * 1).toFixed(2)}
            savings={0.0}
            loans={groupDetails.loanBalance * 1}
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
              screen: 'appyLoanS1',
              params: balance,
            }}
            btn3={{
              icon: <Coins size={30} />,
              color: '$red5',
              name: 'Repay',
              screen: 'repayLoan',
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
        {balance.CKESBal < 10000 ? (
          <Box bg="white" rounded="2xl">
            <HStack space={3} my={2} mx={3} alignItems="center">
              <Avatar
                bg={true ? 'primary.100' : 'orange.100'}
                _text={{ color: true ? 'primary.800' : 'orange.800' }}
              >
                LR
              </Avatar>
              <Box flexDirection="row" justifyContent="space-between" width="84%" mt="-0.5">
                <VStack>
                  <Text fontWeight="semibold" color="warmGray.800">
                    Loan Requested
                  </Text>
                  <Text>{txDate}</Text>
                </VStack>
                <VStack mr={2}>
                  <Text fontWeight="semibold" color="warmGray.800" textAlign="right">
                    {groupDetails.loanBalance} CKES
                  </Text>
                  <Text color="blueGray.800" textAlign="right">
                    {groupDetails.loanBalance} KES
                  </Text>
                </VStack>
              </Box>
            </HStack>
          </Box>
        ) : (
          <Box width="85%" alignSelf="center">
            <NoItems
              title="No activity yet"
              message="You have no activity in this group yet. Check back later."
              action={() => console.log('Action')}
              actionText="Get started"
            />
          </Box>
        )}
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
