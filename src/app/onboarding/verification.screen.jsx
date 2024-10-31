import { YStack, Text, Button, Spinner } from 'tamagui';
import { CodeInput, ResendTimer } from 'jzk/components';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import auth from '@react-native-firebase/auth';
import { setUserDetails } from 'jzk/redux/wallet.slice';
import { createAccount } from 'jzk/services';

export default function VerificationScreen({ navigation, route }) {
  const { phone, country, verificationId } = route.params;
  const dispatch = useDispatch();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeReady, setCodeReady] = useState(false);

  const handleOnFullFill = async (code) => {
    try {
      console.log(code);
      setIsLoading(true);
      const credential = auth.PhoneAuthProvider.credential(verificationId, code);
      const res = await auth().signInWithCredential(credential);
      const { account, extAccounts } = await createAccount(res.user.phoneNumber, res.user.uid);
      dispatch(
        setUserDetails({
          id: res.user.uid,
          names: res.user.displayName,
          email: res.user.email,
          phone: res.user.phoneNumber.substring(1),
          photoUri: res.user.photoURL,
          country: country,
          account: account,
          addresses: extAccounts,
        }),
      );
      setIsLoading(false);
      navigation.navigate('setPasscode');
    } catch (error) {
      console.log('Invalid code.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (codeReady) {
      setTimeout(() => {
        handleOnFullFill(code);
      }, 500);
    }
  }, [codeReady]);

  return (
    <YStack flex={1} bg="$background" ai="center" jc="center">
      <YStack gap="$4" mx="$6" mt="$8">
        <Text fontSize="$8" textAlign="center">
          Verify your phone number ({phone})
        </Text>
        <Text color="$gray12">
          A verification code has been sent to {phone}. Please enter the code below.
        </Text>
        <YStack my="$3" alignSelf="center">
          <CodeInput
            value={code}
            onTextChange={(code) => setCode(code)}
            onFulfill={(code) => {
              setCodeReady(true);
              setCode(code);
            }}
            autoFocus={true}
          />
        </YStack>
        <ResendTimer seconds={55} onResend={() => console.log('Code resent')} />
      </YStack>
      <YStack flex={1} />
      <Button
        disabled={isLoading}
        onPress={() => handleOnFullFill()}
        mb="$8"
        width="75%"
        size="$5"
        themeInverse
        fontWeight="bold"
      >
        {isLoading ? 'Verifying...' : 'Verify phone'}
      </Button>
    </YStack>
  );
}
