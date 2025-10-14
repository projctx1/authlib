import { authRepository } from '../../repositories/authRepository.js'
import { errorHandler } from '../../services/errorHandler.js'
import { secureStorage } from '../../utils/secureStorage.js'

export default {
  namespaced: true,
  
  state: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    token: null,
    refreshToken: null,
    resetEmail: null
  },
  
  mutations: {
    SET_USER(state, user) {
      state.user = user
      // Only set isAuthenticated based on user if it's not already true from a token
      if (!state.isAuthenticated) {
        state.isAuthenticated = !!user
      }
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_ERROR(state) {
      state.error = null
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_TOKENS(state, { token, refreshToken }) {
      state.token = token
      state.refreshToken = refreshToken

      // Set authenticated if we have a token
      if (token) {
        state.isAuthenticated = true
        // Use secure storage instead of direct localStorage
        secureStorage.setToken(token, refreshToken)
      }
    },
    SET_RESET_EMAIL(state, email) {
      state.resetEmail = email
    },
    CLEAR_RESET_EMAIL(state) {
      state.resetEmail = null
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.isAuthenticated = false
      state.token = null
      state.refreshToken = null
      state.error = null
      state.resetEmail = null

      // Clear secure storage
      secureStorage.clearToken()
    }
  },
  
  actions: {
    async login({ commit }, credentials) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        const response = await authRepository.login(credentials)

        commit('SET_USER', response.user)
        commit('SET_TOKENS', {
          token: response.token,
          refreshToken: response.refreshToken
        })

        return response
      } catch (error) {
        const errorInfo = errorHandler.handle(error)
        commit('SET_ERROR', errorInfo.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async register({ commit }, userData) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        const response = await authRepository.register(userData)

        commit('SET_USER', response.user)
        commit('SET_TOKENS', {
          token: response.token,
          refreshToken: response.refreshToken
        })

        return response
      } catch (error) {
        const errorInfo = errorHandler.handle(error)
        commit('SET_ERROR', errorInfo.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async forgotPassword({ commit }, email) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        const response = await authRepository.forgotPassword(email)
        commit('SET_RESET_EMAIL', email) // Store email for later use in reset
        return response
      } catch (error) {
        const errorInfo = errorHandler.handle(error)
        commit('SET_ERROR', errorInfo.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async resetPassword({ commit }, { email, otp, newPassword }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        const response = await authRepository.resetPassword(email, otp, newPassword)
        return response
      } catch (error) {
        const errorInfo = errorHandler.handle(error)
        commit('SET_ERROR', errorInfo.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async logout({ commit }) {
      try {
        await authRepository.logout()
      } catch (error) {
        console.error('Logout API call failed:', error)
      } finally {
        commit('CLEAR_AUTH')
      }
    },
    
    clearError({ commit }) {
      commit('CLEAR_ERROR')
    },

    // Check if email exists before sending OTP
    async checkEmail({ commit }, email) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await authRepository.checkEmail(email)

        if (response.requiresRegistration) {
          // Email doesn't exist, redirect to registration
          return { requiresRegistration: true, email }
        }

        return { exists: response.exists, email }
      } catch (error) {
        const errorInfo = errorHandler.handle(error)
        commit('SET_ERROR', errorInfo.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Send login OTP
    async sendLoginOTP({ commit }, { email }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await authRepository.sendLoginOTP(email)
        return response
      } catch (error) {
        const errorInfo = errorHandler.handle(error)
        commit('SET_ERROR', errorInfo.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Verify login OTP
    async verifyLoginOTP({ commit }, { email, code }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await authRepository.verifyLoginOTP(email, code)

        commit('SET_USER', response.user)
        commit('SET_TOKENS', {
          token: response.token,
          refreshToken: response.refreshToken || null
        })

        return { success: true, user: response.user }
      } catch (error) {
        const errorInfo = errorHandler.handle(error)
        commit('SET_ERROR', errorInfo.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Change password
    async changePassword({ commit, state }, { token, oldPassword, newPassword }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await authRepository.changePassword(oldPassword, newPassword)
        return response
      } catch (error) {
        const errorInfo = errorHandler.handle(error)
        commit('SET_ERROR', errorInfo.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Initialize auth state from secure storage
    async initializeAuth({ commit, dispatch, state }) {
      try {
        // Use secure storage instead of direct localStorage access
        const tokenData = secureStorage.getToken()
        const user = secureStorage.getCurrentUser()

        if (tokenData && tokenData.token && user && user !== 'undefined' && user !== 'null') {
          try {
            // Validate token format (basic check)
            if (!tokenData.token.startsWith('Bearer ') && !tokenData.token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)) {
              throw new Error('Invalid token format')
            }

            // First set tokens (this will set isAuthenticated = true if token exists)
            commit('SET_TOKENS', {
              token: tokenData.token,
              refreshToken: tokenData.refreshToken
            })

            // Then set user (but don't overwrite isAuthenticated if user is valid)
            if (user && user.email) {
              commit('SET_USER', user)
              console.log('✅ Auth state restored from secure storage')
            } else {
              // If user data is corrupted, clear everything
              throw new Error('Invalid user data')
            }
          } catch (parseError) {
            console.warn('Failed to parse user data:', parseError)
            throw new Error('Corrupted user data')
          }
        } else if (tokenData && tokenData.token) {
          // Token exists but no user data - keep token but mark as authenticated
          console.log('Token found, user will need to refresh data from server')
          commit('SET_TOKENS', {
            token: tokenData.token,
            refreshToken: tokenData.refreshToken
          })
        }
      } catch (error) {
        console.warn('Failed to initialize auth from secure storage:', error)
        // Clear corrupted data
        secureStorage.clearToken()
        commit('CLEAR_AUTH')
      }
    },


    // Refresh token
    async refreshToken({ commit, state }) {
      try {
        const response = await authRepository.refreshToken()
        commit('SET_TOKENS', {
          token: response.token,
          refreshToken: response.refreshToken
        })
        return response.token
      } catch (error) {
        commit('CLEAR_AUTH')
        throw error
      }
    }
  },
  
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    currentUser: (state) => state.user || authRepository.getCurrentUser(),
    isLoading: (state) => state.isLoading,
    error: (state) => state.error,
    token: (state) => state.token,
    resetEmail: (state) => state.resetEmail
  }
}
