/**
 * Token Refresh Manager
 * Handles proactive token refresh and refresh deduplication
 */

import { authAPI } from './authAPI.js'
import { secureStorage } from '../utils/secureStorage.js'

class TokenRefreshManager {
  constructor() {
    this.refreshPromise = null
    this.isRefreshing = false
    this.refreshTimer = null
  }

  // Decode JWT to get expiration (client-side only for UX)
  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      return JSON.parse(window.atob(base64))
    } catch {
      return null
    }
  }

  // Check if token needs refresh (5 minutes before expiry)
  shouldRefresh(token) {
    const decoded = this.decodeToken(token)
    if (!decoded || !decoded.exp) return false

    const expirationTime = decoded.exp * 1000
    const currentTime = Date.now()
    const fiveMinutes = 5 * 60 * 1000

    return expirationTime - currentTime < fiveMinutes
  }

  // Refresh token with deduplication
  async refreshToken(store) {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise
    }

    this.isRefreshing = true
    this.refreshPromise = this.performRefresh(store)
      .finally(() => {
        this.isRefreshing = false
        this.refreshPromise = null
      })

    return this.refreshPromise
  }

  // Perform the actual refresh
  async performRefresh(store) {
    try {
      const tokenData = secureStorage.getToken()
      if (!tokenData || !tokenData.refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await authAPI.refreshToken(tokenData.refreshToken)

      if (response.token) {
        // Update secure storage with new tokens
        secureStorage.setToken(response.token, response.refreshToken)

        // Update store state
        store.commit('auth/SET_TOKENS', {
          token: response.token,
          refreshToken: response.refreshToken
        })

        return response.token
      }
    } catch (error) {
      console.error('Token refresh failed:', error)

      // Clear auth data on refresh failure
      secureStorage.clearToken()
      store.dispatch('auth/logout')

      throw error
    }
  }

  // Start automatic refresh checking
  startAutoRefresh(store) {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }

    // Check every minute
    this.refreshTimer = setInterval(() => {
      const tokenData = secureStorage.getToken()
      if (tokenData && tokenData.token && this.shouldRefresh(tokenData.token)) {
        this.refreshToken(store).catch(err => {
          console.error('Auto-refresh failed:', err)
        })
      }
    }, 60000) // 1 minute
  }

  // Stop automatic refresh
  stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = null
    }
  }
}

export const tokenRefreshManager = new TokenRefreshManager()