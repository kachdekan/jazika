import { YStack, Button, Text, View, Spacer, Theme, H2 } from 'tamagui';

export default function WelcomeScreen({ navigation }) {
  const handleFn1 = async () => {};
  const handleFn = async () => {
    console.log('Called');
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
          onPress={() => navigation.navigate('signup')}
          fontWeight="bold"
        >
          Create New Account
        </Button>
        <Button
          variant="outlined"
          minWidth="75%"
          onPress={() => navigation.navigate('restore')}
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
