/**
 * Auth Repository Pattern
 * Abstracts data access logic and provides clean API for auth operations
 */

import { authAPI } from '../services/authAPI.js'
import { secureStorage } from '../utils/secureStorage.js'
import { errorHandler } from '../services/errorHandler.js'

class AuthRepository {
  constructor() {
    this.cache = new Map()
  }

  // Login with credentials
  async login(credentials) {
    try {
      const response = await authAPI.login(credentials)

      // Store tokens securely
      secureStorage.setToken(response.token, response.refreshToken)
      secureStorage.setCurrentUser(response.user)

      // Cache user data
      this.cache.set('currentUser', response.user)

      return response
    } catch (error) {
      throw errorHandler.handle(error)
    }
  }

  // Register new user
  async register(userData) {
    try {
      const response = await authAPI.register(userData)

      // Store tokens securely
      secureStorage.setToken(response.token, response.refreshToken)
      secureStorage.setCurrentUser(response.user)

      // Cache user data
      this.cache.set('currentUser', response.user)

      return response
    } catch (error) {
      throw errorHandler.handle(error)
    }
  }

  // Check if email exists in database
  async checkEmail(email) {
    try {
      const response = await authAPI.checkEmail(email)
      return response
    } catch (error) {
      throw errorHandler.handle(error)
    }
  }

  // Send OTP for email login
  async sendLoginOTP(email) {
    try {
      const response = await authAPI.sendLoginOTP(email)
      return response
    } catch (error) {
      throw errorHandler.handle(error)
    }
  }

  // Verify OTP and login
  async verifyLoginOTP(email, otp) {
    try {
      const response = await authAPI.verifyLoginOTP(email, otp)

      // Store tokens securely
      secureStorage.setToken(response.token, response.refreshToken || null)
      secureStorage.setCurrentUser(response.user)

      // Cache user data
      this.cache.set('currentUser', response.user)

      return response
    } catch (error) {
      throw errorHandler.handle(error)
    }
  }

  // Request password reset
  async forgotPassword(email) {
    try {
      const response = await authAPI.forgotPassword(email)
      return response
    } catch (error) {
      throw errorHandler.handle(error)
    }
  }

  // Reset password with OTP
  async resetPassword(email, otp, newPassword) {
    try {
      const response = await authAPI.resetPassword(email, otp, newPassword)
      return response
    } catch (error) {
      throw errorHandler.handle(error)
    }
  }

  // Change password for authenticated user
  async changePassword(oldPassword, newPassword) {
    try {
      const tokenData = secureStorage.getToken()
      if (!tokenData || !tokenData.token) {
        throw new Error('Not authenticated')
      }

      const response = await authAPI.changePassword(
        tokenData.token,
        oldPassword,
        newPassword
      )

      return response
    } catch (error) {
      throw errorHandler.handle(error)
    }
  }

  // Refresh access token
  async refreshToken() {
    try {
      const tokenData = secureStorage.getToken()
      if (!tokenData || !tokenData.refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await authAPI.refreshToken(tokenData.refreshToken)

      // Update stored tokens
      secureStorage.setToken(response.token, response.refreshToken)

      return response
    } catch (error) {
      // Clear auth data on refresh failure
      secureStorage.clearToken()
      this.cache.delete('currentUser')
      throw errorHandler.handle(error)
    }
  }

  // Logout user
  async logout() {
    try {
      const tokenData = secureStorage.getToken()
      if (tokenData && tokenData.refreshToken) {
        await authAPI.logout(tokenData.refreshToken)
      }
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      // Always clear local data
      secureStorage.clearToken()
      this.cache.delete('currentUser')
    }
  }

  // Get current authenticated user
  getCurrentUser() {
    // Try cache first
    const cached = this.cache.get('currentUser')
    if (cached) return cached

    // Fallback to secure storage
    const user = secureStorage.getCurrentUser()
    if (user) {
      this.cache.set('currentUser', user)
    }

    return user
  }

  // Check if user is authenticated
  isAuthenticated() {
    const tokenData = secureStorage.getToken()
    return !!(tokenData && tokenData.token)
  }

  // Get current token
  getToken() {
    return secureStorage.getToken()
  }

  // Clear all cached data
  clearCache() {
    this.cache.clear()
  }
}

export const authRepository = new AuthRepository()