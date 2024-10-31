import {
  Box,
  Text,
  Avatar,
  VStack,
  Button,
  HStack,
  Spacer,
  Radio,
  Stack,
  Icon,
  Pressable,
  ScrollView,
} from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

export default function ApplyLoanStep6({ navigation }) {
  const loanRequest = useSelector((s) => s.spaces.loanRequest);

  return (
    <SafeAreaView flex={1}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        showsVerticalScrollIndicator={false}
      >
        <Box flex={1} bg="gray.300" alignItems="center">
          <Text fontSize="xl" color="black" fontWeight="bold" my={6}>
            Jazika Groups Loan
          </Text>
          <Box bg="white" flex={1} height="full" width="full" roundedTop="3xl" alignItems="center">
            <HStack space={2} mt={5}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Box
                  width="10%"
                  bg={index == 3 ? 'orange.400' : 'orange.200'}
                  minH={1}
                  rounded="2xl"
                  key={index}
                />
              ))}
            </HStack>
            <VStack space={3} width="90%" mt={8}>
              <HStack justifyContent="space-between">
                <Text fontSize="lg" fontWeight="medium" textAlign="left">
                  Review application
                </Text>
                <Pressable mx={4}>
                  <Text fontSize="md" color="orange.600">
                    Edit
                  </Text>
                </Pressable>
              </HStack>
              <Box
                bg="gray.100"
                borderWidth={2}
                borderColor="gray.400"
                rounded="2xl"
                alignItems="center"
                py={4}
              >
                <Text fontSize="md">Loan amount</Text>
                <Text fontSize="2xl" bold>
                  {loanRequest.amount} CKES
                </Text>
                <Text mt={3}>To repay with {7.5 * loanRequest.duration}% interest</Text>
                <Text fontSize="lg" bold>
                  = {loanRequest.amount + loanRequest.interest} CKES
                </Text>
              </Box>
              <Box bg="muted.100" rounded="2xl" alignItems="center" py={4}>
                <Text fontSize="md">Duration</Text>
                <Text fontSize="2xl" bold>
                  {loanRequest.duration} Month
                </Text>
                <HStack width="90%" justifyContent="space-between" mb={3}>
                  <Text fontSize="md">Repayment</Text>
                  <Text fontSize="md" px={4} bg="muted.600" rounded="2xl" color="white">
                    {loanRequest.freqency}
                  </Text>
                </HStack>
                <HStack
                  space={3}
                  alignItems="center"
                  width="95%"
                  justifyContent="space-between"
                  bg="white"
                  rounded="2xl"
                  p={2}
                >
                  <Icon as={MaterialIcons} name="calendar-today" size="xl" />
                  <VStack>
                    <Text fontSize="md">1st Repayment</Text>
                    <Text>
                      {new Date(Date.now() + 60 * 60 * 60 * loanRequest.tenor).toLocaleDateString()}
                    </Text>
                  </VStack>
                  <Text fontSize="lg" bold>
                    {(loanRequest.amount / loanRequest.instalments).toFixed(2)} CKES
                  </Text>
                </HStack>
              </Box>
            </VStack>
            <Spacer />
            <HStack space={3} mb="10" mt={10}>
              <Button
                variant="outline"
                rounded="3xl"
                borderWidth={1}
                borderColor="gray.400"
                pr="4"
                minW="25%"
                _text={{ color: 'black', fontWeight: 'semibold', mb: '0.5' }}
                onPress={() => navigation.goBack()}
              >
                Back
              </Button>
              <Button
                rounded="3xl"
                pr="4"
                bg="orange.300"
                minW="60%"
                _text={{ color: 'black', fontWeight: 'semibold', mb: '0.5' }}
                onPress={() => navigation.navigate('appyLoanS5')}
              >
                Submit application
              </Button>
            </HStack>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
