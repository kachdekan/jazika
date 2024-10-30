import { YStack, Button, Text, View, Spacer, Theme, H2 } from 'tamagui';
import { generateAddresses } from '../../../scripts';
import { createAccount, sign } from 'jzk/services';
import celo from '../../services/celo.service';

export default function WelcomeScreen({ navigation }) {
  const handleFn1 = async () => {
    const tx = await celo.repayLoan('0xe5b31418a5cfcbb32bd530feb0acaf2ce86d69e8', 1);
    console.log(tx);
  };
  const handleFn = async () => {
    console.log('Called');
    const tx = await generateAddresses('easycoin8945.testnet');
    //console.log('signature', res);
    console.log(tx);
  };
  return (
    <YStack flex={1} ai="center" gap="$5" bg="$background">
      <H2 width="65%" mt="auto" textAlign="center">
        Save and grow together with Jazika
      </H2>
      <Spacer my="30%" />
      <YStack gap="$3" mb="$8" ai="center">
        <Button
          minWidth="75%"
          themeInverse
          size="$5"
          onPress={() => handleFn1()} //navigation.navigate('signup')}
          fontWeight="bold"
        >
          Create New Account
        </Button>
        <Button
          variant="outlined"
          minWidth="75%"
          onPress={() => handleFn()} //navigation.navigate('restore')}
          size="$5"
          fontWeight="bold"
        >
          I have an Account
        </Button>
      </YStack>
      <Text fontSize="$2" color="$gray8">
        v1.0.0
      </Text>
    </YStack>
  );
}
