import { YStack, Text, XStack, Button, H3, H2, Spinner, Separator, Stack } from 'tamagui';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const FeatureHomeCard = ({
  color,
  bg,
  btn1,
  btn2,
  btn3,
  btn4,
  itemBottom,
  apprxBalance,
  balance,
}) => {
  const navigation = useNavigation();
  const bal = apprxBalance === 'isFetchingBal' ? [' ...', '..'] : apprxBalance.split('.');
  return (
    <YStack
      bg={bg}
      borderRadius="$6"
      borderBottomLeftRadius={itemBottom ? '$2' : '$4'}
      borderBottomRightRadius={itemBottom ? '$2' : '$4'}
      padding="$4"
    >
      <YStack gap="$-1">
        <Text fontSize="$5">Total Balance (KES)</Text>
        <XStack ai="flex-end">
          <H2 fontWeight="bold">Ks.</H2>
          <H2 fontWeight="bold">{' ' + bal[0] + '.'}</H2>
          <H3 fontWeight="bold">{bal[1]}</H3>
        </XStack>
        <Text fontSize="$5">
          ≈{' '}
          {apprxBalance === 'isFetchingBal'
            ? 'fetching balance...'
            : (+balance).toFixed(2) + ' USD'}
        </Text>
      </YStack>
      <Separator my="$3" />
      <XStack mx="$2" justifyContent="space-between">
        <YStack ai="center" gap="$2">
          <Button
            icon={btn1.icon}
            borderRadius="$10"
            variant="subtle"
            size="$5"
            bg={btn1.color}
            onPress={() => navigation.navigate(btn1.screen, btn1.screenParams)}
          />
          <Text fontSize="$4">{btn1.name}</Text>
        </YStack>
        <YStack ai="center" gap="$2">
          <Button
            icon={btn2.icon}
            borderRadius="$10"
            variant="subtle"
            size="$5"
            bg={btn2.color}
            onPress={() =>
              navigation.navigate(btn2.screen, btn2.params ? { ...btn2.params } : null)
            }
          />
          <Text fontSize="$4">{btn2.name}</Text>
        </YStack>
        <YStack ai="center" gap="$2">
          <Button
            icon={btn3.icon}
            borderRadius="$10"
            variant="subtle"
            size="$5"
            bg={btn3.color}
            onPress={() =>
              navigation.navigate(btn3.screen, btn3.params ? { ...btn3.params } : null)
            }
          />
          <Text fontSize="$4">{btn3.name}</Text>
        </YStack>
        <YStack ai="center" gap="$2">
          <Button
            icon={btn4.icon}
            borderRadius="$10"
            variant="subtle"
            size="$5"
            bg={btn4.color}
            onPress={() =>
              navigation.navigate(btn4.screen, btn4.params ? { ...btn4.params } : null)
            }
          />
          <Text fontSize="$4">{btn4.name}</Text>
        </YStack>
      </XStack>
    </YStack>
  );
};

export default FeatureHomeCard;
