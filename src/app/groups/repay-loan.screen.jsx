import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Text,
  HStack,
  VStack,
  Input,
  Button,
  Icon,
  Pressable,
  Divider,
  Spacer,
  useDisclose,
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { Octicons } from '@expo/vector-icons';
import { SuccessModal } from 'jzk/components';
import { utils } from 'ethers';
import celo from 'jzk/services/celo.service';
import { getRoscaData } from 'jzk/redux/spaces.slice';

export default function RepayLoanScreen({ navigation, route }) {
  const { loan } = route.params;
  const { isOpen, onOpen, onClose } = useDisclose();
  const thisAddress = useSelector((state) => state.wallet.userDetails.addresses[1].address);
  const [loanBal, setLoanBal] = useState(0);
  const [tokenBal, setTokenBal] = useState(0);
  const [amount, setAmount] = useState('');
  const [isKES, setIsKES] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const amtInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const getBal = async () => {
      const bal = await celo.getMemberLoanBalance(thisAddress);
      setLoanBal(utils.formatUnits(bal, 18));
      const ckesBal = await celo.getBalance(thisAddress, 'CKES');
      setTokenBal(ckesBal);
    };
    getBal();
  }, []);

  const handleRepayment = async () => {
    console.log('Repaying loan', amount);
    setIsLoading(true);
    try {
      const result = await celo.repayLoan(thisAddress, amount);
      setTimeout(() => {
        setIsSuccess(true);
        dispatch(getRoscaData(thisAddress));
        setIsLoading(false);
        onOpen(), 500;
      });
    } catch (e) {
      console.log('Error repaying loan', e);
      setIsSuccess(false);
      setIsLoading(false);
      setErrorMessage(e.message);
      onOpen();
    }
  };

  const updateAmt = (perc) => {
    const amt = ((loanBal * perc) / 100).toFixed(2);
    setAmount(amt.toString());
  };

  return (
    <Box flex={1} bg="white" alignItems="center">
      <Text fontSize="xl" m="4" width="75%" alignSelf="flex-start">
        Repay your loan from Jazika
      </Text>
      <Text fontSize="lg" mx="12%" width="65%" alignSelf="flex-start">
        Balance: {(loanBal * 1).toFixed(2)} KES
      </Text>
      <VStack space={1} w="85%">
        <HStack mt={6} justifyContent="space-between" alignItems="center">
          <Input
            position="absolute"
            alignSelf="center"
            right="25%"
            width="50%"
            variant="unstyled"
            placeholder=""
            size="2xl"
            textAlign="center"
            style={{ color: 'white' }}
            mt={2}
            caretHidden={true}
            autoFocus={true}
            ref={amtInputRef}
            keyboardType="numeric"
            value={amount}
            onChangeText={(text) => setAmount(text)}
          />
          <Pressable onPress={() => amtInputRef.current.focus()} width="70%">
            <Text fontSize="4xl" fontWeight="medium" textAlign="center">
              {isKES ? <Text color="muted.500">KSh. </Text> : null}
              {amount ? amount : '0'} {isKES ? null : <Text color="muted.500">USD</Text>}
            </Text>
          </Pressable>
          <Pressable alignItems="center" onPress={() => setIsKES(!isKES)}>
            <Icon as={Octicons} name="sync" size="md" color="primary.600" />
            <Text fontSize="md" color="primary.600">
              {isKES ? 'KES' : 'USD'}
            </Text>
          </Pressable>
        </HStack>
        <Divider width="85%" alignSelf="center" my={2} />
        <Text fontSize="md" alignSelf="flex-start" ml="5%">
          Pay {amount ? amount + (isKES ? ' KES' : ' USD') : '0.00'} from {tokenBal} cKES
        </Text>
        <HStack bg="#fff" roundedTop="md" roundedBottom="2xl" justifyContent="space-between" mt="2">
          <Button rounded="lg" variant="subtle" minW="22%" onPress={() => updateAmt(25)}>
            25%
          </Button>
          <Button rounded="lg" variant="subtle" minW="22%" onPress={() => updateAmt(50)}>
            50%
          </Button>
          <Button rounded="lg" variant="subtle" minW="22%" onPress={() => updateAmt(75)}>
            75%
          </Button>
          <Button rounded="lg" variant="subtle" minW="22%" onPress={() => updateAmt(100)}>
            100%
          </Button>
        </HStack>
      </VStack>
      <Spacer />
      <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
        message={
          isSuccess
            ? `Loan has been successfully! \nAmount ${amount} cKES`
            : `Request failed gracefully! \n${errorMessage}`
        }
        screen="Groups"
        scrnOptions={{ isSuccess }}
      />
      <Button
        bg="primary.600"
        colorScheme="primary"
        isDisabled={!amount || amount * 1 > tokenBal * 1}
        isLoading={isLoading}
        width="75%"
        rounded="3xl"
        my={8}
        mb={20}
        _text={{ fontWeight: 'semibold', mb: '0.5' }}
        onPress={() => handleRepayment()} //navigation.navigate('applyFromLoanPool')}
      >
        Continue
      </Button>
    </Box>
  );
}
