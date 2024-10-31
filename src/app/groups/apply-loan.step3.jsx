import {
  Box,
  Text,
  Avatar,
  VStack,
  Button,
  HStack,
  Spacer,
  Radio,
  FormControl,
  Stack,
  Input,
  WarningOutlineIcon,
  ScrollView,
} from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLoanInstalments } from '../../redux/spaces.slice';
export default function ApplyLoanStep5({ navigation }) {
  const [frequency, setFrequency] = useState('');
  const dispatch = useDispatch();
  const { amount, interest, duration } = useSelector((state) => state.spaces.loanRequest);
  const numberOfInstallments = {
    Daily: 30 * duration,
    Weekly: 4 * duration,
    Monthly: 1 * duration,
  };
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
                  bg={index == 2 ? 'orange.400' : 'orange.200'}
                  minH={1}
                  rounded="2xl"
                  key={index}
                />
              ))}
            </HStack>
            <VStack space={3} width="90%" mt={8}>
              <Text fontSize="lg" fontWeight="medium" textAlign="left">
                Payment Frequency
              </Text>
              <Radio.Group
                defaultValue="Daily"
                name="myRadioGroup"
                accessibilityLabel="Pick your favorite number"
                value={frequency}
                onChange={(nextValue) => {
                  setFrequency(nextValue);
                }}
              >
                <Radio value="Daily" my={3}>
                  <Text fontSize="md">
                    Daily ({((amount + interest) / numberOfInstallments['Daily']).toFixed(2)} KES)
                  </Text>
                </Radio>
                <Radio value="Weekly" my={3}>
                  <Text fontSize="md">
                    Weekly ({((amount + interest) / numberOfInstallments['Weekly']).toFixed(2)} KES)
                  </Text>
                </Radio>
                <Radio value="Monthly" my={3}>
                  <Text fontSize="md">
                    Monthy ({((amount + interest) / numberOfInstallments['Monthly']).toFixed(2)}{' '}
                    KES)
                  </Text>
                </Radio>
              </Radio.Group>
            </VStack>
            <Spacer />
            <HStack space={3} mb="10">
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
                isDisabled={!frequency}
                bg="orange.300"
                minW="60%"
                _text={{ color: 'black', fontWeight: 'semibold', mb: '0.5' }}
                onPress={() => {
                  dispatch(setLoanInstalments({ freqency: frequency }));
                  navigation.navigate('appyLoanS4');
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
