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
  ScrollView,
} from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';

export default function ApplyLoanStep4({ navigation }) {
  const dispatch = useDispatch();
  const [guarantor1, setGuarantor1] = useState('');
  const [guarantor2, setGuarantor2] = useState('');

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
                  bg={index == 1 ? 'orange.400' : 'orange.200'}
                  minH={1}
                  rounded="2xl"
                  key={index}
                />
              ))}
            </HStack>
            <VStack space={3} width="90%" mt={8}>
              <Text fontSize="lg" fontWeight="medium" textAlign="left">
                Enter your guarantors
              </Text>
              <FormControl isInvalid={!guarantor1.length > 9}>
                <FormControl.Label>
                  <Text fontSize="lg">Guarantor 1</Text>
                </FormControl.Label>
                <Input
                  type="number"
                  placeholder="0712345678"
                  size="xl"
                  py={3}
                  rounded="lg"
                  keyboardType="numeric"
                  onChangeText={(text) => setGuarantor1(text)}
                />
                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                  Guarantor not found!
                </FormControl.ErrorMessage>
                <FormControl.HelperText>
                  <Text fontSize="sm">Guarantor 1 phone number</Text>
                </FormControl.HelperText>
              </FormControl>
              <FormControl isRequired isInvalid={!guarantor2.length > 9}>
                <Stack mt={2}>
                  <FormControl.Label>
                    <Text fontSize="lg">Guarantor 2</Text>
                  </FormControl.Label>
                  <Input
                    type="number"
                    placeholder="0712345678"
                    size="xl"
                    py={3}
                    rounded="lg"
                    keyboardType="numeric"
                    onChangeText={(text) => setGuarantor2(text)}
                  />
                  <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                    Guarantor not found!
                  </FormControl.ErrorMessage>
                  <FormControl.HelperText>
                    <Text fontSize="sm">Guarantor 2 phone number</Text>
                  </FormControl.HelperText>
                </Stack>
              </FormControl>
            </VStack>
            <Spacer />
            <HStack space={3} mb="10" mt={10}>
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
                isDisabled={!(guarantor1.length > 9 && guarantor2.length > 9)}
                minW="60%"
                _text={{ color: 'black', fontWeight: 'semibold', mb: '0.5' }}
                onPress={() => {
                  //handleGuarantors();
                  navigation.navigate('appyLoanS3');
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
