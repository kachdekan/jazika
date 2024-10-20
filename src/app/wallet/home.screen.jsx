import { useState, useCallback, useEffect } from 'react';
import {
  YStack,
  Text,
  Button,
  ScrollView,
  Spinner,
  Sheet,
  XStack,
  Avatar,
  Separator,
  View,
} from 'tamagui';
import { RefreshControl } from 'react-native';
import {
  FeatureHomeCard,
  TransactionItem,
  SectionHeader,
  AssetItem,
  NoItems,
} from 'jzk/components';
import { useSelector, useDispatch } from 'react-redux';
import {
  CircleDollarSign,
  ArrowBigRightDash,
  ArrowBigDownDash,
  Menu,
  ChevronRight,
  ReceiptText,
  ExternalLink,
  X,
} from '@tamagui/lucide-icons';
import { txData } from 'jzk/utils/data';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const [balance, setBalance] = useState({
    aptBal: 0,
    jkesBal: 0,
    balUSD: 9100,
  });
  const [showMore, setShowMore] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState(0);
  const [txDetails, setTxDetails] = useState({});

  const [transactions, setTransactions] = useState(txData);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingBal, setIsLoadingBal] = useState(false);
  const [txIsLoading, setTxIsLoading] = useState(false);
  const [ercIsLoading, setErcIsLoading] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);
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
            apprxBalance={isLoadingBal ? 'isFetchingBal' : (balance.balUSD * 1).toFixed(2)}
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
              descrp="Jazika Shilling"
              amount={balance.jkesBal}
              eqAmount={(balance.jkesBal * 1).toFixed(2) + ' KES'}
            />
          </YStack>
          <YStack bg="$background" opacity={0.85} borderRadius="$4" mt="$1">
            <AssetItem
              name="Dollars"
              descrp="Tether USD"
              amount={balance.aptBal}
              eqAmount={(balance.aptBal * 0).toFixed(2) + ' KES'}
            />
          </YStack>
          {showMore ? (
            <>
              <YStack bg="$background" opacity={0.85} borderRadius="$4" mt="$1">
                <AssetItem
                  name="BTC"
                  descrp="Bitcoin"
                  amount={balance.aptBal}
                  eqAmount={(balance.aptBal * 0).toFixed(2) + ' KES'}
                />
              </YStack>
              <YStack bg="$background" opacity={0.85} borderRadius="$4" mt="$1">
                <AssetItem
                  name="ETH"
                  descrp="Ethereum"
                  amount={balance.aptBal}
                  eqAmount={(balance.aptBal * 0).toFixed(2) + ' KES'}
                />
              </YStack>
              <YStack bg="$background" opacity={0.85} borderRadius="$4" mt="$1">
                <AssetItem
                  name="NEAR"
                  descrp="NEAR Protocol"
                  amount={balance.aptBal}
                  eqAmount={(balance.aptBal * 0).toFixed(2) + ' KES'}
                />
              </YStack>
              <YStack bg="$background" opacity={0.85} borderRadius="$4" mt="$1">
                <AssetItem
                  name="AURORA"
                  descrp="Aurora"
                  amount={balance.aptBal}
                  eqAmount={(balance.aptBal * 0).toFixed(2) + ' KES'}
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
                amount={balance.aptBal}
                eqAmount={(balance.aptBal * 0).toFixed(2) + ' KES'}
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
                    : (item.amount * (item.token === 'CELO' ? 0 : 0)).toFixed(2) + ' KES'
                }
                screen="TxDetails"
                params={item}
              />
            </YStack>
          ))}
        </YStack>
        <Sheet
          modal
          open={open}
          onOpenChange={setOpen}
          snapPoints={[45]}
          position={position}
          onPositionChange={setPosition}
          dismissOnSnapToBottom
        >
          <Sheet.Overlay />
          <Sheet.Frame>
            <Sheet.Handle bg="$gray6" mt="$4" width="$10" alignSelf="center" />
            <YStack gap="$4" px="$6" py="$2">
              <XStack gap="$3">
                <Avatar circular>
                  <Avatar.Image
                    source={{
                      uri: 'https://assets.coingecko.com/coins/images/10365/standard/near.jpg',
                    }}
                  />
                  <Avatar.Fallback bg="$gray8" />
                </Avatar>
                <XStack justifyContent="space-between" width="84%" mt="$-0.5" alignItems="center">
                  <YStack>
                    <Text fontSize="$6">{txDetails.title}</Text>
                    <Text>{txDetails.date}</Text>
                  </YStack>
                  <View padding="$2" onPress={() => console.log('Check Scan')}>
                    <ExternalLink size={28} color="$gray10" />
                  </View>
                </XStack>
              </XStack>
              <Separator />
              {/* User Icon */}
              <YStack alignItems="center" paddingVertical="$2">
                <Text fontSize="$9" fontWeight="medium">
                  {(txDetails.credited ? '+' : '-') +
                    (txDetails.amount * 1).toFixed(2) +
                    ' ' +
                    txDetails.token}
                </Text>
                <Text color="$gray11" fontSize="$6">
                  ≈ 0.00 KES
                </Text>
              </YStack>
              <Separator />
              {/* Address Display */}
              <YStack gap="$2">
                <XStack justifyContent="space-between">
                  <Text fontSize="$5" color="$gray12">
                    From
                  </Text>
                  <Text
                    fontSize="$5"
                    color="$gray12"
                    textAlign="right"
                    onPress={() => console.log('Address')}
                  >
                    0x1234...7890
                  </Text>
                </XStack>
                <XStack justifyContent="space-between">
                  <Text fontSize="$5" color="$gray12">
                    Platform Fee
                  </Text>
                  <Text fontSize="$5" color="$gray12" textAlign="right">
                    10.00 KES
                  </Text>
                </XStack>
                <XStack justifyContent="space-between">
                  <Text fontSize="$5" color="$gray12">
                    Network Fee
                  </Text>
                  <Text fontSize="$5" color="$gray12" textAlign="right">
                    2.00 KES
                  </Text>
                </XStack>
                <XStack justifyContent="space-between">
                  <Text fontSize="$5" color="$gray12">
                    Tx Hash
                  </Text>
                  <Text
                    fontSize="$5"
                    color="$gray12"
                    textAlign="right"
                    onPress={() => console.log('Tx Hash')}
                  >
                    0x1234ff...7890ff
                  </Text>
                </XStack>
              </YStack>
            </YStack>
          </Sheet.Frame>
        </Sheet>
      </ScrollView>
    </YStack>
  );
}
