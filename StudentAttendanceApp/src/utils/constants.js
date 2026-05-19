// All local — points to the Express server running on YOUR machine.
// Android emulator: 10.0.2.2 is the emulator's alias for the host's localhost.
// iOS simulator:    change to 'http://localhost:4000/api'
// Physical device on same Wi-Fi: change to your machine's LAN IP, e.g. 'http://192.168.1.10:4000/api'
export const API_BASE_URL = 'http://10.0.2.2:4000/api';

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_PROFILE: '@user_profile',
};

export const CLASS_OPTIONS = [
  { label: 'Class 6', value: '6' },
  { label: 'Class 7', value: '7' },
  { label: 'Class 8', value: '8' },
  { label: 'Class 9', value: '9' },
  { label: 'Class 10', value: '10' },
];

export const ATTENDANCE_OPTIONS = [
  { label: 'Present', value: 'present' },
  { label: 'Absent', value: 'absent' },
  { label: 'Late', value: 'late' },
];
