import {
  Box,
  Text,
  Avatar,
  VStack,
  Button,
  HStack,
  Spacer,
  FormControl,
  Stack,
  Input,
  WarningOutlineIcon,
  Divider,
  CheckIcon,
  Select,
  ScrollView,
} from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoanAmountTenor } from '../../redux/spaces.slice';

export default function ApplyLoanStep1({ navigation, route }) {
  const [loanTerm, setLoanTerm] = useState(1);
  const [amount, setAmount] = useState(0);
  const [repay, setRepay] = useState(0);
  const dispatch = useDispatch();
  const loanTerms = [
    '1 month (7.5% interest)',
    '2 month (15% interest)',
    '3 month (22.5% interest)',
  ];

  return (
    <SafeAreaView flex={1}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        showsVerticalScrollIndicator={false}
      >
        <Box flex={1} bg="gray.300" alignItems="center">
          <Text fontSize="xl" color="black" fontWeight="bold" my={6}>
            Jazika Groups Loan
          </Text>
          <Box bg="white" flex={1} height="full" width="full" roundedTop="3xl" alignItems="center">
            <HStack space={2} mt={5}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Box
                  width="10%"
                  bg={index == 0 ? 'orange.400' : 'orange.200'}
                  minH={1}
                  rounded="2xl"
                  key={index}
                />
              ))}
            </HStack>
            <VStack space={3} width="90%" mt={8}>
              <Text fontSize="lg" fontWeight="medium" textAlign="left">
                Get a Loan
              </Text>
              <FormControl isRequired>
                <Stack>
                  <FormControl.Label>
                    <Text fontSize="md">Loan Amount</Text>
                  </FormControl.Label>
                  <Input
                    type="number"
                    placeholder="100"
                    size="lg"
                    py={3}
                    rounded="lg"
                    keyboardType="numeric"
                    onChangeText={(text) => setAmount(text * 1)}
                  />
                  <FormControl.HelperText>
                    <Text fontSize="sm">Limit: 100 - 10,000 cKES</Text>
                  </FormControl.HelperText>
                  <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                    Atleast 6 characters are required.
                  </FormControl.ErrorMessage>
                </Stack>
                <Stack mt={2}>
                  <FormControl.Label>
                    <Text fontSize="md">Duration</Text>
                  </FormControl.Label>
                  <Select
                    size="lg"
                    rounded="lg"
                    bg="white"
                    py={3}
                    accessibilityLabel="Choose a Loan term"
                    placeholder="1 month (7.5% interest)"
                    _selectedItem={{
                      bg: 'primary.600',
                      endIcon: <CheckIcon size={2} color="muted.200" />,
                    }}
                    mt="1"
                    onValueChange={(type) => {
                      setLoanTerm(type.split(' ')[0] * 1);
                      setRepay(amount + amount * (0.075 * type.split(' ')[0] * 1));
                    }}
                  >
                    {loanTerms.map((item, index) => (
                      <Select.Item label={item} value={item} key={index} />
                    ))}
                    <Select.Item label="" value="" key={4} />
                  </Select>

                  <FormControl.HelperText>
                    <Text fontSize="sm">You repay: {repay.toFixed(2)} cKES</Text>
                  </FormControl.HelperText>
                  <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                    Atleast 6 characters are required.
                  </FormControl.ErrorMessage>
                </Stack>
              </FormControl>
            </VStack>
            <Spacer />
            <HStack space={3} my="10">
              <Button
                variant="outline"
                rounded="3xl"
                borderWidth={1}
                borderColor="gray.400"
                pr="4"
                minW="25%"
                _text={{ color: 'black', fontWeight: 'semibold', mb: '0.5' }}
                onPress={() => navigation.goBack()}
              >
                Back
              </Button>
              <Button
                rounded="3xl"
                pr="4"
                bg="orange.300"
                minW="60%"
                isDisabled={amount == 0}
                _text={{ color: 'black', fontWeight: 'semibold', mb: '0.5' }}
                onPress={() => {
                  dispatch(
                    setLoanAmountTenor({
                      amount,
                      duration: loanTerm,
                    }),
                  );
                  navigation.navigate('appyLoanS2');
                }}
              >
                Continue
              </Button>
            </HStack>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
