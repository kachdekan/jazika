import { Text, Button, Avatar, XStack, YStack, View } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { ChevronDown } from '@tamagui/lucide-icons';

const AssetLogos = {
  Shillings: 'https://assets.coingecko.com/coins/images/29789/standard/kag-currency-ticker.png',
  Dollars: 'https://assets.coingecko.com/coins/images/325/standard/Tether.png',
  NEAR: 'https://assets.coingecko.com/coins/images/10365/standard/near.jpg',
  ETH: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png',
  BTC: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png',
  AURORA: 'https://assets.coingecko.com/coins/images/20582/standard/aurora.jpeg',
  CELO: 'https://assets.coingecko.com/coins/images/11090/standard/Celo.png',
};

const AssetItem = (props) => {
  const navigation = useNavigation();
  const title = props.name.split(' ');
  const initials =
    title.length > 1
      ? title[0].slice(0, 1) +
        (title[1].slice(0, 2).toUpperCase() === 'CU' ? '$' : title[1].slice(0, 1).toUpperCase())
      : title[0].slice(0, 2).toUpperCase();
  const [view, setView] = useState(false);
  return (
    <XStack gap="$4" my="$2" mx="$2" alignItems="center">
      {props.name === 'More Assets' ? (
        <XStack gap="$4">
          <View maxHeight="$4" minWidth="$4" maxWidth="$4">
            <Avatar circular size="$3.5" ml="$3" mt="$-1">
              <Avatar.Image source={{ uri: AssetLogos['NEAR'] }} />
              <Avatar.Fallback bg="$gray8" />
            </Avatar>
            <Avatar circular size="$2.5" mt="$-5">
              <Avatar.Image source={{ uri: AssetLogos['BTC'] }} />
              <Avatar.Fallback bg="$gray8" />
            </Avatar>
            <Avatar circular size="$1.5" ml="$6" mt="$-5" zIndex="$1">
              <Avatar.Image source={{ uri: AssetLogos['AURORA'] }} />
              <Avatar.Fallback bg="$gray8" />
            </Avatar>
          </View>
          <XStack justifyContent="space-between" width="82%" alignItems="center">
            <XStack alignItems="center">
              <Text fontSize="$7">More Assets</Text>
              <ChevronDown mt="$1" />
            </XStack>
            <YStack mr={2}>
              <Text fontSize="$7" textAlign="right" fontWeight="bold">
                ${props.amount.toFixed(2)}
              </Text>
              <Text color="blueGray.800" textAlign="right">
                {props.eqAmount}
              </Text>
            </YStack>
          </XStack>
        </XStack>
      ) : (
        <XStack gap="$3">
          <Avatar circular ml="$2">
            <Avatar.Image source={{ uri: AssetLogos[props.name] }} />
            <Avatar.Fallback bg="$gray8" />
          </Avatar>
          <XStack justifyContent="space-between" width="81.5%" mt="$-0.5">
            <YStack>
              <Text fontSize="$6" fontWeight="bold">
                {props.name}
              </Text>
              <Text>{props.descrp}</Text>
            </YStack>
            <YStack mr={2}>
              <Text fontSize="$7" fontWeight="bold" textAlign="right">
                {props.amount.toFixed(2)}
              </Text>
              <Text color="blueGray.800" textAlign="right">
                {props.eqAmount}
              </Text>
            </YStack>
          </XStack>
        </XStack>
      )}
    </XStack>
  );
};

export default AssetItem;
