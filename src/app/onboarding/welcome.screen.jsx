import { Box, VStack, Button, Heading, Spacer, Text } from 'native-base';

export default function WelcomeScreen({ navigation }) {
  return (
    <Box flex={1} bg="#fff" alignItems="center" justifyContent="flex-end">
      <Box width="65%" mt="3/4">
        <Heading textAlign="center" color="coolGray.700">
          Save and grow together with Jazika
        </Heading>
      </Box>
      <Spacer />
      <VStack alignItems="center" space={3} mb="10">
        <Button
          pr="4"
          minW="75%"
          _text={{ fontWeight: 'semibold', mb: '0.5' }}
          onPress={() => navigation.navigate('signup')}
          bg="primary.800"
        >
          Create New Account
        </Button>
        <Button
          variant="subtle"
          pr="4"
          minW="75%"
          _text={{ color: 'coolGray.800', fontWeight: 'semibold', mb: '0.5' }}
          onPress={() => navigation.navigate('restore')}
        >
          I have an Account
        </Button>
      </VStack>
      <Text fontSize="sm" color="muted.300">
        v1.0.0
      </Text>
    </Box>
  );
}