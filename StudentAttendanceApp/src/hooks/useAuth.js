import { useCallback, useEffect, useState } from 'react';
import { loginRequest } from '../services/api';
import { getItem, removeItem, setItem } from '../services/storage';
import { STORAGE_KEYS } from '../utils/constants';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const savedToken = await getItem(STORAGE_KEYS.AUTH_TOKEN);
        const savedUser = await getItem(STORAGE_KEYS.USER_PROFILE);
        if (savedToken) setToken(savedToken);
        if (savedUser) setUser(savedUser);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async credentials => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginRequest(credentials);
      await setItem(STORAGE_KEYS.AUTH_TOKEN, result.token);
      await setItem(STORAGE_KEYS.USER_PROFILE, result.user);
      setToken(result.token);
      setUser(result.user);
      return result;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await removeItem(STORAGE_KEYS.USER_PROFILE);
    setToken(null);
    setUser(null);
  }, []);

  return { user, token, loading, error, login, logout, isAuthenticated: !!token };
}
