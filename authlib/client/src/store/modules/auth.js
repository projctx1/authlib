import { authAPI } from '../../services/authAPI.js'

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
        localStorage.setItem('auth_token', token)
      }
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken)
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

      // Clear localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('auth_user')
    }
  },
  
  actions: {
    async login({ commit }, credentials) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        const response = await authAPI.login(credentials)
        
        commit('SET_USER', response.user)
        commit('SET_TOKENS', {
          token: response.token,
          refreshToken: response.refreshToken
        })
        
        // Store user in localStorage
        localStorage.setItem('auth_user', JSON.stringify(response.user))
        
        return response
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Login failed'
        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async register({ commit }, userData) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        const response = await authAPI.register(userData)
        
        commit('SET_USER', response.user)
        commit('SET_TOKENS', {
          token: response.token,
          refreshToken: response.refreshToken
        })
        
        // Store user in localStorage
        localStorage.setItem('auth_user', JSON.stringify(response.user))
        
        return response
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async forgotPassword({ commit }, email) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        const response = await authAPI.forgotPassword(email)
        commit('SET_RESET_EMAIL', email) // Store email for later use in reset
        return response
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to send reset email'
        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async resetPassword({ commit }, { email, otp, newPassword }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        const response = await authAPI.resetPassword(email, otp, newPassword)
        return response
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to reset password'
        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async logout({ commit }) {
      try {
        await authAPI.logout()
      } catch (error) {
        console.error('Logout API call failed:', error)
      } finally {
        commit('CLEAR_AUTH')
      }
    },
    
    clearError({ commit }) {
      commit('CLEAR_ERROR')
    },

    // Initiate OTP login
    async initiateOTPLogin({ commit }, { email }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      
      try {
        const response = await authAPI.sendLoginOTP(email)
        return response
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to send OTP'
        commit('SET_ERROR', errorMessage)
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
        const response = await authAPI.sendLoginOTP(email)
        return response
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to send login OTP'
        commit('SET_ERROR', errorMessage)
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
        const response = await authAPI.verifyLoginOTP(email, code)
        
        commit('SET_USER', response.user)
        commit('SET_TOKENS', {
          token: response.token,
          refreshToken: response.refreshToken || null
        })
        
        // Store user in localStorage
        localStorage.setItem('auth_user', JSON.stringify(response.user))
        
        return { success: true, user: response.user }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'OTP verification failed'
        commit('SET_ERROR', errorMessage)
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
        const response = await authAPI.changePassword(token || state.token, oldPassword, newPassword)
        return response
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to change password'
        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Initialize auth state from localStorage
    async initializeAuth({ commit, dispatch, state }) {
      try {
        const token = localStorage.getItem('auth_token')
        const refreshToken = localStorage.getItem('refresh_token')
        const user = localStorage.getItem('auth_user')

        if (token && user && user !== 'undefined' && user !== 'null') {
          try {
            const parsedUser = JSON.parse(user)

            // Validate token format (basic check)
            if (!token.startsWith('Bearer ') && !token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)) {
              throw new Error('Invalid token format')
            }

            // First set tokens (this will set isAuthenticated = true if token exists)
            commit('SET_TOKENS', { token, refreshToken })

            // Then set user (but don't overwrite isAuthenticated if user is valid)
            if (parsedUser && parsedUser.email) {
              commit('SET_USER', parsedUser)
              console.log('✅ Auth state restored from localStorage')
            } else {
              // If user data is corrupted, clear everything
              throw new Error('Invalid user data')
            }
          } catch (parseError) {
            console.warn('Failed to parse user data:', parseError)
            throw new Error('Corrupted user data')
          }
        } else if (token) {
          // Token exists but no user data - keep token but mark as authenticated
          console.log('Token found, user will need to refresh data from server')
          commit('SET_TOKENS', { token, refreshToken })
        }
      } catch (error) {
        console.warn('Failed to initialize auth from localStorage:', error)
        // Clear corrupted data
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('auth_user')
        commit('CLEAR_AUTH')
      }
    },


    // Refresh token
    async refreshToken({ commit, state }) {
      try {
        const response = await authAPI.refreshToken(state.refreshToken)
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
    isAuthenticated: state => state.isAuthenticated || !!state.token,
    currentUser: state => state.user,
    isLoading: state => state.isLoading,
    error: state => state.error,
    token: state => state.token,
    resetEmail: state => state.resetEmail
  }
}
