const validateRules = (value, rules) => {
  if (!rules || rules.length === 0) return null
  
  for (const rule of rules) {
    if (rule === 'required' && (!value || value.trim() === '')) {
      return 'This field is required'
    }
    
    if (rule === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (value && !emailRegex.test(value)) {
        return 'Please enter a valid email'
      }
    }
    
    if (rule === 'phone') {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
      if (value && !phoneRegex.test(value)) {
        return 'Please enter a valid phone number'
      }
    }
    
    if (typeof rule === 'object' && rule.minLength) {
      if (value && value.length < rule.minLength) {
        return `Minimum ${rule.minLength} characters required`
      }
    }
    
    if (typeof rule === 'object' && rule.maxLength) {
      if (value && value.length > rule.maxLength) {
        return `Maximum ${rule.maxLength} characters allowed`
      }
    }
    
    if (typeof rule === 'object' && rule.pattern) {
      if (value && !rule.pattern.test(value)) {
        return rule.message || 'Invalid format'
      }
    }
  }
  
  return null
}

export default {
  namespaced: true,
  
  state: {
    errors: {},
    touched: {},
    validating: {}
  },
  
  mutations: {
    SET_ERROR(state, { field, error }) {
      state.errors = { ...state.errors, [field]: error }
    },
    CLEAR_ERROR(state, field) {
      const { [field]: removed, ...rest } = state.errors
      state.errors = rest
    },
    SET_TOUCHED(state, field) {
      state.touched = { ...state.touched, [field]: true }
    },
    SET_VALIDATING(state, { field, validating }) {
      state.validating = { ...state.validating, [field]: validating }
    },
    CLEAR_ALL(state) {
      state.errors = {}
      state.touched = {}
      state.validating = {}
    }
  },
  
  actions: {
    validateField({ commit }, { field, value, rules }) {
      commit('SET_VALIDATING', { field, validating: true })
      
      const error = validateRules(value, rules)
      
      if (error) {
        commit('SET_ERROR', { field, error })
      } else {
        commit('CLEAR_ERROR', field)
      }
      
      commit('SET_VALIDATING', { field, validating: false })
      return !error
    },
    
    touchField({ commit }, field) {
      commit('SET_TOUCHED', field)
    },
    
    clearField({ commit }, field) {
      commit('CLEAR_ERROR', field)
    },
    
    clearAll({ commit }) {
      commit('CLEAR_ALL')
    }
  },
  
  getters: {
    getError: (state) => (field) => state.errors[field],
    isTouched: (state) => (field) => state.touched[field],
    isValidating: (state) => (field) => state.validating[field],
    hasErrors: (state) => Object.keys(state.errors).length > 0,
    isValid: (state) => Object.keys(state.errors).length === 0
  }
}
