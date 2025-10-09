<template>
  <AuthCard title="Two-Factor Authentication" :subtitle="subtitle">
    <form @submit.prevent="handleSubmit" class="auth-form">
      <div class="otp-info">
        <div class="otp-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <p class="otp-message">
          We've sent a 6-digit verification code to<br>
          <strong>{{ maskedEmail }}</strong>
        </p>
      </div>
      
      <OTPInput
        v-model="code"
        :length="6"
        show-timer
        show-resend
        @complete="handleComplete"
        @resend="handleResend"
      />
      
      <AlertMessage v-if="error" type="error" :message="error" />
      <AlertMessage v-if="success" type="success" :message="success" />
      
      <SubmitButton :is-loading="isLoading" :disabled="code.length !== 6" full-width>
        Verify & Sign In
      </SubmitButton>
      
      <div class="otp-actions">
        <TextButton @click="$emit('back-to-login')" class="back-button">
          ← Back to Login
        </TextButton>
        <TextButton @click="handleResend" :disabled="canResend === false" class="resend-button">
          Resend Code
        </TextButton>
      </div>
    </form>
  </AuthCard>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import AuthCard from '../cards/AuthCard.vue'
import OTPInput from '../inputs/OTPInput.vue'
import SubmitButton from '../buttons/SubmitButton.vue'
import TextButton from '../buttons/TextButton.vue'
import AlertMessage from '../feedback/AlertMessage.vue'

export default {
  name: 'OTPLoginForm',
  components: { AuthCard, OTPInput, SubmitButton, TextButton, AlertMessage },
  props: {
    email: {
      type: String,
      required: true
    }
  },
  emits: ['success', 'back-to-login'],
  
  setup(props, { emit }) {
    const store = useStore()
    const code = ref('')
    const isLoading = ref(false)
    const success = ref('')
    
    const error = computed(() => store.getters['auth/error'])
    const canResend = computed(() => store.getters['otp/canResend'])
    
    // Mask email for display (show first 2 chars and domain)
    const maskedEmail = computed(() => {
      if (!props.email) return ''
      const [local, domain] = props.email.split('@')
      if (local.length <= 2) return props.email
      const masked = local.substring(0, 2) + '*'.repeat(local.length - 2)
      return `${masked}@${domain}`
    })
    
    const subtitle = computed(() => {
      return `Enter the code sent to ${maskedEmail.value}`
    })
    
    onMounted(() => {
      // Send OTP for login verification
      store.dispatch('auth/sendLoginOTP', { 
        email: props.email,
        expirySeconds: 300 
      })
    })
    
    const handleComplete = async (otp) => {
      code.value = otp
      await handleSubmit()
    }
    
    const handleSubmit = async () => {
      if (code.value.length !== 6) return
      
      isLoading.value = true
      success.value = ''
      
      try {
        // Verify OTP and complete login
        const result = await store.dispatch('auth/verifyLoginOTP', {
          email: props.email,
          code: code.value
        })
        
        if (result.success) {
          // Log authentication success to console
          console.log('🎉 OTP Login Successful!')
          console.log('🔑 JWT Token:', store.getters['auth/token'])
          console.log('👤 User Data:', result.user)
          console.log('🔐 Is Authenticated:', store.getters['auth/isAuthenticated'])
          
          success.value = 'Login successful! Redirecting...'
          
          // Wait a bit longer to ensure store state is updated
          setTimeout(() => {
            console.log('🚀 OTPLoginForm: Emitting success event')
            emit('success', result.user)
          }, 100)
        }
      } catch (error) {
        // Error handled by store
        code.value = '' // Clear the code on error
      } finally {
        isLoading.value = false
      }
    }
    
    const handleResend = async () => {
      try {
        await store.dispatch('auth/sendLoginOTP', { 
          email: props.email,
          expirySeconds: 300 
        })
        
        success.value = 'New code sent to your email'
        setTimeout(() => {
          success.value = ''
        }, 3000)
      } catch (error) {
        // Error handled by store
      }
    }
    
    return { 
      code, 
      isLoading, 
      error, 
      success,
      canResend,
      maskedEmail,
      subtitle,
      handleComplete, 
      handleSubmit, 
      handleResend 
    }
  }
}
</script>

<style scoped>
.otp-info {
  text-align: center;
  margin-bottom: 2rem;
}

.otp-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  padding: 1rem;
  background-color: var(--primary-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.otp-icon svg {
  width: 2rem;
  height: 2rem;
  color: var(--primary-color);
}

.otp-message {
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

.otp-message strong {
  color: var(--text-primary);
  font-weight: 600;
}

.otp-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.back-button {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.back-button:hover {
  color: var(--text-primary);
}

.resend-button {
  color: var(--primary-color);
  font-size: 0.875rem;
}

.resend-button:disabled {
  color: var(--text-muted);
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .otp-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
