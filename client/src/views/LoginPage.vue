<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>Sign In</h1>
        <p>Choose your preferred sign-in method</p>
      </div>

      <!-- Email Input Step -->
      <div v-if="currentStep === 'email'" class="auth-step">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            id="email"
            ref="emailInput"
            v-model="email"
            type="email"
            class="form-input"
            placeholder="Enter your email"
            required
            @keyup.enter="handleEmailSubmit"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button
          @click="handleEmailSubmit"
          :disabled="!isEmailValid || isLoading"
          class="submit-btn"
        >
          {{ isLoading ? 'Please wait...' : 'Continue' }}
        </button>
      </div>

      <!-- Method Selection Step -->
      <div v-else-if="currentStep === 'method'" class="auth-step">
        <div class="user-info">
          <p><strong>{{ email }}</strong></p>
          <p>How would you like to sign in?</p>
        </div>

        <div class="method-options">
          <button @click="selectMethod('password')" class="method-btn">
            <span class="method-icon">🔑</span>
            <span>Use Password</span>
          </button>

          <button @click="selectMethod('otp')" class="method-btn">
            <span class="method-icon">📧</span>
            <span>Email OTP</span>
          </button>
        </div>

        <button @click="goBack" class="back-btn">← Back</button>
      </div>

      <!-- Password Login Step -->
      <div v-else-if="currentStep === 'password'" class="auth-step">
        <div class="user-info">
          <p><strong>{{ email }}</strong></p>
          <button @click="goBack" class="change-email-btn">Change</button>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            ref="passwordInput"
            v-model="password"
            type="password"
            class="form-input"
            placeholder="Enter your password"
            required
            @keyup.enter="handlePasswordSubmit"
          />
        </div>

        <div class="form-row">
          <label class="checkbox-label">
            <input v-model="rememberMe" type="checkbox" />
            Remember me
          </label>
          <button @click="goToForgotPassword" class="forgot-password-btn">
            Forgot password?
          </button>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button
          @click="handlePasswordSubmit"
          :disabled="!password || isLoading"
          class="submit-btn"
        >
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>
      </div>

      <!-- OTP Login Step -->
      <div v-else-if="currentStep === 'otp'" class="auth-step">
        <div class="otp-info">
          <p>We've sent a 6-digit code to</p>
          <p><strong>{{ maskedEmail }}</strong></p>
        </div>

        <div class="form-group">
          <label for="otp">Verification Code</label>
          <input
            id="otp"
            ref="otpInput"
            v-model="otpCode"
            type="text"
            class="form-input"
            placeholder="Enter 6-digit code"
            maxlength="6"
            pattern="[0-9]{6}"
            required
            @keyup.enter="handleOTPSubmit"
          />
        </div>

        <div class="form-row">
          <button @click="handleResendOTP" :disabled="isLoading" class="resend-btn">
            {{ isLoading ? 'Sending...' : 'Resend Code' }}
          </button>
          <button @click="goBack" class="back-btn">← Back</button>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          {{ success }}
        </div>

        <button
          @click="handleOTPSubmit"
          :disabled="otpCode.length !== 6 || isLoading"
          class="submit-btn"
        >
          {{ isLoading ? 'Verifying...' : 'Verify & Sign In' }}
        </button>
      </div>

      <!-- Navigation Links -->
      <div class="auth-links">
        <p>
          Don't have an account?
          <router-link to="/register" class="link">Sign up</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { isValidEmail } from '../utils/validators'

