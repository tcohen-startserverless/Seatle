import { AuthStorage, getCurrentUser, openAuthClient, UserSubject } from '@/auth/client';
import { useEffect, useState } from 'react';

export const authEvents = new EventTarget();
export const AUTH_CHANGED = 'auth_changed';

export const notifyAuthChange = () => {
  authEvents.dispatchEvent(new Event(AUTH_CHANGED));
};
export function useAuth() {
  const [user, setUser] = useState<UserSubject | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleAuthChange = () => checkAuthState();
    authEvents.addEventListener(AUTH_CHANGED, handleAuthChange);

    const checkAuthState = async () => {
      try {
        setIsLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);
      } catch (err) {
        console.error('Error checking auth state:', err);
        setError(
          err instanceof Error ? err : new Error('Failed to check authentication status')
        );
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
    return () => {
      authEvents.removeEventListener(AUTH_CHANGED, handleAuthChange);
    };
  }, []);

  const login = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const origin = window.location.origin;
      const redirectUri = `${origin}/callback`;
      const { challenge, url } = await openAuthClient.authorize(redirectUri, 'code', {
        pkce: true,
        provider: 'code',
      });

      await AuthStorage.storeChallenge(challenge);

      window.location.href = url;
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err : new Error('Failed to initiate login'));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AuthStorage.clearAuth();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err instanceof Error ? err : new Error('Failed to logout'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
}
