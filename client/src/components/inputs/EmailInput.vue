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
        type="email"
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </span>
    </div>
    
    <p v-if="error" class="auth-input-error">{{ error }}</p>
    <p v-else-if="hint" class="auth-input-hint">{{ hint }}</p>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'EmailInput',
  
  props: {
    modelValue: { type: String, default: '' },
    label: { type: String, default: 'Email' },
    placeholder: { type: String, default: 'Enter your email' },
    required: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    showIcon: { type: Boolean, default: true },
    autocomplete: { type: String, default: 'email' },
    hint: { type: String, default: '' },
    validateOnBlur: { type: Boolean, default: true }
  },
  
  emits: ['update:modelValue', 'blur', 'focus'],
  
  setup(props, { emit }) {
    const store = useStore()
    const inputId = ref(`email-${Math.random().toString(36).substr(2, 9)}`)
    const isFocused = ref(false)
    
    const internalValue = computed({
      get: () => props.modelValue,
      set: (value) => {
        emit('update:modelValue', value)
        if (!props.validateOnBlur) {
          validateEmail(value)
        }
      }
    })
    
    const error = computed(() => 
      store.getters['validation/getError']('email')
    )
    
    const inputClasses = computed(() => ({
      'has-error': error.value,
      'is-focused': isFocused.value,
      'is-disabled': props.disabled,
      'has-icon': props.showIcon
    }))
    
    const validateEmail = (value) => {
      const rules = []
      if (props.required) rules.push('required')
      rules.push('email')
      
      store.dispatch('validation/validateField', {
        field: 'email',
        value,
        rules
      })
    }
    
    const handleBlur = () => {
      isFocused.value = false
      store.dispatch('validation/touchField', 'email')
      if (props.validateOnBlur) {
        validateEmail(internalValue.value)
      }
      emit('blur')
    }
    
    const handleFocus = () => {
      isFocused.value = true
      emit('focus')
    }
    
    return {
      inputId,
      internalValue,
      error,
      inputClasses,
      handleBlur,
      handleFocus
    }
  }
}
</script>
