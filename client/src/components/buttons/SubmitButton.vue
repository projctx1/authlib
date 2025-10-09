<template>
  <button
    type="submit"
    class="auth-button-primary"
    :class="buttonClasses"
    :disabled="disabled || isLoading"
    @click="handleClick"
  >
    <div v-if="isLoading" class="button-spinner"></div>
    <span v-else>
      <slot>{{ text }}</slot>
    </span>
  </button>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'SubmitButton',
  
  props: {
    text: { type: String, default: 'Submit' },
    isLoading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    fullWidth: { type: Boolean, default: false },
    variant: { type: String, default: 'primary' }
  },
  
  emits: ['click'],
  
  setup(props, { emit }) {
    const buttonClasses = computed(() => ({
      'full-width': props.fullWidth,
      'loading': props.isLoading,
      [`auth-button-${props.variant}`]: props.variant !== 'primary'
    }))
    
    const handleClick = (event) => {
      if (!props.disabled && !props.isLoading) {
        emit('click', event)
      }
    }
    
    return {
      buttonClasses,
      handleClick
    }
  }
}
</script>
