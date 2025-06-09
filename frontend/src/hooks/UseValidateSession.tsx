import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import validateSession from '../utils/auth_helper';
import { useUserData } from '../context/UserContext';
import getUserData from '../utils/user_helper';

export function useValidateSession(redirectOnFailure = true, redirectDelay = 500) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const { setUserData, setIsLogged } = useUserData();

  const checkSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const isValid = await validateSession();
      
      if (!isValid) {
        throw new Error('Session is invalid');
      }

      const userData = await getUserData();
      if (!userData) {
        throw new Error('Failed to retrive user data');
      }

      setUserData(userData);
      setIsSessionValid(true);
      setIsLogged(true);
      return true;
    } catch (error) {
      console.error('Error validating session:', error);
      setUserData(null);
      setIsSessionValid(false);
      setIsLogged(false);
      setError(error instanceof Error ? error : new Error('Unknown error'));
      
      if (redirectOnFailure) {
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, redirectDelay);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, redirectOnFailure, redirectDelay, setIsLogged]);

  return { isLoading, isSessionValid, error, setIsLoading, checkSession };
}
