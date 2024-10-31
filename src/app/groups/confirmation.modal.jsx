import { Modal, Icon, Text, Button, VStack, HStack } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ConfirmationModal = ({ isOpen, onClose, message, screen, scrnOptions }) => {
  const navigation = useNavigation();
  return (
    <Modal isOpen={isOpen} onClose={onClose} animationPreset="slide" mb="10">
      <Modal.Content width="80%" maxWidth="400px">
        <Modal.Body alignItems="center">
          <Icon
            as={Ionicons}
            name={scrnOptions.isSuccess ? 'checkmark-circle' : 'close-circle'}
            size="6xl"
            color={scrnOptions.isSuccess ? 'success.600' : 'danger.600'}
          />
          {scrnOptions.isSuccess ? (
            <VStack width="95%">
              <HStack alignItems="center" space={2} p={3}>
                <Icon as={Ionicons} name="checkmark-circle" color="success.600" size="xl" />
                <Text fontSize="md">Loan request received</Text>
              </HStack>
              <HStack
                alignItems="center"
                space={2}
                my={3}
                bg="orange.100"
                p={3}
                rounded="2xl"
                flexWrap="wrap"
              >
                <Icon as={Ionicons} name="caret-down-circle" color="orange.500" size="xl" />
                <Text fontSize="md" bold color="orange.500">
                  Your loan is being processed
                </Text>
              </HStack>
              <HStack alignItems="center" space={2} p={3} width="90%">
                <Icon as={Ionicons} name="caret-down-circle" size="xl" color="muted.300" />
                <Text>We will notify you when funds arrive to your wallet</Text>
              </HStack>
            </VStack>
          ) : (
            <Text textAlign="center" mt={3}>
              {message}
            </Text>
          )}
          <Button
            variant="subtle"
            rounded="3xl"
            bg="primary.100"
            w="75%"
            mt={3}
            _text={{ color: 'text.900', fontWeight: 'semibold', mb: '0.5' }}
            onPress={() => {
              onClose();
              scrnOptions.isSuccess ? navigation.navigate(screen, scrnOptions) : null;
            }}
          >
            OK
          </Button>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default ConfirmationModal;
