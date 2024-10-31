import { createSlice, createAction } from '@reduxjs/toolkit';

const spacesInitialState = {
  isLoading: true,
  selectedMembers: [],
  userSpaces: {
    hasSpaces: false,
    spaces: [],
  },
  currentSpace: {},
  spaceInfo: {
    // for space creation
    name: 'group',
    type: 'rosca', //personal, rosca, regular, mchango
    authCode: '112233AABB',
    imgLink: 'https://ipfs',
    members: [], //!TODO always include creator.
    membersCount: 5,
    goalAmount: 5000,
    ctbAmount: 100,
    ctbDay: 'Monday',
    ctbOccurence: 'Weekly',
    disbDay: 'Tuesday',
    disbOccurence: 'Weekly',
    creator: '0x00', //creator user address
  },
  roscaDetails: {},
  loanRequest: {},
  spaceInvites: [],
};

const spacesSlice = createSlice({
  name: 'spaces',
  initialState: spacesInitialState,
  reducers: {
    setSelectedMembers: (state, action) => {
      if (action.payload.length > 0) {
        state.selectedMembers = action.payload;
        state.spaceInfo.members = action.payload;
        state.spaceInfo.membersCount = action.payload.length + 1;
      } else {
        state.spaceInfo.membersCount = action.payload;
      }
    },
    setSpaceInfo: (state, { payload }) => {
      const { spaceName, creatorAddress, spaceType } = payload;

      //state.spaceInfo.members = state.selectedMembers;
      state.spaceInfo.name = spaceName;
      state.spaceInfo.type = spaceType;
      state.spaceInfo.creator = creatorAddress;
      //state.spaceInfo.imgLink = defaultImg;
      //state.spaceInfo.membersCount = membersCount;
    },
    setCtbSchedule: (state, { payload }) => {
      (state.spaceInfo.ctbDay = payload.day), (state.spaceInfo.ctbOccurence = payload.occurrence);
    },
    setDisbSchedule: (state, { payload }) => {
      (state.spaceInfo.disbDay = payload.day), (state.spaceInfo.disbOccurence = payload.occurrence);
    },
    setGoalAmount: (state, { payload }) => {
      const size = state.spaceInfo.members.length;
      state.spaceInfo.goalAmount = payload;
      state.spaceInfo.ctbAmount = size
        ? payload / (state.spaceInfo.members.length + 1)
        : payload / state.spaceInfo.membersCount;
    },
    setCurrentSpace: (state, { payload }) => {
      state.currentSpace = payload;
    },
    setRoscaDetails: (state, { payload }) => {
      state.roscaDetails = payload;
      console.log(payload);
    },
    setHasSpaces: (state, { payload }) => {
      state.userSpaces.hasSpaces = payload;
    },

    setLoanPool: (state, { payload }) => {
      state.loanPool = payload;
    },

    setSpaceInvites: (state, { payload }) => {
      state.spaceInvites = payload;
    },
    setLoanAmountTenor: (state, { payload }) => {
      state.loanRequest.amount = payload.amount;
      state.loanRequest.tenor = 30 * payload.duration;
      state.loanRequest.duration = payload.duration;
      state.loanRequest.interest = 0.075 * payload.duration * payload.amount;
    },
    setLoanInstalments: (state, { payload }) => {
      const duration = state.loanRequest.duration;
      const numberOfInstallments = {
        Daily: 30 * duration,
        Weekly: 4 * duration,
        Monthly: 1 * duration,
      };
      state.loanRequest.instalments = numberOfInstallments[payload.freqency];
      state.loanRequest.freqency = payload.freqency;
    },
  },
});

export const {
  setSelectedMembers,
  setSpaceInfo,
  setCtbSchedule,
  setDisbSchedule,
  setGoalAmount,
  setCurrentSpace,
  setRoscaDetails,
  setHasSpaces,
  setLoanPool,
  setSpaceInvites,
  setLoanAmountTenor,
  setLoanInstalments,
} = spacesSlice.actions;

//Created action
export const getRoscaData = createAction('spaces/getRoscaData');
export const getRoscaAddress = createAction('spaces/getRoscaAddress');
export const fetchSpaces = createAction('spaces/fetchSpaces');
export const updateSpaces = createAction('spaces/updateSpaces');

export default spacesSlice.reducer;
