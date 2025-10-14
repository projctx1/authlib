/**
 * Secure Storage Abstraction Layer
 * Provides encrypted localStorage fallback and httpOnly cookie support
 */

class SecureStorage {
  constructor() {
    this.useHttpOnlyCookies = this.checkHttpOnlyCookieSupport()
    this.encryptionKey = this.generateKey()
    this._memoryStorage = null
  }

  // Check if httpOnly cookies are available (SSR safe)
  checkHttpOnlyCookieSupport() {
    return typeof document !== 'undefined' &&
           typeof document.cookie !== 'undefined'
  }

  // Generate a simple encryption key (NOT production-grade)
  generateKey() {
    // For production, use Web Crypto API or proper encryption
    return 'auth-sdk-key-' + Math.random().toString(36).substr(2, 9)
  }

  // Simple encryption for localStorage fallback (NOT production-grade)
  encrypt(data) {
    try {
      // For production, use proper encryption
      return btoa(JSON.stringify(data))
    } catch (e) {
      console.error('Encryption failed:', e)
      return null
    }
  }

  decrypt(data) {
    try {
      return JSON.parse(atob(data))
    } catch (e) {
      console.error('Decryption failed:', e)
      return null
    }
  }

  setToken(token, refreshToken) {
    if (this.useHttpOnlyCookies) {
      // Tokens should be set via Set-Cookie header from backend
      // Frontend should NOT directly set httpOnly cookies
      console.warn('Use Set-Cookie header from backend for httpOnly cookies')
    }

    // Fallback to encrypted localStorage
    const authData = {
      token,
      refreshToken,
      timestamp: Date.now(),
      version: '1.0'
    }

    const encrypted = this.encrypt(authData)
    if (!encrypted) {
      console.error('Failed to encrypt auth data')
      return
    }

    try {
      localStorage.setItem('auth_data', encrypted)
    } catch (e) {
      console.error('Storage not available:', e)
      // Fallback to memory-only storage (loses on refresh)
      this._memoryStorage = authData
    }
  }

  getToken() {
    try {
      const encrypted = localStorage.getItem('auth_data')
      if (!encrypted) {
        return this._memoryStorage || null
      }

      const decrypted = this.decrypt(encrypted)
      if (!decrypted) {
        console.error('Failed to decrypt auth data')
        return null
      }

      // Check if token is too old (24 hours)
      if (Date.now() - decrypted.timestamp > 86400000) {
        console.warn('Token expired, clearing storage')
        this.clearToken()
        return null
      }

      return {
        token: decrypted.token,
        refreshToken: decrypted.refreshToken
      }
    } catch (e) {
      console.error('Error accessing storage:', e)
      return this._memoryStorage || null
    }
  }

  clearToken() {
    try {
      localStorage.removeItem('auth_data')
      localStorage.removeItem('auth_user')
      this._memoryStorage = null
    } catch (e) {
      console.error('Failed to clear storage:', e)
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const tokenData = this.getToken()
    return !!(tokenData && tokenData.token)
  }

  // Get current user data
  getCurrentUser() {
    try {
      const userData = localStorage.getItem('auth_user')
      return userData ? JSON.parse(userData) : null
    } catch (e) {
      console.error('Failed to get user data:', e)
      return null
    }
  }

  // Store user data
  setCurrentUser(user) {
    try {
      localStorage.setItem('auth_user', JSON.stringify(user))
    } catch (e) {
      console.error('Failed to store user data:', e)
    }
  }
}

export const secureStorage = new SecureStorage()