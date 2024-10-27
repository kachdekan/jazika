import { YStack, Button, Text, View, Spacer, Theme, H2 } from 'tamagui';
import { generateAddresses } from '../../../scripts';
import { createAccount, sign } from 'jzk/services';

export default function WelcomeScreen({ navigation }) {
  const handleFn1 = async () => {
    const account = await createAccount('+2547123783544', 'very-uniquire-uid2');
    console.log(account);
  };
  const handleFn = async () => {
    console.log('Called');
    const samplePayload = new Array(32);
    for (let i = 0; i < samplePayload.length; i++) {
      samplePayload[i] = Math.floor(Math.random() * 255);
    }
    const res = await sign('easycoin8945.testnet', samplePayload, 'jazika/1');
    console.log('signature', res);
    //console.log(tx);
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
