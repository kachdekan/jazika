import {
  getRoscaData,
  setRoscaDetails,
  setCurrentSpace,
  fetchSpaces,
  setHasSpaces,
} from './spaces.slice';
import celo from '../services/celo.service';
import { utils } from 'ethers';

export const spacesListeners = (startListening) => {
  startListening({
    actionCreator: getRoscaData,
    effect: async (action, listenerApi) => {
      const address = action.payload;
      // get id
      try {
        const groupId = await celo.getMemberGroupId(address);
        if (!groupId) {
          listenerApi.dispatch(setHasSpaces(false));
          return;
        }
        const result = await celo.getGroup(groupId.toNumber());

        const groupData = {
          id: groupId.toNumber(),
          type: 'rosca',
          spaceName: result.name,
          authCode: result.inviteCode,
          loanBalance: utils.formatUnits(result.totalLoanBalance, 18),
          tokenSymbol: 'CKES',
        };

        listenerApi.dispatch(setHasSpaces(true));
        listenerApi.dispatch(setRoscaDetails(groupData));
      } catch (error) {
        console.log(error);
        listenerApi.dispatch(setHasSpaces(false));
      }
    },
  });
};
