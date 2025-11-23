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
  const [webViewLoading, setWebViewLoading] = useState(true);
  const [dashboardUrl, setDashboardUrl] = useState<string>('');
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    loadAuthData();
    setupBackHandler();
    
    // Timeout for WebView loading - if it takes too long, show error
    const loadingTimeout = setTimeout(() => {
      if (webViewLoading) {
        console.warn('WebView loading timeout');
        setWebViewLoading(false);
        setError('Dashboard is taking too long to load. Please check your internet connection and try again.');
      }
    }, 30000); // 30 second timeout
    
    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [webViewLoading]);

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
      
      // Set dashboard URL
      const url = getDashboardUrl();
      console.log('Loading dashboard URL:', url);
      setDashboardUrl(url);
      
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

  if (!dashboardUrl) {
    return <LoadingScreen message="Preparing dashboard..." />;
  }

  // JavaScript to inject token into WebView
  // Escape the token and user data properly for JavaScript
  const escapedToken = token.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
  const escapedUser = JSON.stringify(user)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
  
  const injectedJavaScript = `
    (function() {
      try {
        console.log('Injecting token into WebView...');
        localStorage.setItem('token', '${escapedToken}');
        localStorage.setItem('user', '${escapedUser}');
        console.log('Token injected successfully');
        window.ReactNativeWebView.postMessage('TOKEN_SET');
        
        // Also set in sessionStorage as backup
        sessionStorage.setItem('token', '${escapedToken}');
        sessionStorage.setItem('user', '${escapedUser}');
      } catch (e) {
        console.error('Token injection error:', e);
        window.ReactNativeWebView.postMessage('TOKEN_ERROR: ' + e.message);
      }
    })();
    true;
  `;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <OfflineNotice />
      {webViewLoading && (
        <View style={styles.loadingOverlay}>
          <LoadingScreen message="Loading dashboard..." />
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: dashboardUrl }}
        style={styles.webview}
        injectedJavaScript={injectedJavaScript}
        onLoadStart={() => {
          console.log('WebView load started');
          setWebViewLoading(true);
        }}
        onLoadEnd={() => {
          console.log('WebView load ended');
          setWebViewLoading(false);
        }}
        onLoadProgress={({ nativeEvent }) => {
          console.log('WebView load progress:', nativeEvent.progress);
        }}
        onNavigationStateChange={(navState) => {
          console.log('Navigation state changed:', navState.url);
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
          setWebViewLoading(false);
          setError(`Failed to load dashboard: ${nativeEvent.description || 'Unknown error'}. URL: ${dashboardUrl}`);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('HTTP error:', nativeEvent.statusCode, nativeEvent.url);
          setWebViewLoading(false);
          
          if (nativeEvent.statusCode === 401) {
            Alert.alert(
              'Session Expired',
              'Your session has expired. Please login again.',
              [{ text: 'OK', onPress: async () => {
                await clearAuth();
                router.replace('/');
              }}]
            );
          } else if (nativeEvent.statusCode === 404) {
            setError(`Page not found (404). Please check if the dashboard URL is correct: ${dashboardUrl}`);
          } else {
            setError(`HTTP error ${nativeEvent.statusCode}. Please check your internet connection.`);
          }
        }}
        setSupportMultipleWindows={false}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        renderLoading={() => (
          <View style={styles.loadingOverlay}>
            <LoadingScreen message="Loading dashboard..." />
          </View>
        )}
        renderError={(errorName) => (
          <View style={styles.errorOverlay}>
            <ErrorScreen 
              message={`Failed to load dashboard: ${errorName}. URL: ${dashboardUrl}`} 
              onRetry={handleRetry} 
            />
          </View>
        )}
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
    backgroundColor: '#ffffff',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    zIndex: 1,
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    zIndex: 2,
  },
});

