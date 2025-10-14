<template>
  <div class="auth-input-wrapper" :class="wrapperClasses">
    <!-- Label Slot: Allows complete customization of label rendering -->
    <slot
      name="label"
      v-bind="{
        label,
        required,
        inputId,
        fieldName: 'email'
      }"
    >
      <label
        v-if="label"
        :for="inputId"
        class="auth-input-label"
      >
        {{ label }}
        <span v-if="required" class="auth-input-required">*</span>
      </label>
    </slot>

    <div class="auth-input-container">
      <!-- Prefix Slot: Content before input (typically icon) -->
      <slot
        name="prefix"
        v-bind="{
          isFocused,
          hasError: !!error,
          hasValue: !!internalValue,
          isDisabled: disabled
        }"
      >
        <span
          v-if="showIcon"
          class="auth-input-icon"
          :class="{ 'is-focused': isFocused, 'has-error': !!error }"
        >
          <!-- Icon Slot: Customize just the icon -->
          <slot name="icon">
            <!-- Default email icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="20"
              height="20"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </slot>
        </span>
      </slot>

      <!-- Input Element Slot: Complete control over input element -->
      <slot
        name="input"
        v-bind="{
          inputId,
          value: internalValue,
          inputClasses,
          placeholder,
          disabled,
          autocomplete,
          type: 'email',
          attrs: {
            id: inputId,
            type: 'email',
            placeholder,
            disabled,
            autocomplete
          },
          events: {
            input: handleInput,
            blur: handleBlur,
            focus: handleFocus
          },
          // Helper methods
          updateValue,
          handleBlur,
          handleFocus
        }"
      >
        <input
          :id="inputId"
          :value="internalValue"
          @input="handleInput"
          type="email"
          class="auth-input"
          :class="inputClasses"
          :placeholder="placeholder"
          :disabled="disabled"
          :autocomplete="autocomplete"
          @blur="handleBlur"
          @focus="handleFocus"
        />
      </slot>

      <!-- Suffix Slot: Content after input -->
      <slot
        name="suffix"
        v-bind="{
          isFocused,
          hasError: !!error,
          hasValue: !!internalValue,
          isDisabled: disabled
        }"
      />
    </div>

    <!-- Error Message Slot -->
    <slot
      name="error"
      v-bind="{
        error,
        hasError: !!error,
        isTouched
      }"
    >
      <p
        v-if="error"
        class="auth-input-error"
        role="alert"
      >
        {{ error }}
      </p>
    </slot>

    <!-- Hint/Help Text Slot -->
    <slot
      name="hint"
      v-bind="{
        hint,
        hasHint: !!hint
      }"
    >
      <p
        v-if="hint && !error"
        class="auth-input-hint"
      >
        {{ hint }}
      </p>
    </slot>
  </div>
</template>

<style scoped>
/* Default styles - only applied when NOT in unstyled mode */
.auth-input-wrapper {
  margin-bottom: var(--auth-spacing-md, 1rem);
  width: 100%;
}

.auth-input-label {
  display: block;
  margin-bottom: var(--auth-spacing-xs, 0.25rem);
  font-size: var(--auth-font-size-sm, 0.875rem);
  font-weight: 500;
  color: var(--text-primary);
}

.auth-input-required {
  color: var(--auth-error-color, #ef4444);
  margin-left: var(--auth-spacing-xs, 0.25rem);
}

.auth-input-container {
  position: relative;
  width: 100%;
}

.auth-input {
  width: 100%;
  padding: var(--auth-spacing-md, 1rem);
  font-size: var(--auth-font-size-base, 1rem);
  font-family: var(--auth-font-family, inherit);
  color: var(--text-primary);
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--auth-border-radius-md, 0.5rem);
  transition: all 0.2s ease;
  outline: none;
}

.auth-input::placeholder {
  color: var(--text-tertiary);
}

