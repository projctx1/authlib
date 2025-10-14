<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <div class="brand-logo">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1>Welcome Back</h1>
        <p>Sign in to your account</p>
      </div>

      <!-- Login Mode Toggle -->
      <div class="login-mode-toggle">
        <button
          @click="loginMode = 'traditional'"
          class="mode-btn"
          :class="{ active: loginMode === 'traditional' }"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="2"/>
            <path d="M3 5L12 13L21 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Email + Password
        </button>
        <button
          @click="loginMode = 'email-only'"
          class="mode-btn"
          :class="{ active: loginMode === 'email-only' }"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="16" r="1" stroke="currentColor" stroke-width="2"/>
            <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Email Only
        </button>
      </div>

      <!-- Traditional Login Form -->
      <div v-if="loginMode === 'traditional'" class="auth-step">
        <!-- Email Input -->
        <EmailInput
          v-model="email"
          :unstyled="false"
          placeholder="Enter your email address"
          :validate-on-blur="true"
          @validate="handleEmailValidation"
        >
          <template #label="{ label, required }">
            <label class="custom-label">
              {{ label }}<span v-if="required" class="required">*</span>
            </label>
          </template>

          <template #input="{ inputId, value, updateValue, handleBlur, handleFocus }">
            <div class="input-wrapper">
              <div class="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M3 5L12 13L21 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <input
                :id="inputId"
                :value="value"
                @input="updateValue($event.target.value)"
                @blur="handleBlur"
                @focus="handleFocus"
                type="email"
                class="custom-input"
                placeholder="Enter your email address"
              />
              <div class="input-underline"></div>
            </div>
          </template>

          <template #error="{ error }">
            <div v-if="error" class="custom-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>{{ error }}</span>
            </div>
          </template>
        </EmailInput>

        <!-- Password Input -->
        <PasswordInput
          v-model="password"
          :unstyled="true"
          :show-toggle="true"
          placeholder="Enter your password"
          :validate-on-blur="true"
          @validate="handlePasswordValidation"
        >
          <template #label="{ label, required }">
            <label class="custom-label">
              {{ label }}<span v-if="required" class="required">*</span>
            </label>
          </template>

          <template #input="{ inputId, value, updateValue, handleBlur, handleFocus, showPassword }">
            <div class="input-wrapper">
              <div class="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="16" r="1" stroke="currentColor" stroke-width="2"/>
                  <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <input
                :id="inputId"
                :value="value"
                @input="updateValue($event.target.value)"
                @blur="handleBlur"
                @focus="handleFocus"
                :type="showPassword ? 'text' : 'password'"
                class="custom-input"
                placeholder="Enter your password"
              />
              <div class="input-underline"></div>
            </div>
          </template>

          <template #error="{ error }">
            <div v-if="error" class="custom-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>{{ error }}</span>
            </div>
          </template>
        </PasswordInput>

        <SubmitButton
          :is-loading="isLoading"
          :disabled="!isTraditionalFormValid || isLoading"
          :unstyled="true"
          @click="handleTraditionalSubmit"
        >
          <template #loading>
            <div class="custom-spinner"></div>
          </template>

          <template #default>
            <span>{{ isLoading ? 'Signing In...' : 'Sign In' }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
        </SubmitButton>
      </div>

      <!-- Email-Only Login Form -->
      <div v-if="loginMode === 'email-only'" class="auth-step">
        <!-- Email Input for OTP Login -->
        <EmailInput
          v-model="email"
          :unstyled="true"
          placeholder="Enter your email address"
          :validate-on-blur="true"
          @validate="handleEmailValidation"
        >
          <template #label="{ label, required }">
            <label class="custom-label">
              {{ label }}<span v-if="required" class="required">*</span>
            </label>
          </template>

          <template #input="{ inputId, value, updateValue, handleBlur, handleFocus }">
            <div class="input-wrapper">
              <div class="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M3 5L12 13L21 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <input
                :id="inputId"
                :value="value"
                @input="updateValue($event.target.value)"
                @blur="handleBlur"
                @focus="handleFocus"
                type="email"
                class="custom-input"
                placeholder="Enter your email address"
              />
              <div class="input-underline"></div>
            </div>
          </template>

          <template #error="{ error }">
            <div v-if="error" class="custom-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>{{ error }}</span>
            </div>
          </template>
        </EmailInput>

        <SubmitButton
          :is-loading="isLoading"
          :disabled="!isEmailValid || isLoading"
          :unstyled="true"
          @click="handleEmailSubmit"
        >
          <template #loading>
            <div class="custom-spinner"></div>
          </template>

          <template #default>
            <span>{{ isLoading ? 'Sending Code...' : 'Send Verification Code' }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
        </SubmitButton>
      </div>


      <!-- Navigation Links -->
      <div class="auth-links">
        <p>
          Don't have an account?
          <router-link to="/register" class="link">Create one</router-link>
        </p>
        <p>
          <router-link to="/forgot-password" class="link">Forgot your password?</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { isValidEmail } from '../utils/validators'

// Import enhanced SDK components
import { EmailInput, PasswordInput, SubmitButton } from '../index.js'

export default {
  name: 'LoginPage',
  components: {
    EmailInput,
    PasswordInput,
    SubmitButton
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    // Form data
    const email = ref('')
    const password = ref('')
    const loginMode = ref('email-only') // 'traditional' or 'email-only'

    // Computed properties
    const isLoading = computed(() => store.getters['auth/isLoading'])
    const error = computed(() => store.getters['auth/error'])

    const isEmailValid = computed(() => {
      return email.value.trim() !== '' && isValidEmail(email.value)
    })

    const isTraditionalFormValid = computed(() => {
      return email.value.trim() !== '' &&
             password.value.trim() !== '' &&
             isValidEmail(email.value) &&
             password.value.length >= 6
    })


    // Methods
    const handleEmailValidation = ({ valid }) => {
      // Email validation is handled by the component
    }

    const handlePasswordValidation = ({ valid }) => {
      // Password validation is handled by the component
    }

    const handleTraditionalSubmit = async () => {
      if (!isTraditionalFormValid.value) {
        return
      }

      store.dispatch('auth/clearError')

      try {
        const result = await store.dispatch('auth/login', {
          email: email.value,
          password: password.value
        })

        console.log('✅ Traditional Login Successful!')
        console.log('🔑 JWT Token:', store.getters['auth/token'])
        console.log('👤 User Data:', result.user)

        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Login successful!'
        })

        router.push('/dashboard')
      } catch (error) {
        console.error('❌ Traditional login failed:', error)
        // Error is handled by the store and displayed in the form
      }
    }

    const handleEmailSubmit = async () => {
      if (!isEmailValid.value) {
        return
      }

      store.dispatch('auth/clearError')

      try {
        // Send OTP - backend will create user if doesn't exist
        await store.dispatch('auth/sendLoginOTP', { email: email.value })

        // Store email for verification page
        store.commit('auth/SET_RESET_EMAIL', email.value)

        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Verification code sent to your email!'
        })

        // Redirect to OTP verification page (same pattern as registration)
        router.push('/verify-email-login')
      } catch (error) {
        console.error('Failed to send OTP:', error)
        store.commit('auth/SET_ERROR', 'Unable to send verification code. Please try again.')
      }
    }


    return {
      email,
      password,
      loginMode,
      isLoading,
      error,
      isEmailValid,
      isTraditionalFormValid,
      handleEmailValidation,
      handlePasswordValidation,
      handleEmailSubmit,
      handleTraditionalSubmit
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

/* Login Mode Toggle */
.login-mode-toggle {
  display: flex;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.25rem;
  margin-bottom: 2rem;
}

.mode-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-btn:hover {
  color: #475569;
  background: #f1f5f9;
}

.mode-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.mode-btn svg {
  width: 1rem;
  height: 1rem;
}

/* Custom Labels */
.custom-label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.required {
  color: #ef4444;
  margin-left: 0.25rem;
}

/* Input Wrapper */
.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  z-index: 1;
}

.custom-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  color: #374151;
  transition: all 0.3s ease;
  outline: none;
}

.custom-input::placeholder {
  color: #9ca3af;
}

.custom-input:focus {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.custom-input:focus + .input-underline {
  width: 100%;
}

.input-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

/* Custom Errors */
.custom-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
}

.custom-error svg {
  flex-shrink: 0;
}

/* Custom Buttons */
.custom-submit-btn {
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.custom-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.custom-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.custom-submit-btn svg {
  transition: transform 0.2s ease;
}

.custom-submit-btn:hover:not(:disabled) svg {
  transform: translateX(2px);
}

/* Custom Spinner */
.custom-spinner {
  width: 1.25rem;
  height: 1.25rem;
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

/* OTP Grid */
.otp-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.otp-box {
  width: 100%;
  height: 60px;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.2s;
  background: #f8fafc;
  color: #374151;
}

.otp-box:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.otp-box.filled {
  border-color: #667eea;
  background: white;
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
  margin: 0.75rem 0;
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

  .otp-grid {
    gap: 0.25rem;
  }

  .otp-box {
    height: 50px;
    font-size: 1.25rem;
  }
}
</style>