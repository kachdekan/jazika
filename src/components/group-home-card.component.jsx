import {
  YStack,
  Text,
  XStack,
  Button,
  H3,
  H2,
  Spinner,
  Separator,
  Stack,
  Card,
  View,
} from 'tamagui';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight } from '@tamagui/lucide-icons';

const GroupHomeCard = ({
  color,
  bg,
  btn1,
  btn2,
  btn3,
  btn4,
  itemBottom,
  apprxBalance,
  balance,
  loans,
  savings,
}) => {
  const navigation = useNavigation();
  const bal = apprxBalance === 'isFetchingBal' ? [' ...', '..'] : apprxBalance.split('.');
  return (
    <YStack width="100%" gap="$1" mb="$3">
      <YStack
        bg={bg}
        borderRadius="$6"
        borderBottomLeftRadius={itemBottom ? '$3' : '$4'}
        borderBottomRightRadius={itemBottom ? '$3' : '$4'}
        padding="$4"
      >
        <YStack gap="$-1">
          <XStack justifyContent="space-between">
            <Text fontSize="$5">Total Balance (KES)</Text>
            <XStack
              bg="$gray4"
              padding="$2"
              px="$6"
              mt="$-4"
              mr="$-4"
              minWidth="30%"
              alignItems="center"
              borderTopRightRadius="$6"
              borderBottomLeftRadius="$6"
              borderWidth={2}
              borderTopWidth={0}
              borderColor="$gray4"
            >
              <Text fontSize="$6">Manage</Text>
              <ChevronRight size={20} mt="$1" ml="$1" mr="$-3" />
            </XStack>
          </XStack>
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
      </YStack>
      <YStack bg={bg} borderRadius="$6" borderTopLeftRadius="$3" borderTopRightRadius="$3">
        <XStack justifyContent="space-between" padding="$4">
          <Text fontSize="$6">Savings</Text>
          <XStack ai="center">
            <Text fontSize="$6">{savings.toFixed(2)} KES</Text>
            <ChevronRight size={20} />
          </XStack>
        </XStack>
        <Card
          elevate
          size="$4"
          backgroundColor="$gray4"
          borderRadius="$6"
          shadowColor="$gray10"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.25}
          shadowRadius={3}
        >
          <Card.Header>
            <XStack justifyContent="space-between">
              <Text fontSize="$6">Loans</Text>
              <XStack ai="center">
                <Text fontSize="$6">{loans.toFixed(2)} KES</Text>
                <ChevronRight size={20} />
              </XStack>
            </XStack>
          </Card.Header>
          <XStack p="$4" pt="$2" justifyContent="space-between" borderRadius="$6">
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
        </Card>
      </YStack>
    </YStack>
  );
};

export default GroupHomeCard;