.auth-input:focus {
  border-color: var(--auth-primary-color, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.auth-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: var(--bg-disabled);
}

.auth-input.has-error {
  border-color: var(--auth-error-color, #ef4444);
}

.auth-input.has-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.auth-input.has-icon {
  padding-left: 2.75rem;
}

.auth-input-icon {
  position: absolute;
  left: var(--auth-spacing-md, 1rem);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.auth-input-icon.is-focused {
  color: var(--auth-primary-color, #3b82f6);
}

.auth-input-icon.has-error {
  color: var(--auth-error-color, #ef4444);
}

.auth-input-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.auth-input-error {
  display: block;
  margin-top: var(--auth-spacing-xs, 0.25rem);
  color: var(--auth-error-color, #ef4444);
  font-size: var(--auth-font-size-sm, 0.875rem);
  line-height: 1.4;
}

.auth-input-hint {
  display: block;
  margin-top: var(--auth-spacing-xs, 0.25rem);
  color: var(--text-secondary);
  font-size: var(--auth-font-size-sm, 0.875rem);
  line-height: 1.4;
}

/* Unstyled mode - no default styles applied */
.auth-input-wrapper.unstyled {
  margin-bottom: 0;
}
</style>

<script>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { isValidEmail, getEmailError } from '../../utils/validators'

export default {
  name: 'EmailInput',

  props: {
    // Core functionality
    modelValue: {
      type: String,
      default: ''
    },

    // Display options
    label: {
      type: String,
      default: 'Email'
    },
    placeholder: {
      type: String,
      default: 'Enter your email'
    },
    hint: {
      type: String,
      default: ''
    },

    // Behavior
    required: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    validateOnBlur: {
      type: Boolean,
      default: true
    },
    validateOnInput: {
      type: Boolean,
      default: false
    },

    // Visual options
    showIcon: {
      type: Boolean,
      default: true
    },
    autocomplete: {
      type: String,
      default: 'email'
    },

    // Customization
    wrapperClass: {
      type: [String, Array, Object],
      default: ''
    },
    inputClass: {
      type: [String, Array, Object],
      default: ''
    },
    containerClass: {
      type: [String, Array, Object],
      default: ''
    },

    // Unstyled mode - complete control
    unstyled: {
      type: Boolean,
      default: false
    },

    // Custom validation
    customValidator: {
      type: Function,
      default: null
    },

    // Field name for validation store
    fieldName: {
      type: String,
      default: 'email'
    }
  },

  emits: [
    'update:modelValue',
    'blur',
    'focus',
    'input',
    'validate',
    'error',
    'valid'
  ],

  setup(props, { emit }) {
    const store = useStore()
    const inputId = ref(`email-${Math.random().toString(36).substr(2, 9)}`)
    const isFocused = ref(false)
    const isTouched = ref(false)

    // Two-way binding
    const internalValue = computed({
      get: () => props.modelValue,
      set: (value) => {
        emit('update:modelValue', value)
        emit('input', value)

        // Validate on input if enabled
        if (props.validateOnInput) {
          validateField(value)
        }
      }
    })

    // Get error from validation store
    const error = computed(() =>
      store.getters['validation/getError'](props.fieldName)
    )

    // Watch for error changes and emit
    watch(error, (newError) => {
      if (newError) {
        emit('error', newError)
      } else if (isTouched.value) {
        emit('valid')
      }
    })

    // Computed classes
    const wrapperClasses = computed(() => {
      if (props.unstyled) {
        return props.wrapperClass
      }

      return [
        'auth-input-wrapper',
        props.wrapperClass
      ]
    })

    const inputClasses = computed(() => {
      if (props.unstyled) {
        return props.inputClass
      }

      return [
        'auth-input',
        props.inputClass,
        {
          'has-error': error.value,
          'is-focused': isFocused.value,
          'is-disabled': props.disabled,
          'has-icon': props.showIcon,
          'has-value': !!internalValue.value
        }
      ]
    })

    // Validation logic
    const validateField = (value) => {
      // Use validators utility directly for better validation
      let validationError = null

      // Check required field
      if (props.required && (!value || !value.trim())) {
        validationError = 'Email is required'
      }
      // Check email format using our validator
      else if (value && value.trim()) {
        validationError = getEmailError(value.trim())
      }

      // Use custom validator if provided
      if (!validationError && props.customValidator) {
        const customError = props.customValidator(value)
        if (customError) {
          validationError = customError
        }
      }

      // Update validation store
      if (validationError) {
        store.commit('validation/SET_ERROR', {
          field: props.fieldName,
          error: validationError
        })
        emit('validate', { valid: false, error: validationError })
        return false
      } else {
        store.dispatch('validation/clearField', props.fieldName)
        emit('validate', { valid: true, error: null })
        return true
      }
    }

    // Event handlers
    const handleInput = (event) => {
      const value = event.target.value
      internalValue.value = value
    }

    const updateValue = (value) => {
      internalValue.value = value
    }

    const handleBlur = (event) => {
      isFocused.value = false
      isTouched.value = true

      store.dispatch('validation/touchField', props.fieldName)

      if (props.validateOnBlur) {
        validateField(internalValue.value)
      }

      emit('blur', event)
    }

    const handleFocus = (event) => {
      isFocused.value = true
      emit('focus', event)
    }

    // Public methods (exposed via ref)
    const validate = () => {
      return validateField(internalValue.value)
    }

    const clearError = () => {
      store.dispatch('validation/clearField', props.fieldName)
    }

    const focus = () => {
      const input = document.getElementById(inputId.value)
      input?.focus()
    }

    return {
      // Refs
      inputId,
      internalValue,
      isFocused,
      isTouched,

      // Computed
      error,
      wrapperClasses,
      inputClasses,

      // Methods
      handleInput,
      updateValue,
      handleBlur,
      handleFocus,
      validate,
      clearError,
      focus
    }
  }
}
</script>
