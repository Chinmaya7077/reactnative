import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  },
);

// --- Auth ---
export const loginRequest = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

// --- Attendance / Survey ---
export const fetchAttendanceList = async () => {
  const { data } = await api.get('/attendance');
  return data;
};

export const submitSurvey = async payload => {
  const { data } = await api.post('/attendance', payload);
  return data;
};
