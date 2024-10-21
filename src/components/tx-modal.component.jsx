import { Avatar, Sheet, Text, View, XStack, YStack, Separator } from 'tamagui';
import { ExternalLink } from '@tamagui/lucide-icons';
import { useState } from 'react';

const TxModal = ({ open, tx, setOpen }) => {
  const [position, setPosition] = useState(0);
  return (
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
                <Text fontSize="$6">{tx.title}</Text>
                <Text>{tx.date}</Text>
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
              {(tx.credited ? '+' : '-') + (tx.amount * 1).toFixed(2) + ' ' + tx.token}
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
  );
};

export default TxModal;
