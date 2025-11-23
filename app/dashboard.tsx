import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  Alert,
  Platform,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getToken, getUser, clearAuth } from '../src/services/storage';
import { getDashboardUrl, shouldHandleInWebView } from '../src/utils/navigation';
import { useNetworkStatus } from '../src/hooks/useNetworkStatus';
import LoadingScreen from '../src/components/LoadingScreen';
import ErrorScreen from '../src/components/ErrorScreen';
import OfflineNotice from '../src/components/OfflineNotice';

export default function DashboardScreen() {
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    loadAuthData();
    setupBackHandler();
  }, []);

  async function loadAuthData() {
    try {
      const [authToken, userData] = await Promise.all([
        getToken(),
        getUser(),
      ]);

      if (!authToken || !userData) {
        router.replace('/');
        return;
      }

      // Verify user is a contractor
      if (userData.role !== 'CONTRACTOR') {
        Alert.alert(
          'Access Denied',
          'This app is only available for contractors. Please use the web app.',
          [{ text: 'OK', onPress: async () => {
            await clearAuth();
            router.replace('/');
          }}]
        );
        return;
      }

      setTokenState(authToken);
      setUserState(userData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load authentication data');
      setLoading(false);
    }
  }

  function setupBackHandler() {
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: true }
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }

  async function handleLogout() {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await clearAuth();
            router.replace('/');
          },
        },
      ],
      { cancelable: true }
    );
  }

  function handleRefresh() {
    setRefreshing(true);
    webViewRef.current?.reload();
    setTimeout(() => setRefreshing(false), 1000);
  }

  function handleRetry() {
    setError(null);
    setLoading(true);
    loadAuthData();
  }

  if (loading) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorScreen message={error} onRetry={handleRetry} />;
  }

  if (!token || !user) {
    return <ErrorScreen message="Authentication required" />;
  }

  // JavaScript to inject token into WebView
  const injectedJavaScript = `
    (function() {
      try {
        localStorage.setItem('token', '${token}');
        localStorage.setItem('user', '${JSON.stringify(user).replace(/'/g, "\\'")}');
        window.ReactNativeWebView.postMessage('TOKEN_SET');
      } catch (e) {
        window.ReactNativeWebView.postMessage('TOKEN_ERROR: ' + e.message);
      }
    })();
    true;
  `;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <OfflineNotice />
      <WebView
        ref={webViewRef}
        source={{ uri: getDashboardUrl() }}
        style={styles.webview}
        injectedJavaScript={injectedJavaScript}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
        }}
        onMessage={(event) => {
          const message = event.nativeEvent.data;
          console.log('WebView message:', message);
          
          if (message === 'LOGOUT') {
            handleLogout();
          }
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
          setError('Failed to load dashboard. Please check your internet connection.');
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('HTTP error:', nativeEvent.statusCode);
          if (nativeEvent.statusCode === 401) {
            Alert.alert(
              'Session Expired',
              'Your session has expired. Please login again.',
              [{ text: 'OK', onPress: async () => {
                await clearAuth();
                router.replace('/');
              }}]
            );
          }
        }}
        setSupportMultipleWindows={false}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        // Pull to refresh (Android only by default)
        refreshControl={
          Platform.OS === 'android' ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          ) : undefined
        }
        // Handle external links and ensure only contractor routes
        onShouldStartLoadWithRequest={(request) => {
          const url = request.url.toLowerCase();
          
          // Block external URLs
          if (!shouldHandleInWebView(request.url)) {
            return false;
          }
          
          // Block customer/admin routes - only allow contractor routes
          if (url.includes('/dashboard/customer') || 
              url.includes('/dashboard/admin') ||
              url.includes('/admin')) {
            // Block navigation to non-contractor routes
            return false;
          }
          
          // Allow contractor routes, KYC, and other approved internal routes
          return true;
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
  },
});

