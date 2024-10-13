import {
  Text,
  Box,
  SectionList,
  Pressable,
  Divider,
  HStack,
  ChevronRightIcon,
  Icon,
  Stack,
  useToast,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useSelector } from 'react-redux';
import * as WebBrowser from 'expo-web-browser';
import auth from '@react-native-firebase/auth';

export default function AccountScreen({ navigation }) {
  const { address, phone } = useSelector((s) => s.wallet.userDetails);
  const toast = useToast();

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(address);
    toast.show({
      title: 'Address copied to clipboard',
      status: 'success',
      duration: 2000,
      placement: 'top',
    });
  };

  const data = [
    {
      title: phone,
      icon: 'person',
      description: address,
      data: [
        {
          title: 'Edit Profile',
          action: 'editProfile',
        },
        {
          title: 'Language',
          action: 'changeLanguage',
        },
      ],
    },
    {
      title: 'Security',
      icon: 'lock',
      description: '',
      data: [
        {
          title: 'Recovery Phrase',
          action: 'getRecoveryPhrase',
        },
        {
          title: 'Change Passcode',
          action: 'changePasscode',
        },
      ],
    },
    {
      title: 'About',
      icon: 'information-circle',
      data: [
        {
          title: 'About Us',
          action: 'about-us',
        },
        {
          title: 'Terms of Service',
          action: 'terms-conditions',
        },
        {
          title: 'Privacy Policy',
          action: 'privacy-policy',
        },
        {
          title: 'Licenses',
          action: 'licenses',
        },
      ],
    },
    {
      title: 'Logout',
      icon: 'log-out',
      description:
        "Remove your account from this device. You'll need your recovery phrase to log back in.",
      data: [
        {
          title: 'Logout',
          action: 'logout',
        },
      ],
    },
  ];

  return (
    <Box flex={1} bg="white" alignItems="center" justifyContent="center">
      <SectionList
        sections={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item, index }) => (
          <>
            <Pressable
              py={3}
              onPress={() => {
                if (item.action === 'logout') {
                  auth().signOut();
                } else if (item.action === 'licenses' || item.action === 'changeLanguage') {
                  console.log(item.action);
                } else if (
                  item.action === 'about-us' ||
                  item.action === 'terms-conditions' ||
                  item.action === 'privacy-policy'
                ) {
                  console.log(item.action);
                  WebBrowser.openBrowserAsync('https://jazika.gg/' + item.action);
                } else {
                  navigation.navigate(item.action);
                }
              }}
              _pressed={{
                bg: 'muted.200',
              }}
            >
              <HStack justifyContent="space-between">
                <Text fontSize="md">{item.title}</Text>
                <ChevronRightIcon size="4" />
              </HStack>
            </Pressable>
            <Divider />
          </>
        )}
        renderSectionHeader={({ section: { title, icon, description } }) => (
          <Box maxW="90%" mt={3} mb={2}>
            {icon === 'person' ? (
              <HStack alignItems="center" space={6}>
                <Stack>
                  <Text fontSize="lg" textAlign="left">
                    +{title}
                  </Text>
                  {description ? (
                    <Text fontSize="sm" maxW="90%">
                      {description}
                    </Text>
                  ) : null}
                </Stack>
                <Pressable p={3} mt={4} onPress={() => copyToClipboard()}>
                  <Icon as={Ionicons} name="copy-outline" size="lg" color="text.400" />
                </Pressable>
              </HStack>
            ) : (
              <>
                <Text fontSize="lg" textAlign="left">
                  {title}
                </Text>
                {description ? <Text fontSize="xs">{description}</Text> : null}
              </>
            )}
          </Box>
        )}
      />
    </Box>
  );
}
