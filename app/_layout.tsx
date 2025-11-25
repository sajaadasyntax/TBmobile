import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { isAuthenticated, getUser, clearAuth } from '../src/services/storage';
import ErrorBoundary from '../src/components/ErrorBoundary';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkAuthAndRedirect();
  }, [segments]);

  async function checkAuthAndRedirect() {
    try {
      const isAuth = await isAuthenticated();
      const inAuthGroup = segments[0] === 'index';
      const inDashboardGroup = segments[0] === 'dashboard';

      if (!isAuth && !inAuthGroup) {
        // Not authenticated and not on login screen - redirect to login
        router.replace('/');
      } else if (isAuth && inAuthGroup) {
        // Authenticated but on login screen - redirect to dashboard
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error('Error in auth redirect:', error);
      // On error, go to login to be safe
      router.replace('/');
    }
  }

  return (
    <ErrorBoundary>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="dashboard" />
      </Stack>
    </ErrorBoundary>
  );
}

