<template>
  <div class="auth-checkbox">
    <input
      :id="inputId"
      v-model="internalValue"
      type="checkbox"
      :disabled="disabled"
      @change="handleChange"
    />
    <label :for="inputId">
      <slot>{{ label }}</slot>
    </label>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  name: 'CheckboxInput',
  
  props: {
    modelValue: { type: Boolean, default: false },
    label: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  },
  
  emits: ['update:modelValue', 'change'],
  
  setup(props, { emit }) {
    const inputId = ref(`checkbox-${Math.random().toString(36).substr(2, 9)}`)
    
    const internalValue = computed({
      get: () => props.modelValue,
      set: (value) => {
        emit('update:modelValue', value)
      }
    })
    
    const handleChange = (event) => {
      emit('change', event.target.checked)
    }
    
    return {
      inputId,
      internalValue,
      handleChange
    }
  }
}
</script>
