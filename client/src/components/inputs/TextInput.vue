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
        :type="type"
        class="auth-input"
        :class="inputClasses"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :minlength="minlength"
        :maxlength="maxlength"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <span v-if="icon" class="auth-input-icon">
        <component :is="icon" />
      </span>
    </div>
    
    <p v-if="error" class="auth-input-error">{{ error }}</p>
    <p v-else-if="hint" class="auth-input-hint">{{ hint }}</p>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { validateField as validateFieldUtil } from '../../utils/validators'

export default {
  name: 'TextInput',
  
  props: {
    modelValue: { type: String, default: '' },
    fieldName: { type: String, default: 'text' },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    type: { type: String, default: 'text' },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    icon: { type: Object, default: null },
    autocomplete: { type: String, default: 'off' },
    hint: { type: String, default: '' },
    validateOnBlur: { type: Boolean, default: true },
    minlength: { type: Number, default: null },
    maxlength: { type: Number, default: null },
    rules: { type: Array, default: () => [] }
  },
  
  emits: ['update:modelValue', 'blur', 'focus'],
  
  setup(props, { emit }) {
    const store = useStore()
    const inputId = ref(`${props.fieldName}-${Math.random().toString(36).substr(2, 9)}`)
    const isFocused = ref(false)
    
    const internalValue = computed({
      get: () => props.modelValue,
      set: (value) => {
        emit('update:modelValue', value)
        if (!props.validateOnBlur) {
          validateField(value)
        }
      }
    })
    
    const error = computed(() => 
      store.getters['validation/getError'](props.fieldName)
    )
    
    const inputClasses = computed(() => ({
      'has-error': error.value,
      'is-focused': isFocused.value,
      'is-disabled': props.disabled,
      'has-icon': props.icon
    }))
    
    const validateField = (value) => {
      const validationRules = [...props.rules]
      if (props.required) validationRules.unshift('required')
      if (props.minlength) validationRules.push({ minLength: props.minlength })
      if (props.maxlength) validationRules.push({ maxLength: props.maxlength })

      // Use the validators utility for comprehensive validation
      const error = validateFieldUtil(value, validationRules)

      if (error) {
        store.commit('validation/SET_ERROR', {
          field: props.fieldName,
          error
        })
      } else {
        store.dispatch('validation/clearField', props.fieldName)
      }
    }
    
    const handleBlur = () => {
      isFocused.value = false
      store.dispatch('validation/touchField', props.fieldName)
      if (props.validateOnBlur) {
        validateField(internalValue.value)
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
