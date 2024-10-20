import { YStack, XStack, Spinner, Text, Button } from 'tamagui';
import { useEffect, useState } from 'react';
import { CodeInput } from 'jzk/components';
import { PIN_BLOCKLIST } from 'jzk/config';
import { useDispatch, useSelector } from 'react-redux';
import { setUserToken, userToken } from 'jzk/services';
import { addUserDetailsToken } from 'jzk/redux/wallet.slice';

export default function SetPasscodeScreen({ navigation }) {
  const dispatch = useDispatch();
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCodeReady, setIsCodeReady] = useState(false);

  const onFullCode1 = (code) => {
    if (isPinValid(code)) {
      setIsVerifying(true);
      console.log('Pin is Valid');
    } else {
      console.log('Pin is Invalid');
      setCode1('');
    }
  };

  const onFullCode2 = (code) => {
    if (code1 === code) {
      console.log('Pin session is done');
      setCode1('');
      if (code2) setUserToken(code2);
      setCode2('');
      setIsVerifying(false);
      if (userToken) {
        setIsLoading(false);
        dispatch(addUserDetailsToken(userToken));
        console.log(userToken);
      }
    } else {
      setIsLoading(false);
      console.log('Pin does not match');
      setCode2('');
    }
  };

  useEffect(() => {
    if (isCodeReady) {
      setTimeout(() => {
        onFullCode2(code2);
      }, 500);
    }
  }, [isCodeReady]);

  return (
    <YStack flex={1} bg="$background" justifyContent="center">
      {isLoading ? (
        <YStack gap="$3" alignItems="center">
          <Spinner size="$2" color="gray" />
          <Text fontSize="$6">Setting up Account...</Text>
        </YStack>
      ) : (
        <>
          {isVerifying ? (
            <YStack gap="$4" mx="$6" m="$8">
              <Text fontSize="$8">Re-enter the passcode</Text>
              <Text fontSize="$5">Please input the passcode again to confirm.</Text>
              <CodeInput
                value={code2}
                autoFocus={true}
                password={true}
                onTextChange={(code) => setCode2(code)}
                onFulfill={(code) => {
                  setIsLoading(true);
                  setCode2(code);
                  setIsCodeReady(true);
                }}
              />

              <Text fontSize="$5" mt="$3">
                You will use this passcode to authorize transactions and sign into your account.
                Please keep it safe.
              </Text>
            </YStack>
          ) : (
            <YStack gap="$4" mx="$6" m="$8">
              <Text fontSize="$8">Set a passcode</Text>
              <Text mb="$3" fontSize="$5">
                You will use this passcode to authorize transactions and sign into your account.
                Please keep it safe.
              </Text>
              <CodeInput
                value={code1}
                password={true}
                autoFocus={true}
                onTextChange={(code) => setCode1(code)}
                onFulfill={(code) => onFullCode1(code)}
              />
            </YStack>
          )}
        </>
      )}
    </YStack>
  );
}

function isPinValid(pin) {
  return /^\d{6}$/.test(pin) && !PIN_BLOCKLIST.includes(pin);
}
