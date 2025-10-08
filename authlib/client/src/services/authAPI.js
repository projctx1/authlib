/**
 * Authentication API Service
 * Handles all authentication-related API calls
 * Compatible with backend response format: { success, message, data }
 */

import API from './api.js'

export const authAPI = {
  /**
   * Login with email and password
   */
  async login(credentials) {
    const response = await API.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    },
      { withCredentials: false }
    )
    
    // Handle backend response wrapper
    if (!response.data.success) {
      throw new Error(response.data.message || 'Login failed')
    }
    
    return {
      user: response.data.data.user,
      token: response.data.data.token || response.data.data.accessToken,
      refreshToken: response.data.data.refreshToken
    }
  },

  /**
   * Register new user
   */
  async register(userData) {
    const response = await API.post('/auth/register', {
      email: userData.email,
      password: userData.password
    })

    if (!response.data.success) {
      throw new Error(response.data.message || 'Registration failed')
    }

    // Handle server's response format: { message: "User registered", id: user._id }
    return {
      user: {
        id: response.data.data.id,
        email: userData.email,
        message: response.data.data.message
      },
      message: response.data.data.message
    }
  },

  /**
   * Send OTP for login
   */
  async sendLoginOTP(email) {
    const response = await API.post('/auth/login/request-otp', { email })
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to send OTP')
    }
    
    return response.data.data
  },

  /**
   * Verify OTP and complete login
   */
  async verifyLoginOTP(email, otp) {
    const response = await API.post('/auth/login/verify-otp', { 
      email, 
      otp 
    })
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'OTP verification failed')
    }
    
    return {
      user: response.data.data.user,
      token: response.data.data.token || response.data.data.accessToken,
      refreshToken: response.data.data.refreshToken
    }
  },

  /**
   * Request password reset (sends OTP to email)
   */
  async forgotPassword(email) {
    const response = await API.post('/auth/forgot-password', { email })
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to send reset email')
    }
    
    return response.data.data
  },

  /**
   * Reset password with OTP
   */
  async resetPassword(email, otp, newPassword) {
    const response = await API.post('/auth/reset-password', {
      email,
      otp,
      newPassword
    })
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to reset password')
    }
    
    return response.data.data
  },

  /**
   * Change password for logged-in user
   */
  async changePassword(token, oldPassword, newPassword) {
    const response = await API.post('/auth/change-password', {
      token,
      oldPassword,
      newPassword
    })
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to change password')
    }
    
    return response.data.data
  },

  /**
   * Initialize authentication service
   */
  async initAuth() {
    const response = await API.get('/auth/init')

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to initialize auth')
    }

    return response.data.data
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    const response = await API.post('/auth/refresh', { refreshToken })
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to refresh token')
    }
    
    return {
      token: response.data.data.token || response.data.data.accessToken,
      refreshToken: response.data.data.refreshToken
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    const response = await API.get('/me')
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to get user')
    }
    
    return response.data.data.user
  },

  /**
   * Logout user
   */
  async logout() {
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
      try {
        await API.post('/logout', { refreshToken })
      } catch (error) {
        console.error('Logout API call failed:', error)
      }
    }
  }
}
