import { useState, useEffect } from 'react';
import { Linking, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { openAuthClient, AuthStorage, getCurrentUser, UserSubject } from '../auth/client';

export function useAuth() {
  const [user, setUser] = useState<UserSubject | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Handle deep linking for auth redirect
  useEffect(() => {
    // Function to handle the redirect URL
    const handleRedirect = async (url: string) => {
      if (!url.includes('callback')) return;

      try {
        // Extract the code from the URL
        const urlObj = new URL(url);
        const code = urlObj.searchParams.get('code');

        if (!code) {
          throw new Error('No authorization code found in redirect');
        }

        // Get the stored challenge if we used PKCE
        const challenge = await AuthStorage.getChallenge();

        // Exchange the code for tokens
        const redirectUri = makeRedirectUri({
          scheme: 'seater',
          path: 'callback',
        });

        const exchanged = await openAuthClient.exchange(
          code,
          redirectUri,
          challenge?.verifier
        );

        if (exchanged.err) {
          throw new Error(`Token exchange failed: ${exchanged.err.message}`);
        }

        // Store the tokens
        await AuthStorage.storeTokens(exchanged.tokens);

        // Get the user from the token
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);

        // Clear the challenge
        await AuthStorage.clearChallenge();
      } catch (err) {
        console.error('Error handling redirect:', err);
        setError(
          err instanceof Error ? err : new Error('Unknown error in auth redirect')
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Set up the linking listener
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleRedirect(url);
    });

    // Check for initial URL (might have opened the app from a link)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleRedirect(url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Check if the user is already authenticated
  useEffect(() => {
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
  }, []);

  const login = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Create a redirect URI using Expo's helper
      const redirectUri = makeRedirectUri({
        scheme: 'seater',
        path: 'callback',
      });

      // Use PKCE flow for better security
      const { challenge, url } = await openAuthClient.authorize(redirectUri, 'code', {
        pkce: true,
        provider: 'code', // Specify the code provider
      });

      // Store the challenge for later verification
      await AuthStorage.storeChallenge(challenge);

      // Open the auth URL in a browser
      if (Platform.OS === 'web') {
        window.location.href = url;
      } else {
        const result = await WebBrowser.openAuthSessionAsync(url, redirectUri);

        if (result.type === 'cancel') {
          setError(new Error('Authentication was cancelled'));
        }
      }
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
