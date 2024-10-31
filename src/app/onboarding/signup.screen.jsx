import { YStack, SizableText, Text, Button, Input, Spacer, Theme } from 'tamagui';
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
      setIsLoading(false);
      return;
    }
    const confirmation = await auth().signInWithPhoneNumber(formattedNumber);
    if (!confirmation) {
      alert('Error sending code');
      setIsLoading(false);
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
    <YStack flex={1} bg="$background" ai="center">
      <YStack mt="$6" ai="center" width="95%">
        <Text fontSize="$8" mb="$6" width="65%" textAlign="center">
          Let's start with your phone number
        </Text>
        <PhoneInput
          ref={phoneInput}
          defaultCode="KE"
          layout="first"
          autoFocus
          onChangeFormattedText={(text) => {
            setPhoneNo(text);
          }}
          containerStyle={{
            borderColor: '$borderColor',
            borderWidth: 2,
            borderRadius: 12,
            height: 56,
            width: '85%',
          }}
          textContainerStyle={{ borderRadius: 12, paddingTop: 0, paddingBottom: 2 }}
          codeTextStyle={{ fontSize: 18 }}
          textInputStyle={{ fontSize: 18 }}
        />
      </YStack>
      <Spacer flex={1} />
      <YStack
        ai="center"
        width="100%"
        bg="$gray4"
        borderTopEndRadius="$6"
        borderTopStartRadius="$6"
      >
        <Text fontSize="$3" color="$gray12" my="$6" width="75%">
          Depending on your mobile network and country, standard rates and taxes may apply.
        </Text>
        <Button
          disabled={isLoading}
          onPress={() => {
            setIsLoading(true);
            handleSubmit();
          }}
          mb="$8"
          width="75%"
          size="$5"
          themeInverse
          fontWeight="bold"
        >
          {isLoading ? 'Verifying...' : 'Verify phone'}
        </Button>
      </YStack>
    </YStack>
  );
}
