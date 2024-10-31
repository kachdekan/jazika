import {
  Box,
  Text,
  Avatar,
  VStack,
  Button,
  HStack,
  Spacer,
  Checkbox,
  useDisclose,
  ScrollView,
} from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import ConfirmationModal from './confirmation.modal';
import { useSelector, useDispatch } from 'react-redux';
import { utils } from 'ethers';
import celo from 'jzk/services/celo.service';
import { getRoscaData } from 'jzk/redux/spaces.slice';

export default function ApplyLoanStep7({ navigation }) {
  const thisAddress = useSelector((state) => state.wallet.userDetails.addresses[1].address);
  const dispatch = useDispatch();
  const loanRequest = useSelector((s) => s.spaces.loanRequest);
  const [isLoading, setIsLoading] = useState(false);
  const [accept, setAccept] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { isOpen, onOpen, onClose } = useDisclose();

  //console.log(loanData);

  const handleLoanRequest = async () => {
    setIsLoading(true);
    try {
      //const mGroupId = await getMemberGroupId(thisAddress);
      const result = await celo.requestLoan(thisAddress, loanRequest.amount);
      console.log(result);

      setIsSuccess(true);
      setTimeout(() => {
        setIsLoading(false);
        dispatch(getRoscaData(thisAddress));
        onOpen();
      }, 1000);
    } catch (error) {
      setIsSuccess(false);
      setErrorMessage(error.message);
    } finally {
      onOpen();
      setIsLoading(false);
    }
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
                  bg={index == 4 ? 'orange.400' : 'orange.200'}
                  minH={1}
                  rounded="2xl"
                  key={index}
                />
              ))}
            </HStack>
            <VStack space={3} width="90%" mt={8}>
              <Text fontSize="lg" fontWeight="medium" textAlign="left">
                Accept Loan terms
              </Text>
              <HStack space={2} width="85%">
                <Checkbox onChange={setAccept} value={true} accessibilityLabel="Accept loan terms">
                  <Text fontSize="lg">
                    I understand that I have to repay this loan. If I don’t repay, it may result in
                    negative consequences, including but not limited to damage to my credit score,
                    legal action, or collection activities.
                  </Text>
                </Checkbox>
              </HStack>
            </VStack>
            <Spacer />
            <ConfirmationModal
              isOpen={isOpen}
              onClose={onClose}
              message={`Loan Request Failed! \n${errorMessage}`}
              screen={'Groups'}
              scrnOptions={{ isSuccess }}
            />
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
                isDisabled={!accept}
                pr="4"
                isLoading={isLoading}
                bg="orange.300"
                minW="60%"
                _text={{ color: 'black', fontWeight: 'semibold', mb: '0.5' }}
                onPress={() => handleLoanRequest()}
              >
                Yes, I accept
              </Button>
            </HStack>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
