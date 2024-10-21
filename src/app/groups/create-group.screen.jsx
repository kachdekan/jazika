import {
  Box,
  Text,
  Image,
  FormControl,
  Stack,
  Input,
  Button,
  HStack,
  Icon,
  Heading,
  Select,
  CheckIcon,
  Spacer,
  useDisclose,
} from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { setSpaceInfo, setHasSpaces, getRoscaData } from 'jzk/redux/spaces.slice';
import { generateId } from 'jzk/utils/generateIds';
import { addNewSpace } from 'jzk/services';
import { SuccessModal } from 'jzk/components';
import { Shilling, Dollar } from 'jzk/config';
//import { createSpace } from 'dapp/contracts';

export default function CreateGroupScreen({ navigation }) {
  //useSelector((state) => state.wallet.walletInfo.address);
  const [thisAddress, setThisAddress] = useState('0x00000000000000000000000738');
  const suggestions = ['Savings', 'Vacation', 'Chama', 'Sherehe', 'Emergency', 'Masomo'];
  const dispatch = useDispatch();
  const [spaceName, setSpaceName] = useState('');
  const [spaceType, setSpaceType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const { isOpen, onOpen, onClose } = useDisclose();
  const [isKES, setIsKES] = useState(true);

  const inviteCode = generateId();

  /*
  const thisUser = useSelector((state) => state.wallet.userDetails);
  const spaceInfo = useSelector((state) => state.spaces.spaceInfo);
  
  

  useEffect(() => {
    const getAddress = async () => {
      const signer = getSigner();
      const address = await signer.getAddress();
      setThisAddress(address);
    };
    getAddress();
    setAuthCode(generateId());
  }, []);

  const handleCreateRosca = async () => {
    setIsLoading(true);
    let txData = {
      token: isKES ? Shilling.address : Dollar.address,
      roscaName: spaceInfo.name,
      imageLink: spaceInfo.imgLink,
      goalAmount: ethers.utils.parseUnits(spaceInfo.goalAmount.toString(), 18).toString(),
      ctbAmount: ethers.utils.parseUnits(spaceInfo.ctbAmount.toString(), 18).toString(),
      ctbDay: spaceInfo.ctbDay,
      disbDay: spaceInfo.disbDay,
      occurrence: spaceInfo.disbOccurence,
    };
    console.log('TX Data:', txData, authCode);
    const result = null; //await createSpace(txData, authCode);
    if (result) {
      await addNewSpace({
        address: result.address,
        type: 'rosca',
        name: spaceInfo.name,
        authCode,
        members: [
          {
            name: thisUser.names,
            phone: thisUser.phone,
            address: thisAddress,
            attributes: {
              isAdmin: true,
              isPooled: false,
            },
          },
        ],
        invites: null,
      });
      setIsSuccess(true);
      dispatch(getRoscaData({ address: result.address, authCode }));
      setTimeout(() => {
        dispatch(setHasSpaces(true));
        onOpen();
        setIsLoading(false);
      }, 2000);
      //setIsLoading(false);
    }
    setIsLoading(false); 
  };
  */
  return (
    <Box flex={1} bg="muted.100">
      <Box bg="white" minH="30%" p={6}>
        <Text fontSize="lg" fontWeight="bold">
          Set up your Space
        </Text>
        <Icon
          position="absolute"
          as={MaterialCommunityIcons}
          name="image-plus"
          size="xl"
          alignSelf="flex-end"
          bottom={6}
          right={6}
        />
      </Box>
      <FormControl alignItems="center" mt={2}>
        <Stack space={2} w="80%">
          <Stack mt={2}>
            <FormControl.Label>
              <Text fontSize="md">Name your space </Text>
            </FormControl.Label>
            <Input
              bg="white"
              p={3}
              placeholder="Savings"
              rounded="2xl"
              size="lg"
              value={spaceName}
              onChangeText={(text) => setSpaceName(text)}
            />
          </Stack>
          <HStack space={3} flexWrap="wrap" mt={3}>
            {suggestions.map((item) => {
              return (
                <Button
                  size="sm"
                  variant="subtle"
                  bg="primary.100"
                  shadow="1"
                  mb={2}
                  key={item}
                  onPress={() => setSpaceName(item)}
                >
                  {item}
                </Button>
              );
            })}
          </HStack>
          <Stack>
            <FormControl.Label>
              <Text fontSize="md">Select your space type</Text>
            </FormControl.Label>
            <Select
              size="lg"
              bg="white"
              accessibilityLabel="Choose Space Type"
              placeholder="Space type"
              _selectedItem={{
                bg: 'primary.600',
                endIcon: <CheckIcon size={2} color="muted.200" />,
              }}
              py={3}
              rounded="2xl"
              mt="1"
              onValueChange={(type) => setSpaceType(type)}
            >
              <Select.Item label="Personal Group" value="personal" />
              <Select.Item label="Chama Group (ROSCA)" value="rosca" />
              <Select.Item label="Contribution Group" value="mchango" />
              <Select.Item label="" value="" />
            </Select>
          </Stack>
        </Stack>
      </FormControl>
      <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
        message={
          isSuccess
            ? `Rosca created successfully! \nInvite Code: ${inviteCode}`
            : `Rosca creation Failed! \n${errorMessage}`
        }
        screen="Spaces"
        scrnOptions={{ isSuccess }}
      />
      <Spacer />
      <Stack alignItems="center" width="95%" mt={6} mb={10} alignSelf="center">
        <Button
          rounded="3xl"
          isLoading={isLoading}
          isDisabled={thisAddress && spaceType ? false : true}
          w="60%"
          _text={{ color: 'primary.100', fontWeight: 'semibold', mb: '0.5' }}
          onPress={() => {
            setIsLoading(true);
            dispatch(setSpaceInfo({ spaceName, creatorAddress: thisAddress, spaceType }));
            /*setTimeout(() => {
              handleCreateRosca();
            }, 1000); */
          }}
        >
          Continue
        </Button>
      </Stack>
    </Box>
  );
}
