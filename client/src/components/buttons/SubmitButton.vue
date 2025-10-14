<template>
  <button
    type="submit"
    class="auth-button-primary"
    :class="buttonClasses"
    :disabled="disabled || isLoading"
    @click="handleClick"
  >
    <!-- Loading State Slot -->
    <slot v-if="isLoading" name="loading" v-bind="{ isLoading }">
      <div class="button-spinner"></div>
    </slot>

    <!-- Default Content Slot -->
    <slot v-else v-bind="{ text, disabled, isLoading }">
      <!-- Icon Slot (when not loading) -->
      <slot name="icon" v-bind="{ text }" />
      <span>{{ text }}</span>
    </slot>
  </button>
</template>

<style scoped>
/* Default styles - only applied when NOT in unstyled mode */
.auth-button-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--auth-spacing-xs, 0.25rem);
  padding: var(--auth-spacing-md, 1rem) var(--auth-spacing-lg, 1.5rem);
  font-size: var(--auth-font-size-base, 1rem);
  font-weight: 500;
  font-family: var(--auth-font-family, inherit);
  color: white;
  background-color: var(--auth-primary-color, #3b82f6);
  border: none;
  border-radius: var(--auth-border-radius-md, 0.5rem);
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  position: relative;
  overflow: hidden;
}

.auth-button-primary:hover:not(:disabled) {
  background-color: var(--auth-primary-hover, #2563eb);
  transform: translateY(-1px);
  box-shadow: var(--auth-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
}

.auth-button-primary:active:not(:disabled) {
  transform: translateY(0);
  background-color: var(--auth-primary-active, #1d4ed8);
}

.auth-button-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.auth-button-primary.loading {
  cursor: not-allowed;
  transform: none;
}

/* Button Sizes */
.auth-button-sm {
  padding: var(--auth-spacing-sm, 0.5rem) var(--auth-spacing-md, 1rem);
  font-size: var(--auth-font-size-sm, 0.875rem);
}

.auth-button-lg {
  padding: var(--auth-spacing-lg, 1.5rem) var(--auth-spacing-xl, 2rem);
  font-size: var(--auth-font-size-lg, 1.125rem);
}

/* Full Width */
.auth-button-primary.full-width {
  width: 100%;
}

/* Loading Spinner */
.button-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Variants */
.auth-button-secondary {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.auth-button-secondary:hover:not(:disabled) {
  background-color: var(--bg-tertiary);
  border-color: var(--border-hover);
}

.auth-button-danger {
  background-color: var(--auth-error-color, #ef4444);
}

.auth-button-danger:hover:not(:disabled) {
  background-color: #dc2626;
}

.auth-button-success {
  background-color: var(--auth-success-color, #10b981);
}

.auth-button-success:hover:not(:disabled) {
  background-color: #059669;
}

/* Unstyled mode - no default styles applied */
.auth-button-primary.unstyled {
  padding: 0;
  background: none;
  border: none;
  border-radius: 0;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
  cursor: inherit;
  transition: none;
  outline: none;
  position: static;
  overflow: visible;
}

.auth-button-primary.unstyled:hover:not(:disabled) {
  transform: none;
  box-shadow: none;
}

.auth-button-primary.unstyled:disabled {
  opacity: 1;
  cursor: inherit;
}

.auth-button-primary.unstyled.loading {
  cursor: inherit;
}
</style>

<script>
import { computed } from 'vue'

export default {
  name: 'SubmitButton',

  props: {
    // Core functionality
    text: {
      type: String,
      default: 'Submit'
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },

    // Layout options
    fullWidth: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String,
      default: 'primary'
    },

    // Size options
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },

    // Customization
    buttonClass: {
      type: [String, Array, Object],
      default: ''
    },

    // Unstyled mode - complete control
    unstyled: {
      type: Boolean,
      default: false
    },

    // Button type
    type: {
      type: String,
      default: 'submit',
      validator: (value) => ['submit', 'button', 'reset'].includes(value)
    }
  },

  emits: ['click'],

  setup(props, { emit }) {
    const buttonClasses = computed(() => {
      if (props.unstyled) {
        return props.buttonClass
      }

      return [
        'auth-button-primary',
        props.buttonClass,
        {
          'full-width': props.fullWidth,
          'loading': props.isLoading,
          [`auth-button-${props.variant}`]: props.variant !== 'primary',
          [`auth-button-${props.size}`]: props.size !== 'md'
        }
      ]
    })

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
