import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

/**
 * Form validation composable for Vue Auth SDK
 * Provides reusable form validation logic and state
 */
export function useFormValidation(fieldName, rules = []) {
  const store = useStore()
  const isTouched = ref(false)
  const customErrors = ref({})

  const error = computed(() =>
    customErrors.value[fieldName] ||
    store.getters['validation/getError'](fieldName)
  )

  const isValid = computed(() => !error.value && isTouched.value)
  const hasError = computed(() => !!error.value)

  // Watch for error changes and emit
  watch(error, (newError) => {
    if (newError) {
      // Error occurred
    } else if (isTouched.value) {
      // Field became valid
    }
  })

  const validate = (value) => {
    const validationRules = [...rules]

    // Use custom validator if provided
    const customValidator = customErrors.value[`${fieldName}Validator`]
    if (customValidator) {
      const customError = customValidator(value)
      if (customError) {
        store.commit('validation/SET_ERROR', {
          field: fieldName,
          error: customError
        })
        return false
      }
    }

    const isValid = store.dispatch('validation/validateField', {
      field: fieldName,
      value,
      rules: validationRules
    })

    return isValid
  }

  const touch = () => {
    isTouched.value = true
    store.dispatch('validation/touchField', fieldName)
  }

  const reset = () => {
    isTouched.value = false
    store.dispatch('validation/clearField', fieldName)
    customErrors.value[fieldName] = null
  }

  const setCustomError = (errorMessage) => {
    customErrors.value[fieldName] = errorMessage
    store.commit('validation/SET_ERROR', {
      field: fieldName,
      error: errorMessage
    })
  }

  const clearCustomError = () => {
    customErrors.value[fieldName] = null
    store.dispatch('validation/clearField', fieldName)
  }

  const setCustomValidator = (validatorFn) => {
    customErrors.value[`${fieldName}Validator`] = validatorFn
  }

  return {
    // State
    error,
    isValid,
    hasError,
    isTouched,

    // Methods
    validate,
    touch,
    reset,
    setCustomError,
    clearCustomError,
    setCustomValidator
  }
}

/**
 * Multi-field form validation composable
 */
export function useFormValidationGroup(fields = []) {
  const store = useStore()
  const touchedFields = ref(new Set())

  const errors = computed(() => {
    const fieldErrors = {}
    fields.forEach(field => {
      fieldErrors[field] = store.getters['validation/getError'](field)
    })
    return fieldErrors
  })

  const isValid = computed(() => {
    return fields.every(field => !errors.value[field]) && touchedFields.value.size > 0
  })

  const hasErrors = computed(() => {
    return fields.some(field => !!errors.value[field])
  })

  const validateAll = (values) => {
    const results = {}
    fields.forEach(field => {
      const value = values[field]
      results[field] = store.dispatch('validation/validateField', {
        field,
        value,
        rules: [] // Add rules as needed
      })
    })
    return results
  }

  const touchAll = () => {
    fields.forEach(field => {
      touchedFields.value.add(field)
      store.dispatch('validation/touchField', field)
    })
  }

  const resetAll = () => {
    fields.forEach(field => {
      store.dispatch('validation/clearField', field)
    })
    touchedFields.value.clear()
  }

  return {
    errors,
    isValid,
    hasErrors,
    validateAll,
    touchAll,
    resetAll
  }
}