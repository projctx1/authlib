<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <div class="brand-logo">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="2"/>
            <path d="M3 5L12 13L21 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1>Verify Email</h1>
        <p>Complete your login</p>
      </div>

      <div class="auth-step">
        <div class="verification-info">
          <div class="email-display">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="2"/>
              <path d="M3 5L12 13L21 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ maskedEmail }}</span>
          </div>
          <p class="verification-message">
            Enter the 6-digit verification code sent to your email
          </p>
        </div>

        <OTPInput
          v-model="otpCode"
          :length="6"
          :unstyled="false"
          @complete="handleOTPComplete"
        />

        <div class="form-row">
          <button @click="handleResendOTP" :disabled="isLoading" class="resend-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 12L12 4L20 12M4 12L12 20L20 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ isLoading ? 'Sending...' : 'Resend Code' }}
          </button>
          <button @click="goBack" class="back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Back
          </button>
        </div>

        <div v-if="error" class="error-message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ error }}
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="auth-links">
        <p>
          <router-link to="/login" class="link">Back to Login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

// Import enhanced SDK components
import { OTPInput } from '../index.js'

export default {
  name: 'VerifyEmailLogin',
  components: {
    OTPInput
  },

  setup() {
    const store = useStore()
    const router = useRouter()

    // Form data
    const otpCode = ref('')

    // Get email from store
    const email = computed(() => store.getters['auth/resetEmail'] || '')

    // Computed properties
    const isLoading = computed(() => store.getters['auth/isLoading'])
    const error = computed(() => store.getters['auth/error'])

    const maskedEmail = computed(() => {
      if (!email.value) return ''
      const [local, domain] = email.value.split('@')
      const masked = local.substring(0, 2) + '*'.repeat(local.length - 2)
      return `${masked}@${domain}`
    })

    // Methods
    const handleOTPComplete = (otp) => {
      otpCode.value = otp
      // Auto-submit when OTP is complete
      if (otp.length === 6) {
        handleSubmit()
      }
    }

    const handleSubmit = async () => {
      if (otpCode.value.length !== 6) {
        store.commit('auth/SET_ERROR', 'Please enter a valid 6-digit code')
        return
      }

      store.dispatch('auth/clearError')

      try {
        // Use SDK's OTP verification for login
        const result = await store.dispatch('auth/verifyLoginOTP', {
          email: email.value,
          code: otpCode.value
        })

        console.log('✅ Email Login Successful!')
        console.log('🔑 JWT Token:', store.getters['auth/token'])
        console.log('👤 User Data:', result.user)

        // Show success message
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Login successful! Welcome!'
        })

        // Redirect to dashboard
        router.push('/dashboard')

      } catch (error) {
        console.error('❌ OTP Verification failed:', error)
        otpCode.value = '' // Clear on error
      }
    }

    const handleResendOTP = async () => {
      try {
        await store.dispatch('auth/sendLoginOTP', { email: email.value })

        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'New verification code sent!'
        })
      } catch (error) {
        console.error('❌ Resend failed:', error)
      }
    }

    const goBack = () => {
      router.push('/login')
      store.dispatch('auth/clearError')
    }

    return {
      otpCode,
      email,
      isLoading,
      error,
      maskedEmail,
      handleOTPComplete,
      handleSubmit,
      handleResendOTP,
      goBack
    }
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.auth-container {
  width: 100%;
  max-width: 28rem;
  background: white;
  border-radius: 1rem;
  padding: 3rem 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.auth-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.brand-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: #667eea;
}

.auth-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.025em;
}

.auth-header p {
  margin: 0;
  color: #64748b;
  font-size: 1rem;
}

.auth-step {
  margin-bottom: 2rem;
}

/* Verification Info */
.verification-info {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
}

.email-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.email-display svg {
  color: #667eea;
  flex-shrink: 0;
}

.verification-message {
  color: #64748b;
  margin: 0;
  line-height: 1.5;
  font-size: 0.875rem;
}

/* Form Row */
.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
}

.resend-btn, .back-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.resend-btn:hover, .back-btn:hover {
  color: #5a67d8;
  background: #f8fafc;
}

.resend-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Error Message */
.error-message {
  background: #fef2f2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  border: 1px solid #fecaca;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
}

.error-message svg {
  flex-shrink: 0;
}

/* Auth Links */
.auth-links {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.auth-links p {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

.link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.link:hover {
  color: #5a67d8;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 480px) {
  .auth-page {
    padding: 0.5rem;
  }

  .auth-container {
    max-width: none;
    padding: 2rem 1.5rem;
  }

  .form-row {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}
</style>