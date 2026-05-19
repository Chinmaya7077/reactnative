export const isEmail = (value = '') =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isNonEmpty = (value = '') => value.trim().length > 0;

export const minLength = (value = '', n = 6) => value.trim().length >= n;

export const validateLogin = ({ email, password }) => {
  const errors = {};
  if (!isEmail(email)) errors.email = 'Enter a valid email';
  if (!minLength(password, 6)) errors.password = 'Password must be 6+ characters';
  return errors;
};

export const validateSurvey = ({ studentName, className, status }) => {
  const errors = {};
  if (!isNonEmpty(studentName)) errors.studentName = 'Student name is required';
  if (!isNonEmpty(className)) errors.className = 'Select a class';
  if (!isNonEmpty(status)) errors.status = 'Select attendance status';
  return errors;
};
