import { Text, Box, HStack, VStack, Avatar, Pressable, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

const AssetItem = (props) => {
  const navigation = useNavigation();
  const title = props.name.split(' ');
  const initials =
    title.length > 1
      ? title[0].slice(0, 1) +
        (title[1].slice(0, 2).toUpperCase() === 'CU' ? '$' : title[1].slice(0, 1).toUpperCase())
      : title[0].slice(0, 2).toUpperCase();
  const [view, setView] = useState(false);
  return (
    <Pressable onPress={() => setView(!view)}>
      <HStack space={3} my={2} mx={3} alignItems="center">
        <Avatar
          bg={props.name === 'JKES' ? 'primary.100' : 'green.100'}
          source={
            props.name === 'JKES'
              ? {
                  uri: 'https://assets.coingecko.com/coins/images/13161/standard/icon-celo-dollar-color-1000-circle-cropped.png',
                }
              : {
                  uri: 'https://assets.coingecko.com/coins/images/13161/standard/icon-celo-dollar-color-1000-circle-cropped.png',
                }
          }
        >
          {initials}
        </Avatar>
        <Box flexDirection="row" justifyContent="space-between" width="84%" mt="-0.5">
          <VStack>
            <Text fontSize="md" fontWeight="semibold" color="warmGray.800">
              {props.name}
            </Text>
            <Text>{props.descrp}</Text>
          </VStack>
          <VStack mr={2}>
            <Text fontSize="md" fontWeight="semibold" color="warmGray.800" textAlign="right">
              {props.amount.toFixed(2)}
            </Text>
            <Text color="blueGray.800" textAlign="right">
              {props.eqAmount}
            </Text>
          </VStack>
        </Box>
      </HStack>
      {view ? (
        <HStack width="90%" justifyContent="space-between" alignSelf="center" my={2}>
          <Button
            rounded="2xl"
            variant="subtle"
            pr="4"
            minW="20%"
            size="sm"
            _text={{ color: 'primary.600', fontWeight: 'semibold', mb: '0.5', fontSize: 'sm' }}
            onPress={() => navigation.navigate('depositFunds')}
          >
            Add
          </Button>
          <Button
            rounded="2xl"
            variant="subtle"
            pr="4"
            minW="20%"
            size="sm"
            _text={{ color: 'primary.600', fontWeight: 'semibold', mb: '0.5', fontSize: 'sm' }}
            onPress={() => navigation.navigate('transferFunds')}
          >
            Send
          </Button>
          <Button
            rounded="2xl"
            variant="subtle"
            pr="4"
            minW="20%"
            size="sm"
            _text={{ color: 'primary.600', fontWeight: 'semibold', mb: '0.5', fontSize: 'sm' }}
            onPress={() => navigation.navigate('withdrawFunds')}
          >
            Withdraw
          </Button>
        </HStack>
      ) : null}
    </Pressable>
  );
};

export default AssetItem;
