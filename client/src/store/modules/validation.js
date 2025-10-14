import { validationService } from '../../services/validationService.js'

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
    async validateField({ commit }, { field, value, rules }) {
      commit('SET_VALIDATING', { field, validating: true })

      const result = await validationService.validateField(field, value, rules)

      if (!result.valid) {
        commit('SET_ERROR', { field, error: result.error })
      } else {
        commit('CLEAR_ERROR', field)
      }

      commit('SET_VALIDATING', { field, validating: false })
      return result.valid
    },
    
    touchField({ commit }, field) {
      commit('SET_TOUCHED', field)
    },
    
    clearField({ commit }, field) {
      commit('CLEAR_ERROR', field)
      validationService.clearField(field)
    },
    
    clearAll({ commit }) {
      commit('CLEAR_ALL')
    }
  },
  
  getters: {
    getError: (state) => (field) => state.errors[field] || validationService.getError(field),
    isTouched: (state) => (field) => state.touched[field],
    isValidating: (state) => (field) => state.validating[field],
    hasErrors: (state) => Object.keys(state.errors).length > 0 || !validationService.isFormValid(Object.keys(state.errors)),
    isValid: (state) => Object.keys(state.errors).length === 0 && validationService.isFormValid(Object.keys(state.errors))
  }
}
