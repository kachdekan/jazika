import { createSlice, createAction } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  isConnected: false,
  isTokenSet: false,
  userDetails: {
    id: null,
    names: null,
    email: null,
    phone: null,
    country: null,
    created: null,
    address: null,
    photoURL: null,
  },
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      const { id, names, email, phone, photoUri, country, address } = action.payload;
      state.userDetails.id = id;
      state.userDetails.phone = phone;
      state.userDetails.country = country;
      state.userDetails.created = Date.now();
      state.userDetails.address = address;
      if (email) state.userDetails.email = email;
      if (photoUri) state.userDetails.photoURL = photoUri;
      if (names) state.userDetails.names = names;
    },
    setUserDetailsOnLogin: (state, action) => {
      state.userDetails = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setTokenIsSet: (state, action) => {
      state.isTokenSet = action.payload;
    },
  },
});

export const {
  setUserDetails,
  setLoggedIn,
  setUserDetailsOnLogin,
  setHasAccount,
  setIsConnected,
  setTokenIsSet,
} = walletSlice.actions;

export const addUserDetailsToken = createAction('wallet/addUserDetailsToken');

export default walletSlice.reducer;
