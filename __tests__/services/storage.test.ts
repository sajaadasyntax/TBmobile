/**
 * Unit tests for storage service
 */

import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  setToken,
  getToken,
  removeToken,
  setRefreshToken,
  getRefreshToken,
  removeRefreshToken,
  setUser,
  getUser,
  removeUser,
  clearAuth,
  isAuthenticated,
  isContractor,
} from '../../src/services/storage'

describe('Storage Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Token Management', () => {
    it('should store token securely', async () => {
      ;(SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined)

      await setToken('test-token')

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_token', 'test-token')
    })

    it('should retrieve token', async () => {
      ;(SecureStore.getItemAsync as jest.Mock).mockResolvedValue('test-token')

      const token = await getToken()

      expect(token).toBe('test-token')
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('auth_token')
    })

    it('should return null when token retrieval fails', async () => {
      ;(SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('Error'))

      const token = await getToken()

      expect(token).toBeNull()
    })

    it('should remove token', async () => {
      ;(SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined)

      await removeToken()

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token')
    })

    it('should handle token storage error', async () => {
      ;(SecureStore.setItemAsync as jest.Mock).mockRejectedValue(new Error('Storage error'))

      await expect(setToken('test-token')).rejects.toThrow('Failed to store authentication token')
    })
  })

  describe('Refresh Token Management', () => {
    it('should store refresh token securely', async () => {
      ;(SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined)

      await setRefreshToken('refresh-token')

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('refresh_token', 'refresh-token')
    })

    it('should retrieve refresh token', async () => {
      ;(SecureStore.getItemAsync as jest.Mock).mockResolvedValue('refresh-token')

      const token = await getRefreshToken()

      expect(token).toBe('refresh-token')
    })

    it('should remove refresh token', async () => {
      ;(SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined)

      await removeRefreshToken()

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('refresh_token')
    })
  })

  describe('User Data Management', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      role: 'CONTRACTOR',
    }

    it('should store user data', async () => {
      ;(AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined)

      await setUser(mockUser)

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'user_data',
        JSON.stringify(mockUser)
      )
    })

    it('should retrieve user data', async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser))

      const user = await getUser()

      expect(user).toEqual(mockUser)
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('user_data')
    })

    it('should return null when no user data exists', async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(null)

      const user = await getUser()

      expect(user).toBeNull()
    })

    it('should return null when user data retrieval fails', async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Error'))

      const user = await getUser()

      expect(user).toBeNull()
    })

    it('should remove user data', async () => {
      ;(AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined)

      await removeUser()

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user_data')
    })

    it('should handle user data storage error', async () => {
      ;(AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'))

      await expect(setUser(mockUser)).rejects.toThrow('Failed to store user data')
    })
  })

  describe('clearAuth', () => {
    it('should clear all authentication data', async () => {
      ;(SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined)
      ;(AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined)

      await clearAuth()

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token')
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('refresh_token')
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user_data')
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated contractor', async () => {
      ;(SecureStore.getItemAsync as jest.Mock).mockResolvedValue('test-token')
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ id: 'user-123', role: 'CONTRACTOR' })
      )

      const result = await isAuthenticated()

      expect(result).toBe(true)
    })

    it('should return false when no token exists', async () => {
      ;(SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null)

      const result = await isAuthenticated()

      expect(result).toBe(false)
    })

    it('should return false when user is not a contractor', async () => {
      ;(SecureStore.getItemAsync as jest.Mock).mockResolvedValue('test-token')
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ id: 'user-123', role: 'CUSTOMER' })
      )

      const result = await isAuthenticated()

      expect(result).toBe(false)
    })

    it('should return false when user data is missing', async () => {
      ;(SecureStore.getItemAsync as jest.Mock).mockResolvedValue('test-token')
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(null)

      const result = await isAuthenticated()

      expect(result).toBe(false)
    })
  })

  describe('isContractor', () => {
    it('should return true for contractor role', async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ id: 'user-123', role: 'CONTRACTOR' })
      )

      const result = await isContractor()

      expect(result).toBe(true)
    })

    it('should return false for non-contractor role', async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ id: 'user-123', role: 'CUSTOMER' })
      )

      const result = await isContractor()

      expect(result).toBe(false)
    })

    it('should return false when no user data exists', async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(null)

      const result = await isContractor()

      expect(result).toBe(false)
    })
  })
})

