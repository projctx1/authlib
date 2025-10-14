import { computed } from 'vue'
import { useStore } from 'vuex'

/**
 * Authentication composable for Vue Auth SDK
 * Provides reusable authentication logic and state
 */
export function useAuth() {
  const store = useStore()

  // State
  const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
  const currentUser = computed(() => store.getters['auth/currentUser'])
  const isLoading = computed(() => store.getters['auth/isLoading'])
  const error = computed(() => store.getters['auth/error'])
  const token = computed(() => store.getters['auth/token'])

  // Authentication methods
  const login = async (credentials) => {
    try {
      const result = await store.dispatch('auth/login', credentials)
      console.log('✅ Login successful:', result)
      return result
    } catch (err) {
      console.error('❌ Login failed:', err)
      throw err
    }
  }

  const register = async (userData) => {
    try {
      const result = await store.dispatch('auth/register', userData)
      console.log('✅ Registration successful:', result)
      return result
    } catch (err) {
      console.error('❌ Registration failed:', err)
      throw err
    }
  }

  const logout = async () => {
    try {
      await store.dispatch('auth/logout')
      console.log('✅ Logout successful')
    } catch (err) {
      console.error('❌ Logout failed:', err)
      throw err
    }
  }

  const sendLoginOTP = async (email) => {
    try {
      const result = await store.dispatch('auth/sendLoginOTP', { email })
      console.log('✅ OTP sent successfully')
      return result
    } catch (err) {
      console.error('❌ Send OTP failed:', err)
      throw err
    }
  }

  const verifyLoginOTP = async (email, code) => {
    try {
      const result = await store.dispatch('auth/verifyLoginOTP', { email, code })
      console.log('✅ OTP verification successful')
      return result
    } catch (err) {
      console.error('❌ OTP verification failed:', err)
      throw err
    }
  }

  const forgotPassword = async (email) => {
    try {
      const result = await store.dispatch('auth/forgotPassword', email)
      console.log('✅ Password reset email sent')
      return result
    } catch (err) {
      console.error('❌ Forgot password failed:', err)
      throw err
    }
  }

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const result = await store.dispatch('auth/resetPassword', {
        email,
        otp,
        newPassword
      })
      console.log('✅ Password reset successful')
      return result
    } catch (err) {
      console.error('❌ Password reset failed:', err)
      throw err
    }
  }

  const clearError = () => {
    store.dispatch('auth/clearError')
  }

  const refreshToken = async () => {
    try {
      const result = await store.dispatch('auth/refreshToken')
      console.log('✅ Token refresh successful')
      return result
    } catch (err) {
      console.error('❌ Token refresh failed:', err)
      throw err
    }
  }

  // Initialize auth state
  const initializeAuth = async () => {
    try {
      await store.dispatch('auth/initializeAuth')
      console.log('✅ Auth initialized')
    } catch (err) {
      console.error('❌ Auth initialization failed:', err)
      throw err
    }
  }

  return {
    // State
    isAuthenticated,
    currentUser,
    isLoading,
    error,
    token,

    // Methods
    login,
    register,
    logout,
    sendLoginOTP,
    verifyLoginOTP,
    forgotPassword,
    resetPassword,
    clearError,
    refreshToken,
    initializeAuth
  }
}