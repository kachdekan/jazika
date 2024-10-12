import { Box, Text, Button, FormControl, Stack, Icon, Spacer, VStack } from 'native-base';
import PhoneInput from 'react-native-phone-number-input';
import { useState, useRef } from 'react';
import auth from '@react-native-firebase/auth';

export default function SignUpScreen({ navigation }) {
  const [phoneNo, setPhoneNo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const phoneInput = useRef(null);

  const handleSubmit = async () => {
    const { formattedNumber } = phoneInput.current?.getNumberAfterPossiblyEliminatingZero(phoneNo);
    setPhoneNo(formattedNumber);
    const phoneIsValid = phoneInput.current?.isValidNumber(formattedNumber);
    if (!phoneIsValid) {
      alert('Invalid Phone Number, Please enter a valid phone number');
      return;
    }
    const confirmation = await auth().signInWithPhoneNumber(formattedNumber);
    if (!confirmation) {
      alert('Error sending code');
      return;
    }
    setIsLoading(false);

    navigation.navigate('verifyPhoneNo', {
      phone: formattedNumber,
      country: phoneInput.current?.getCountryCode(),
      verificationId: confirmation.verificationId,
    });
  };
  return (
    <Box flex={1} bg="white" alignItems="center">
      <FormControl mt="1/6" alignItems="center">
        <Stack mx={8}>
          <FormControl.Label>Phone Number</FormControl.Label>
          <PhoneInput
            ref={phoneInput}
            defaultCode="KE"
            layout="first"
            autoFocus
            onChangeFormattedText={(text) => {
              setPhoneNo(text);
            }}
            containerStyle={{
              borderColor: '#374151',
              borderWidth: 2,
              borderRadius: 12,
              height: 56,
            }}
            textContainerStyle={{ borderRadius: 12, paddingTop: 0, paddingBottom: 2 }}
            codeTextStyle={{ fontSize: 18 }}
            textInputStyle={{ fontSize: 18 }}
            //flagButtonStyle={{ height: 40 }}
          />
          <FormControl.HelperText color="muted.500">
            Depending on your mobile network and country, standard rates and taxes may apply.
          </FormControl.HelperText>
        </Stack>
      </FormControl>
      <Spacer />

      <Button
        isLoading={isLoading}
        pr="4"
        minW="75%"
        _text={{ fontWeight: 'semibold', mb: '0.5' }}
        onPress={() => {
          setIsLoading(true), handleSubmit();
        }}
        mb={10}
        bg="primary.800"
        isLoadingText="verifying..."
      >
        Verify phone
      </Button>
    </Box>
  );
}
