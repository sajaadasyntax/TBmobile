import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for storage
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

/**
 * Store authentication token securely
 */
export async function setToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing token:', error);
    throw new Error('Failed to store authentication token');
  }
}

/**
 * Retrieve authentication token
 */
export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
}

/**
 * Remove authentication token
 */
export async function removeToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
}

/**
 * Store refresh token securely
 */
export async function setRefreshToken(refreshToken: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    console.error('Error storing refresh token:', error);
    throw new Error('Failed to store refresh token');
  }
}

/**
 * Retrieve refresh token
 */
export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error retrieving refresh token:', error);
    return null;
  }
}

/**
 * Remove refresh token
 */
export async function removeRefreshToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error removing refresh token:', error);
  }
}

/**
 * Store user data (non-sensitive, can use AsyncStorage)
 */
export async function setUser(user: any): Promise<void> {
  try {
    const userString = JSON.stringify(user);
    await AsyncStorage.setItem(USER_KEY, userString);
  } catch (error) {
    console.error('Error storing user data:', error);
    throw new Error('Failed to store user data');
  }
}

/**
 * Retrieve user data
 */
export async function getUser(): Promise<any | null> {
  try {
    const userString = await AsyncStorage.getItem(USER_KEY);
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
}

/**
 * Remove user data
 */
export async function removeUser(): Promise<void> {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing user data:', error);
  }
}

/**
 * Clear all authentication data
 */
export async function clearAuth(): Promise<void> {
  await Promise.all([
    removeToken(),
    removeRefreshToken(),
    removeUser(),
  ]);
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  return token !== null;
}

