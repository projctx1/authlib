<template>
  <div class="auth-input-wrapper" :class="wrapperClasses">
    <!-- Label Slot: Allows complete customization of label rendering -->
    <slot
      name="label"
      v-bind="{
        label,
        required,
        inputId,
        fieldName: 'password'
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
            <!-- Default lock icon -->
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
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
          showPassword,
          autocomplete,
          type: showPassword ? 'text' : 'password',
          attrs: {
            id: inputId,
            type: showPassword ? 'text' : 'password',
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
          :type="showPassword ? 'text' : 'password'"
          class="auth-input"
          :class="inputClasses"
          :placeholder="placeholder"
          :disabled="disabled"
          :autocomplete="autocomplete"
          @blur="handleBlur"
          @focus="handleFocus"
        />
      </slot>

      <!-- Toggle Visibility Slot -->
      <slot name="toggle" v-bind="{ showPassword, togglePasswordVisibility }">
        <span
          v-if="showToggle"
          class="auth-input-icon icon-right icon-clickable"
          @click="togglePasswordVisibility"
        >
          <!-- Eye icons for show/hide -->
          <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </span>
      </slot>
    </div>

    <!-- Password Strength Indicator Slot -->
    <slot
      name="strength"
      v-bind="{
        strength,
        strengthPercent,
        showStrengthIndicator,
        internalValue
      }"
    >
      <div v-if="showStrengthIndicator && internalValue" class="password-strength">
        <div class="strength-bar">
          <div
            class="strength-fill"
            :style="{ width: strengthPercent, backgroundColor: strength.color }"
          ></div>
        </div>
        <span class="strength-label" :style="{ color: strength.color }">
          {{ strength.label }}
        </span>
      </div>
    </slot>

    <!-- Error/Hint Slots -->
    <slot name="error" v-bind="{ error }">
      <p
        v-if="error"
        class="auth-input-error"
        role="alert"
      >
        {{ error }}
      </p>
    </slot>

    <slot name="hint" v-bind="{ hint }">
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

.auth-input.has-icon-right {
  padding-right: 2.75rem;
}

.auth-input-icon {
  position: absolute;
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

.auth-input-icon.icon-right {
  right: var(--auth-spacing-md, 1rem);
}

.auth-input-icon.icon-left {
  left: var(--auth-spacing-md, 1rem);
}

.auth-input-icon.icon-clickable {
  pointer-events: auto;
  cursor: pointer;
}

.auth-input-icon.icon-clickable:hover {
  color: var(--auth-primary-color, #3b82f6);
}

.auth-input-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

/* Password Strength Indicator */
.password-strength {
  margin-top: var(--auth-spacing-xs, 0.25rem);
  display: flex;
  align-items: center;
  gap: var(--auth-spacing-xs, 0.25rem);
}

.strength-bar {
  flex: 1;
  height: 4px;
  background-color: var(--bg-secondary);
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.strength-label {
  font-size: var(--auth-font-size-sm, 0.875rem);
  font-weight: 500;
  white-space: nowrap;
}

/* Error and Hint Messages */
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
import { getPasswordStrength, validatePassword } from '../../utils/validators'

export default {
  name: 'PasswordInput',

  props: {
    // Core functionality
    modelValue: {
      type: String,
      default: ''
    },

    // Display options
    label: {
      type: String,
      default: 'Password'
    },
    placeholder: {
      type: String,
      default: 'Enter your password'
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
    showToggle: {
      type: Boolean,
      default: true
    },
    showStrengthIndicator: {
      type: Boolean,
      default: false
    },
    autocomplete: {
      type: String,
      default: 'current-password'
    },

    // Validation options
    minLength: {
      type: Number,
      default: 8
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
      default: 'password'
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
    const inputId = ref(`password-${Math.random().toString(36).substr(2, 9)}`)
    const isFocused = ref(false)
    const isTouched = ref(false)
    const showPassword = ref(false)

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

    // Password strength calculation
    const strength = computed(() => getPasswordStrength(internalValue.value))

    const strengthPercent = computed(() => {
      const score = strength.value.score
      return `${(score / 6) * 100}%`
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
          'has-icon-right': props.showToggle,
          'has-value': !!internalValue.value
        }
      ]
    })

    // Validation logic
    const validateField = (value) => {
      let validationError = null

      // Check required field
      if (props.required && (!value || !value.trim())) {
        validationError = 'Password is required'
      }
      // Use password validator for comprehensive validation
      else if (value && value.trim()) {
        const passwordErrors = validatePassword(value, {
          minLength: props.minLength,
          requireLowercase: true,
          requireUppercase: true,
          requireNumbers: true,
          requireSymbols: false
        })

        if (passwordErrors.length > 0) {
          validationError = passwordErrors[0] // Show first error
        }
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

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
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
      showPassword,

      // Computed
      error,
      strength,
      strengthPercent,
      wrapperClasses,
      inputClasses,

      // Methods
      handleInput,
      updateValue,
      handleBlur,
      handleFocus,
      togglePasswordVisibility,
      validate,
      clearError,
      focus
    }
  }
}
</script>
