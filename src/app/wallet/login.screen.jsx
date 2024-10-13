import { Box, Text, VStack, Avatar, Spinner, Button, Icon } from 'native-base';
import { View } from 'react-native';
import { CodeInput } from 'jzk/components';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setLoggedIn } from 'jzk/redux/wallet.slice';
import { userToken } from 'jzk/services';
import { saltyPasscode } from 'jzk/utils/encryption';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const { names, phone } = useSelector((s) => s.wallet.userDetails);
  const firstName = names ? names.split(' ')[0] : '**' + phone.slice(9, 13);
  const [code, setCode] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isCodeReady, setIsCodeReady] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleFullFill = (code) => {
    const token = saltyPasscode(code);
    if (token === userToken) {
      setIsValid(true);
      setLoading(true);
    } else {
      console.log('LoggedIn Failed');
      setIsValid(false);
      setLoading(false);
      setIsCodeReady(false);
      setCode('');
    }
  };

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        dispatch(setLoggedIn(true));
      }, 500);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isCodeReady) {
      setTimeout(() => {
        handleFullFill(code);
      }, 500);
    }
  }, [isCodeReady]);

  return (
    <Box flex={1} bg="#fff" justifyContent="center">
      <VStack alignItems="center" space={3} mb={5}>
        <Avatar bgColor="primary.200" size="lg">
          <Icon as={Ionicons} name="person" size={22} color="coolGray.700" />
        </Avatar>
        <Text fontSize="md" mb="3">
          Welcome back, {firstName}
        </Text>
        {isLoading ? (
          <Spinner size="lg" />
        ) : (
          <CodeInput
            placeholder={
              <View
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: 25,
                  backgroundColor: '#e5e7eb',
                }}
              ></View>
            }
            mask={
              <View
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: 25,
                  backgroundColor: '#1f2937',
                }}
              ></View>
            }
            maskDelay={300}
            password={true}
            autoFocus={true}
            cellStyle={null}
            cellStyleFocused={null}
            value={code}
            onTextChange={(code) => setCode(code)}
            onFulfill={(code) => {
              setCode(code);
              setIsCodeReady(true);
            }}
          />
        )}
        {isValid ? null : <Text>Forgot passcode? See how to reset here!</Text>}
      </VStack>
    </Box>
  );
}
