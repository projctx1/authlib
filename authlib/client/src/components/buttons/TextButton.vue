<template>
  <button
    type="button"
    class="auth-button-text"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot>{{ text }}</slot>
  </button>
</template>

<script>
export default {
  name: 'TextButton',
  
  props: {
    text: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  },
  
  emits: ['click'],
  
  setup(props, { emit }) {
    const handleClick = (event) => {
      if (!props.disabled) {
        emit('click', event)
      }
    }
    
    return {
      handleClick
    }
  }
}
</script>