export default {
  name: 'LoginPage',
  setup() {
    const store = useStore()
    const router = useRouter()

    // Form data
    const email = ref('')
    const password = ref('')
    const otpCode = ref('')
    const rememberMe = ref(false)
    const currentStep = ref('email') // 'email', 'method', 'password', 'otp'
    const success = ref('')

    // Refs for input control
    const emailInput = ref(null)
    const passwordInput = ref(null)
    const otpInput = ref(null)

    // Computed properties
    const isLoading = computed(() => store.getters['auth/isLoading'])
    const error = computed(() => store.getters['auth/error'])

    const isEmailValid = computed(() => {
      return email.value.trim() !== '' && isValidEmail(email.value)
    })

    const maskedEmail = computed(() => {
      if (!email.value) return ''
      const [local, domain] = email.value.split('@')
      const masked = local.substring(0, 2) + '*'.repeat(local.length - 2)
      return `${masked}@${domain}`
    })

    // Methods
    const handleEmailSubmit = async () => {
      if (!isEmailValid.value) {
        store.commit('auth/SET_ERROR', 'Please enter a valid email address')
        nextTick(() => emailInput.value?.focus())
        return
      }

      store.dispatch('auth/clearError')
      currentStep.value = 'method'
    }

    const selectMethod = async (method) => {
      if (method === 'password') {
        currentStep.value = 'password'
        nextTick(() => passwordInput.value?.focus())
      } else if (method === 'otp') {
        try {
          await store.dispatch('auth/sendLoginOTP', { email: email.value })
          currentStep.value = 'otp'
          success.value = 'Verification code sent to your email!'
          nextTick(() => otpInput.value?.focus())
          setTimeout(() => { success.value = '' }, 3000)
        } catch (e) {
          // Error handled by store
        }
      }
    }

    const handlePasswordSubmit = async () => {
      if (!password.value.trim()) {
        store.commit('auth/SET_ERROR', 'Password is required')
        nextTick(() => passwordInput.value?.focus())
        return
      }

      store.dispatch('auth/clearError')

      try {
        const result = await store.dispatch('auth/login', {
          email: email.value,
          password: password.value
        })

        console.log('✅ Password Login Successful!')
        console.log('🔑 JWT Token:', store.getters['auth/token'])
        console.log('👤 User Data:', result.user)
        console.log('🔐 Is Authenticated:', store.getters['auth/isAuthenticated'])

        router.push('/dashboard')
      } catch (e) {
        nextTick(() => passwordInput.value?.focus())
      }
    }

    const handleOTPSubmit = async () => {
      if (otpCode.value.length !== 6) {
        store.commit('auth/SET_ERROR', 'Please enter the 6-digit code')
        nextTick(() => otpInput.value?.focus())
        return
      }

      store.dispatch('auth/clearError')

      try {
        const result = await store.dispatch('auth/verifyLoginOTP', {
          email: email.value,
          code: otpCode.value
        })

        console.log('✅ OTP Login Successful!')
        console.log('🔑 JWT Token:', store.getters['auth/token'])
        console.log('👤 User Data:', result.user)
        console.log('🔐 Is Authenticated:', store.getters['auth/isAuthenticated'])

        router.push('/dashboard')
      } catch (e) {
        otpCode.value = ''
        nextTick(() => otpInput.value?.focus())
      }
    }

    const handleResendOTP = async () => {
      try {
        await store.dispatch('auth/sendLoginOTP', { email: email.value })
        success.value = 'New code sent to your email'
        setTimeout(() => { success.value = '' }, 3000)
      } catch (error) {
        // Error handled by store
      }
    }

    const goBack = () => {
      if (currentStep.value === 'method') {
        currentStep.value = 'email'
        nextTick(() => emailInput.value?.focus())
      } else if (currentStep.value === 'password' || currentStep.value === 'otp') {
        currentStep.value = 'method'
      }
      store.dispatch('auth/clearError')
    }

    const goToForgotPassword = () => {
      router.push('/forgot-password')
    }

    return {
      email,
      password,
      otpCode,
      rememberMe,
      currentStep,
      success,
      isLoading,
      error,
      isEmailValid,
      maskedEmail,
      emailInput,
      passwordInput,
      otpInput,
      handleEmailSubmit,
      selectMethod,
      handlePasswordSubmit,
      handleOTPSubmit,
      handleResendOTP,
      goBack,
      goToForgotPassword
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
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
}

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
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

.method-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.method-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.method-btn:hover {
  border-color: #007bff;
  background: #f8f9fa;
}

.method-icon {
  font-size: 1.25rem;
}

.user-info {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.375rem;
}

.user-info p {
  margin: 0.25rem 0;
}

.otp-info {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.375rem;
}

.otp-info p {
  margin: 0.25rem 0;
}

.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
}

.forgot-password-btn, .resend-btn, .back-btn, .change-email-btn {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0;
  transition: color 0.2s;
}

.forgot-password-btn:hover, .resend-btn:hover, .back-btn:hover, .change-email-btn:hover {
  color: #0056b3;
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
    align-items: flex-start;
  }
}
</style>