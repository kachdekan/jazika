import AsyncStorage from '@react-native-async-storage/async-storage';
import { setItemAsync, getItemAsync } from 'expo-secure-store';
import { STORAGE_KEY } from '../config';

export const storeData = async (value) => {
  try {
    const data = JSON.stringify(value);
    await AsyncStorage.setItem(STORAGE_KEY, data);
  } catch (e) {
    console.log('Error storing data:', e);
  }
};

export const getData = async () => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    console.log('Error getting data:', e);
  }
};

export const updateData = async (value) => {
  try {
    const data = JSON.stringify(value);
    await AsyncStorage.mergeItem(STORAGE_KEY, data);
  } catch (e) {
    console.log('Error updating data:', e);
  }
};

export const storeSecureData = async (value) => {
  try {
    const data = JSON.stringify(value);
    await setItemAsync(STORAGE_KEY, data);
  } catch (e) {
    console.log('Error storing data:', e);
  }
};

export const getSecureData = async () => {
  try {
    const value = await getItemAsync(STORAGE_KEY);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    console.log('Error getting data:', e);
  }
};

export const updateSecureData = async (value) => {
  try {
    const storedData = await getSecureData(STORAGE_KEY);
    const updatedData = { ...storedData, ...value };
    const data = JSON.stringify(updatedData);
    await setItemAsync(STORAGE_KEY, data);
  } catch (e) {
    console.log('Error updating data:', e);
  }
};
