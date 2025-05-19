import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import validateSession from '../utils/auth_helper';
import { useUserData } from '../context/UserContext';

export function useValidateSession(redirectOnFailure = true, redirectDelay = 3000) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const { setIsLogged } = useUserData();

  const checkSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const isValid = await validateSession();
      
      if (!isValid) {
        throw new Error('Session is invalid');
      }

      setIsSessionValid(true);
      setIsLogged(true);
      return true;
    } catch (error) {
      console.error('Error validating session:', error);
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

  return { isLoading, setIsLoading, isSessionValid, error, checkSession };
}
