<template>
  <div class="auth-card" :class="cardClasses">
    <!-- Logo Slot -->
    <slot name="logo" v-bind="{ showLogo }">
      <div v-if="showLogo" class="auth-card-logo">
        <slot name="logo-content">
          <div style="font-size: 2rem; font-weight: bold; color: #3b82f6;">🔐</div>
        </slot>
      </div>
    </slot>

    <!-- Header Slot -->
    <slot name="header" v-bind="{ title, subtitle }">
      <div v-if="title || subtitle" class="auth-card-header">
        <slot name="title" v-bind="{ title }">
          <h2 v-if="title" class="auth-card-title">{{ title }}</h2>
        </slot>
        <slot name="subtitle" v-bind="{ subtitle }">
          <p v-if="subtitle" class="auth-card-subtitle">{{ subtitle }}</p>
        </slot>
      </div>
    </slot>

    <!-- Body/Content Slot -->
    <div class="auth-card-body">
      <slot></slot>
    </div>

    <!-- Footer Slot -->
    <slot name="footer">
      <div v-if="$slots.footer" class="auth-card-footer">
        <slot name="footer-content"></slot>
      </div>
    </slot>
  </div>
</template>

<style scoped>
/* Default styles - only applied when NOT in unstyled mode */
.auth-card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--auth-border-radius-lg, 0.75rem);
  padding: var(--auth-spacing-xl, 2rem);
  box-shadow: var(--auth-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
  max-width: 28rem;
  width: 100%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

/* Card Sizes */
.auth-card.size-sm {
  padding: var(--auth-spacing-lg, 1.5rem);
  max-width: 24rem;
}

.auth-card.size-lg {
  padding: var(--auth-spacing-xl, 2rem) var(--auth-spacing-xl, 2rem) var(--auth-spacing-xl, 2rem) var(--auth-spacing-xl, 2rem);
  max-width: 32rem;
}

/* No Padding Variant */
.auth-card.no-padding {
  padding: 0;
}

/* Logo Section */
.auth-card-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: var(--auth-spacing-lg, 1.5rem);
  padding: var(--auth-spacing-md, 1rem);
  background-color: var(--bg-secondary);
  border-radius: var(--auth-border-radius-full, 9999px);
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

/* Header Section */
.auth-card-header {
  text-align: center;
  margin-bottom: var(--auth-spacing-xl, 2rem);
}

.auth-card-title {
  font-size: var(--auth-font-size-xl, 1.25rem);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--auth-spacing-xs, 0.25rem) 0;
}

.auth-card-subtitle {
  font-size: var(--auth-font-size-base, 1rem);
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* Body Section */
.auth-card-body {
  margin-bottom: var(--auth-spacing-lg, 1.5rem);
}

/* Footer Section */
.auth-card-footer {
  margin-top: var(--auth-spacing-lg, 1.5rem);
  padding-top: var(--auth-spacing-lg, 1.5rem);
  border-top: 1px solid var(--border-color);
  text-align: center;
}

/* Variants */
.auth-card.variant-elevated {
  box-shadow: var(--auth-shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
}

.auth-card.variant-flat {
  box-shadow: none;
  border: none;
  background-color: transparent;
}

.auth-card.variant-bordered {
  border: 2px solid var(--border-color);
}

.auth-card.variant-minimal {
  background-color: transparent;
  border: 1px solid transparent;
  box-shadow: none;
  padding: var(--auth-spacing-lg, 1.5rem);
}

/* Unstyled mode - no default styles applied */
.auth-card.unstyled {
  background: none;
  border: none;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  max-width: none;
  width: auto;
  margin: 0;
  position: static;
  overflow: visible;
}
</style>

<script>
import { computed } from 'vue'

export default {
  name: 'AuthCard',

  props: {
    // Display options
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    showLogo: {
      type: Boolean,
      default: true
    },

    // Layout options
    variant: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },

    // Spacing options
    noPadding: {
      type: Boolean,
      default: false
    },

    // Customization
    cardClass: {
      type: [String, Array, Object],
      default: ''
    },

    // Unstyled mode - complete control
    unstyled: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const cardClasses = computed(() => {
      if (props.unstyled) {
        return props.cardClass
      }

      return [
        'auth-card',
        props.cardClass,
        {
          [`variant-${props.variant}`]: props.variant !== 'default',
          [`size-${props.size}`]: props.size !== 'md',
          'no-padding': props.noPadding
        }
      ]
    })

    return { cardClasses }
  }
}
</script>
