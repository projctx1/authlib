export default {
  namespaced: true,
  
  state: {
    code: '',
    isVerified: false,
    isLoading: false,
    error: null,
    expiryTime: null,
    resendCooldownEnd: null,
    attempts: 0,
    maxAttempts: 3
  },
  
  mutations: {
    SET_CODE(state, code) {
      state.code = code
    },
    SET_VERIFIED(state, verified) {
      state.isVerified = verified
    },
    SET_LOADING(state, loading) {
      state.isLoading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_ERROR(state) {
      state.error = null
    },
    SET_EXPIRY_TIME(state, time) {
      state.expiryTime = time
    },
    SET_RESEND_COOLDOWN(state, time) {
      state.resendCooldownEnd = time
    },
    INCREMENT_ATTEMPTS(state) {
      state.attempts += 1
    },
    RESET_ATTEMPTS(state) {
      state.attempts = 0
    },
    RESET_STATE(state) {
      state.code = ''
      state.isVerified = false
      state.error = null
      state.expiryTime = null
      state.resendCooldownEnd = null
      state.attempts = 0
    }
  },
  
  actions: {
    async sendOTP({ commit }, { expirySeconds = 300 } = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        const expiryTime = Date.now() + (expirySeconds * 1000)
        commit('SET_EXPIRY_TIME', expiryTime)
        commit('RESET_ATTEMPTS')

        return { success: true }
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to send OTP')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async verifyOTP({ commit, state }, code) {
      if (state.attempts >= state.maxAttempts) {
        commit('SET_ERROR', 'Maximum attempts exceeded')
        return false
      }

      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      commit('INCREMENT_ATTEMPTS')

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock verification - in real app, this would be server-side
        const isValid = code === '123456' || code.length === 6

        if (isValid) {
          commit('SET_VERIFIED', true)
          commit('RESET_ATTEMPTS')
          return true
        } else {
          commit('SET_ERROR', 'Invalid verification code')
          return false
        }
      } catch (error) {
        commit('SET_ERROR', error.message || 'Verification failed')
        return false
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async resendOTP({ commit, dispatch }, { expirySeconds = 300, cooldownSeconds = 60 } = {}) {
      const cooldownEnd = Date.now() + (cooldownSeconds * 1000)
      commit('SET_RESEND_COOLDOWN', cooldownEnd)
      
      return dispatch('sendOTP', { expirySeconds })
    },
    
    updateCode({ commit }, code) {
      commit('SET_CODE', code)
    },
    
    setExpired({ commit }) {
      commit('SET_ERROR', 'Verification code has expired')
    },
    
    reset({ commit }) {
      commit('RESET_STATE')
    }
  },
  
  getters: {
    isExpired: (state) => {
      if (!state.expiryTime) return false
      return Date.now() > state.expiryTime
    },
    canResend: (state) => {
      if (!state.resendCooldownEnd) return true
      return Date.now() > state.resendCooldownEnd
    },
    remainingAttempts: (state) => state.maxAttempts - state.attempts,
    isBlocked: (state) => state.attempts >= state.maxAttempts,
    error: (state) => state.error,
    isLoading: (state) => state.isLoading,
    isVerified: (state) => state.isVerified,
    expiryTime: (state) => state.expiryTime,
    resendCooldownEnd: (state) => state.resendCooldownEnd
  }
}
