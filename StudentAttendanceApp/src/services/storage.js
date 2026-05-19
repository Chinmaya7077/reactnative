import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (key, value) => {
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
  await AsyncStorage.setItem(key, stringValue);
};

export const getItem = async key => {
  const value = await AsyncStorage.getItem(key);
  if (value === null) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const removeItem = async key => {
  await AsyncStorage.removeItem(key);
};

export const clearAll = async () => {
  await AsyncStorage.clear();
};
