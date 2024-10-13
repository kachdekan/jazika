import { useState, useCallback, useEffect } from 'react';
import { Box, Text, Button, Icon, FlatList, Spinner } from 'native-base';
import { Feather } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';
import {
  FeatureHomeCard,
  TransactionItem,
  SectionHeader,
  AssetItem,
  NoItems,
} from 'jzk/components';
import { useSelector, useDispatch } from 'react-redux';

//import { setUserBalances } from 'dapp/redux/essential/essential.slice';

export default function HomeScreen({ navigation }) {
  //const {  } = useSelector((s) => s.wallet);
  const dispatch = useDispatch();
  const [balance, setBalance] = useState({
    aptBal: 0,
    jkesBal: 0,
    balUSD: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingBal, setIsLoadingBal] = useState(false);
  const [txIsLoading, setTxIsLoading] = useState(false);
  const [ercIsLoading, setErcIsLoading] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  return (
    <Box flex={1} bg="muted.100" alignItems="center">
      <FlatList
        width="95%"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        data={transactions.slice(0, 3)}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Box mt="4">
            <FeatureHomeCard
              color="warmGray.800"
              bg="white"
              balance={balance.balUSD.toFixed(2)}
              apprxBalance={isLoadingBal ? 'isFetchingBal' : (balance.balUSD * 0).toFixed(2)}
              btn1={{
                icon: <Icon as={Feather} name="plus" size="md" color="primary.600" mr="1" />,
                name: 'Deposit',
                screen: 'depositFunds',
              }}
              btn2={{
                icon: <Icon as={Feather} name="arrow-right" size="md" color="primary.600" mr="1" />,
                name: 'Transfer',
                screen: 'transferFunds',
                params: balance,
              }}
              btn3={{
                icon: <Icon as={Feather} name="arrow-down" size="md" color="primary.600" mr="1" />,
                name: 'Withdraw',
                screen: 'withdrawFunds',
                params: balance,
              }}
              itemBottom={false}
            />
            <SectionHeader title="Assets" actionText="Swap" action={() => console.log('swap')} />
            <Box bg="white" opacity={85} roundedTop="2xl" roundedBottom="md" mt={1}>
              <AssetItem
                name="JKES"
                descrp="Jazika KE Shilling"
                amount={balance.jkesBal}
                eqAmount={(balance.jkesBal * 1).toFixed(2) + ' KES'}
              />
            </Box>
            <Box bg="white" opacity={85} roundedTop="md" roundedBottom="2xl" mt={1}>
              <AssetItem
                name="APT"
                descrp="APTOS Coin"
                amount={balance.aptBal}
                eqAmount={(balance.aptBal * 0).toFixed(2) + ' KES'}
              />
            </Box>
            <SectionHeader
              title="Transactions"
              actionText="See all"
              action={() => navigation.navigate('AllTxs')}
            />
            {transactions.length > 0 ? null : txIsLoading || ercIsLoading ? (
              <Spinner size="lg" />
            ) : (
              <NoItems
                title="No Transactions yet"
                message="Your transactions will show here."
                action={() => navigation.navigate('depositFunds')}
                actionText="Add funds"
              />
            )}
          </Box>
        }
        renderItem={({ item, index }) => (
          <Box
            bg="white"
            opacity={85}
            roundedTop={index === 0 ? '2xl' : 'md'}
            roundedBottom={index === transactions.length - 1 || index === 2 ? '2xl' : 'md'}
            mt={1}
            key={index}
          >
            <TransactionItem
              credited={item.credited}
              trTitle={item.title}
              trDate={item.date}
              spAmount={
                (item.credited ? '+' : '-') + (item.amount * 1).toFixed(2) + ' ' + item.token
              }
              eqAmount={
                item.token === 'cKES'
                  ? (item.amount * 1).toFixed(2) + ' KES'
                  : (item.amount * (item.token === 'CELO' ? 0 : 0)).toFixed(2) + ' KES'
              }
              screen="TxDetails"
              params={item}
            />
          </Box>
        )}
        //keyExtractor={(item) => item.id}
      />
    </Box>
  );
}
