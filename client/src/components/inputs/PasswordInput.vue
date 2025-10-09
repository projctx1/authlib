<template>
  <div class="auth-input-wrapper">
    <label v-if="label" :for="inputId" class="auth-input-label">
      {{ label }}
      <span v-if="required" class="auth-input-required">*</span>
    </label>
    
    <div class="auth-input-container">
      <input
        :id="inputId"
        v-model="internalValue"
        :type="showPassword ? 'text' : 'password'"
        class="auth-input"
        :class="inputClasses"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <span v-if="showIcon" class="auth-input-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </span>
      
      <span 
        v-if="showToggle" 
        class="auth-input-icon icon-right icon-clickable"
        @click="togglePasswordVisibility"
      >
        <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </span>
    </div>
    
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
    
    <p v-if="error" class="auth-input-error">{{ error }}</p>
    <p v-else-if="hint" class="auth-input-hint">{{ hint }}</p>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { getPasswordStrength } from '../../utils/validators'

export default {
  name: 'PasswordInput',
  
  props: {
    modelValue: { type: String, default: '' },
    label: { type: String, default: 'Password' },
    placeholder: { type: String, default: 'Enter your password' },
    required: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    showIcon: { type: Boolean, default: true },
    showToggle: { type: Boolean, default: true },
    showStrengthIndicator: { type: Boolean, default: false },
    autocomplete: { type: String, default: 'current-password' },
    hint: { type: String, default: '' },
    validateOnBlur: { type: Boolean, default: true },
    minLength: { type: Number, default: 8 }
  },
  
  emits: ['update:modelValue', 'blur', 'focus'],
  
  setup(props, { emit }) {
    const store = useStore()
    const inputId = ref(`password-${Math.random().toString(36).substr(2, 9)}`)
    const isFocused = ref(false)
    const showPassword = ref(false)
    
    const internalValue = computed({
      get: () => props.modelValue,
      set: (value) => {
        emit('update:modelValue', value)
        if (!props.validateOnBlur) {
          validatePassword(value)
        }
      }
    })
    
    const error = computed(() => 
      store.getters['validation/getError']('password')
    )
    
    const strength = computed(() => getPasswordStrength(internalValue.value))
    
    const strengthPercent = computed(() => {
      const score = strength.value.score
      return `${(score / 6) * 100}%`
    })
    
    const inputClasses = computed(() => ({
      'has-error': error.value,
      'is-focused': isFocused.value,
      'is-disabled': props.disabled,
      'has-icon': props.showIcon,
      'has-icon-right': props.showToggle
    }))
    
    const validatePassword = (value) => {
      const rules = []
      if (props.required) rules.push('required')
      if (props.showStrengthIndicator) {
        rules.push('password')
      } else {
        rules.push({ minLength: props.minLength })
      }
      
      store.dispatch('validation/validateField', {
        field: 'password',
        value,
        rules
      })
    }
    
    const handleBlur = () => {
      isFocused.value = false
      store.dispatch('validation/touchField', 'password')
      if (props.validateOnBlur) {
        validatePassword(internalValue.value)
      }
      emit('blur')
    }
    
    const handleFocus = () => {
      isFocused.value = true
      emit('focus')
    }
    
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }
    
    return {
      inputId,
      internalValue,
      error,
      inputClasses,
      showPassword,
      strength,
      strengthPercent,
      handleBlur,
      handleFocus,
      togglePasswordVisibility
    }
  }
}
</script>
