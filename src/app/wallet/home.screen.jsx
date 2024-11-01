import { useState, useCallback, useEffect } from 'react';
import { YStack, ScrollView, Spinner } from 'tamagui';
import { RefreshControl } from 'react-native';
import {
  FeatureHomeCard,
  TransactionItem,
  TransactionModal,
  SectionHeader,
  AssetItem,
  NoItems,
} from 'jzk/components';
import { useSelector, useDispatch } from 'react-redux';
import { CircleDollarSign, ArrowBigRightDash, ArrowBigDownDash, Menu } from '@tamagui/lucide-icons';
import { txData } from 'jzk/utils/data';
import { getBalance } from 'jzk/services/wallet.service';
import celo from 'jzk/services/celo.service';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();

  const { account, addresses } = useSelector((state) => state.wallet.userDetails);
  const [balance, setBalance] = useState({
    ETHBal: 0.0,
    BTCBal: 0.0,
    CELOBal: 0,
    NEARBal: 0,
    USDTBal: 0,
    CKESBal: 0,
    balUSD: 0,
    otherUSD: 0,
  });
  const [showMore, setShowMore] = useState(false);
  const [open, setOpen] = useState(false);
  const [txDetails, setTxDetails] = useState({});

  const [transactions, setTransactions] = useState(txData);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingBal, setIsLoadingBal] = useState(false);
  const [txIsLoading, setTxIsLoading] = useState(false);
  const [ercIsLoading, setErcIsLoading] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleBalances();
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const handleBalances = async () => {
    setIsLoadingBal(true);
    try {
      const nearBal = await getBalance(account.accountId);
      const celoBalances = await celo.getAllBalances(addresses[1].address);
      const balInUSD =
        nearBal * 4.28 + celoBalances.CELO * 0.6569 + celoBalances.CKES * 0.0078 + 7.3601;
      const otherUSD = balInUSD - celoBalances.CKES * 0.0078; //Plus usdt
      const bal = {
        ...balance,
        NEARBal: nearBal * 1,
        CELOBal: celoBalances.CELO * 1,
        CKESBal: celoBalances.CKES * 1,
        balUSD: balInUSD,
        otherUSD: otherUSD,
      };
      //console.log(bal);
      setBalance(bal);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingBal(false);
    }
  };
  return (
    <YStack flex={1} bg="$inverse" ai="center">
      <ScrollView
        width="95%"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <YStack mt="$3">
          <FeatureHomeCard
            color="$gray12"
            bg="$background"
            balance={balance.balUSD.toFixed(2)}
            apprxBalance={isLoadingBal ? 'isFetchingBal' : (balance.balUSD * 129.98).toFixed(2)}
            btn1={{
              icon: <CircleDollarSign size={30} />,
              color: '$green4',
              name: 'Deposit',
              screen: 'depositFunds',
            }}
            btn2={{
              icon: <ArrowBigRightDash size={30} />,
              color: '$orange4',
              name: 'Transfer',
              screen: 'transferFunds',
              params: balance,
            }}
            btn3={{
              icon: <ArrowBigDownDash size={30} />,
              color: '$red4',
              name: 'Withdraw',
              screen: 'withdrawFunds',
              params: balance,
            }}
            btn4={{
              icon: <Menu size={30} />,
              color: '$blue4',
              name: 'More',
              screen: 'withdrawFunds',
              params: balance,
            }}
            itemBottom={true}
          />
          <SectionHeader
            title="Assets"
            actionText={showMore ? 'Show less' : 'See all'}
            action={() => setShowMore(!showMore)}
          />
          <YStack bg="$background" opacity={0.85} borderRadius="$4" mt="$1">
            <AssetItem
              name="Shillings"
              descrp="Celo KE Shilling"
              amount={balance.CKESBal}
              eqAmount={(balance.CKESBal * 1).toFixed(2) + ' KES'}
            />
          </YStack>
          <YStack bg="$background" opacity={0.85} borderRadius="$4" mt="$1">
            <AssetItem
              name="Dollars"
              descrp="Tether USD"
              amount={balance.USDTBal}
              eqAmount={(balance.USDTBal * 129.98).toFixed(2) + ' KES'}
            />
          </YStack>
          {showMore ? (
            <>
              <YStack bg="$background" opacity={0.85} borderRadius="$4" mt="$1">
                <AssetItem
                  name="BTC"
                  descrp="Bitcoin"
                  amount={balance.BTCBal}
                  eqAmount={(balance.BTCBal * 9224152.75).toFixed(2) + ' KES'}
                />
              </YStack>
              <YStack bg="$background" opacity={0.85} borderRadius="$4" mt="$1">
                <AssetItem
                  name="ETH"
                  descrp="Aurora ETH"
                  amount={balance.ETHBal}
                  eqAmount={(balance.ETHBal * 343732.28).toFixed(2) + ' KES'}
                />
              </YStack>
              <YStack bg="$background" opacity={0.85} borderRadius="$4" mt="$1">
                <AssetItem
                  name="NEAR"
                  descrp="NEAR Protocol"
                  amount={balance.NEARBal}
                  eqAmount={(balance.NEARBal * 556.31).toFixed(2) + ' KES'}
                />
              </YStack>
              <YStack bg="$background" opacity={0.85} borderRadius="$4" mt="$1">
                <AssetItem
                  name="CELO"
                  descrp="Celo"
                  amount={balance.CELOBal}
                  eqAmount={(balance.CELOBal * 85.38).toFixed(2) + ' KES'}
                />
              </YStack>
            </>
          ) : (
            <YStack
              bg="$background"
              opacity={0.85}
              borderRadius="$4"
              mt="$1"
              onPress={() => setShowMore(!showMore)}
            >
              <AssetItem
                name="More Assets"
                descrp="All your assets"
                amount={balance.otherUSD}
                eqAmount={(balance.otherUSD * 129.98).toFixed(2) + ' KES'}
              />
            </YStack>
          )}
          <SectionHeader
            title="Transactions"
            actionText="See all"
            action={() => navigation.navigate('AllTxs')}
          />
          {transactions.length > 0 ? null : txIsLoading || ercIsLoading ? (
            <Spinner size="large" />
          ) : (
            <NoItems
              title="No Transactions yet"
              message="Your transactions will show here."
              action={() => navigation.navigate('depositFunds')}
              actionText="Add funds"
            />
          )}
          {transactions.slice(0, 3).map((item, index) => (
            <YStack
              key={index}
              bg="$background"
              opacity={0.85}
              borderRadius="$4"
              mt="$1"
              onPress={() => {
                setTxDetails(item), setOpen(true);
              }}
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
                    : (item.amount * (item.token === 'CELO' ? 0 : 556.31)).toFixed(2) + ' KES'
                }
                screen="TxDetails"
                params={item}
              />
            </YStack>
          ))}
        </YStack>
        <TransactionModal open={open} setOpen={setOpen} tx={txDetails} />
      </ScrollView>
    </YStack>
  );
}
