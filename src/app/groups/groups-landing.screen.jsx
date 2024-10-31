import {
  Box,
  Text,
  Heading,
  HStack,
  Stack,
  VStack,
  Icon,
  Avatar,
  Pressable,
  Button,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
//import { getSpaceInvite } from 'dapp/services';
import { useSelector, useDispatch } from 'react-redux';
import { getRoscaData } from 'jzk/redux/spaces.slice';
import { useEffect } from 'react';

export default function GroupsLandingScreen({ navigation }) {
  const dispatch = useDispatch();

  const thisAddress = useSelector((state) => state.wallet.userDetails.addresses[1].address);
  const group = useSelector((state) => state.spaces.userSpaces);
  console.log(group);
  /*
  const handleSpaceInvite = async () => {
    const invite = await getSpaceInvite(userPhone);
    dispatch(setSpaceInvites(invite));
    navigation.navigate('joinSpace');
  };
  useEffect(() => {
    dispatch(getRoscaData(thisAddress));
  }, [navigation]);*/
  return (
    <Box flex={1} bg="muted.100" alignItems="center">
      <Box bg="white" padding={4} width="full">
        <Heading mt="1/3" color="primary.700" size="xl">
          Jazika Groups
        </Heading>
        <Text mt={4} fontSize="lg">
          Make money moves with your
        </Text>
        <Text mb={4} fontSize="lg">
          family and friends...
        </Text>
        <Box bg="white" padding={4} width="full"></Box>
      </Box>
      <VStack position="absolute" mt="2/3" width="85%" space={2}>
        <Pressable
          bg="primary.50"
          padding={4}
          rounded="2xl"
          shadow="1"
          onPress={() => navigation.navigate('createGroup')}
        >
          <HStack space={2} alignItems="center">
            <Avatar bg="primary.200">
              <Icon as={MaterialIcons} name="groups" size="2xl" color="primary.600" />
            </Avatar>
            <Stack px={2}>
              <Text fontSize="md" fontWeight="semibold">
                Create a Group
              </Text>
              <Text fontSize="md">Create a new savings circle.</Text>
              <Text fontSize="md">Add friends or family.</Text>
            </Stack>
          </HStack>
        </Pressable>
        <Pressable
          bg="primary.50"
          padding={4}
          rounded="2xl"
          shadow="1"
          onPress={() => handleSpaceInvite()}
        >
          <HStack space={2} alignItems="center">
            <Avatar bg="primary.200">
              <Icon as={MaterialIcons} name="group-add" size="2xl" color="primary.600" />
            </Avatar>
            <Stack px={2}>
              <Text fontSize="md" fontWeight="semibold">
                Join a Group
              </Text>
              <Text fontSize="md">You'll need an invite to join.</Text>
              <Text fontSize="md">Save with friends.</Text>
            </Stack>
          </HStack>
        </Pressable>
      </VStack>
    </Box>
  );
}
