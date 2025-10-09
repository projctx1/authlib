<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>Verify Email</h1>
        <p>We've sent a verification code to your email</p>
      </div>

      <div class="auth-step">
        <div class="verification-info">
          <div class="email-display">
            📧 {{ email }}
          </div>
          <p class="verification-message">
            Enter the 6-digit code sent to your email to verify your account
          </p>
        </div>

        <div class="form-group">
          <label for="otp">Verification Code</label>
          <input
            id="otp"
            ref="otpInput"
            v-model="otp"
            type="text"
            class="form-input"
            placeholder="Enter 6-digit code"
            maxlength="6"
            pattern="[0-9]{6}"
            required
            @keyup.enter="handleSubmit"
          />
        </div>

        <div class="form-row">
          <button @click="handleResendOTP" :disabled="isLoading" class="resend-btn">
            {{ isLoading ? 'Sending...' : 'Resend Code' }}
          </button>
          <button @click="goBack" class="back-btn">← Back to Register</button>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          {{ success }}
        </div>

        <button
          @click="handleSubmit"
          :disabled="otp.length !== 6 || isLoading"
          class="submit-btn"
        >
          {{ isLoading ? 'Verifying...' : 'Verify Email' }}
        </button>
      </div>

      <!-- Navigation Links -->
      <div class="auth-links">
        <p>
          Already verified?
          <router-link to="/login" class="link">Sign in</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'VerifyRegistrationPage',
  setup() {
    const store = useStore()
    const router = useRouter()

    // Get email from store (set during registration)
    const email = computed(() => store.getters['auth/resetEmail'] || '')

    // Form data
    const otp = ref('')

    // Refs for input control
    const otpInput = ref(null)

    // Computed properties
    const isLoading = computed(() => store.getters['auth/isLoading'])
    const error = computed(() => store.getters['auth/error'])

    // Check if email exists on component mount
    onMounted(() => {
      if (!email.value) {
        console.warn('No email found for verification, redirecting to registration')
        router.push('/register')
      }
    })

    // Methods
    const handleSubmit = async () => {
      if (otp.value.length !== 6) {
        store.commit('auth/SET_ERROR', 'Please enter the 6-digit code')
        nextTick(() => otpInput.value?.focus())
        return
      }

      store.dispatch('auth/clearError')

      try {
        const result = await store.dispatch('auth/verifyLoginOTP', {
          email: email.value,
          code: otp.value
        })

        console.log('✅ Email Verification Successful!')
        console.log('🔑 JWT Token:', store.getters['auth/token'])
        console.log('👤 User Data:', result.user)

        // Show success message and redirect to dashboard
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Email verified successfully! Welcome aboard!'
        })

        router.push('/dashboard')
      } catch (e) {
        otp.value = ''
        nextTick(() => otpInput.value?.focus())
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
        // Error handled by store
      }
    }

    const goBack = () => {
      router.push('/register')
    }

    return {
      email,
      otp,
      isLoading,
      error,
      otpInput,
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
  background: #fff;
}

.auth-container {
  width: 100%;
  max-width: 28rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.auth-header p {
  margin: 0;
  color: #666;
}

.auth-step {
  margin-bottom: 1.5rem;
}

.verification-info {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
}

.email-display {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.verification-message {
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s;
  text-align: center;
  font-family: monospace;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
}

.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  border: 1px solid #fcc;
}

.success-message {
  background: #efe;
  color: #363;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  border: 1px solid #cfc;
}

.submit-btn {
  width: 100%;
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #0056b3;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.resend-btn, .back-btn {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.5rem;
  transition: color 0.2s;
}

.resend-btn:hover, .back-btn:hover {
  color: #0056b3;
}

.resend-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.auth-links {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.auth-links p {
  margin: 0;
  color: #666;
}

.link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  color: #0056b3;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .auth-page {
    padding: 0.5rem;
  }

  .auth-container {
    max-width: none;
  }

  .form-row {
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }
}
</style>