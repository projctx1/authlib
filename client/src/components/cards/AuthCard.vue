<template>
  <div class="auth-card" :class="cardClasses">
    <div v-if="showLogo || $slots.logo" class="auth-card-logo">
      <slot name="logo">
        <div style="font-size: 2rem; font-weight: bold; color: #3b82f6;">🔐</div>
      </slot>
    </div>
    
    <div v-if="title || subtitle" class="auth-card-header">
      <h2 v-if="title" class="auth-card-title">{{ title }}</h2>
      <p v-if="subtitle" class="auth-card-subtitle">{{ subtitle }}</p>
    </div>
    
    <div class="auth-card-body">
      <slot></slot>
    </div>
    
    <div v-if="$slots.footer" class="auth-card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'AuthCard',
  
  props: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    showLogo: { type: Boolean, default: true },
    variant: { type: String, default: 'default' }
  },
  
  setup(props) {
    const cardClasses = computed(() => ({
      [`variant-${props.variant}`]: props.variant !== 'default'
    }))
    
    return { cardClasses }
  }
}
</script>
