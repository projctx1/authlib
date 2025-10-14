<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <div class="brand-logo">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="16" r="1" stroke="currentColor" stroke-width="2"/>
            <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1>Set New Password</h1>
        <p>Enter the verification code and your new password</p>
      </div>

      <div class="auth-step">
        <!-- Email Input -->
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

        <!-- OTP Input -->
        <OTPInput
          v-model="otp"
          :length="6"
          :unstyled="true"
          @complete="handleOTPComplete"
        >
          <template #label="{ label, required }">
            <label class="custom-label">
              {{ label }}<span v-if="required" class="required">*</span>
            </label>
          </template>

          <template #input="{ digits, handleInput, handleKeydown }">
            <div class="otp-grid">
              <input
                v-for="(digit, index) in digits"
                :key="index"
                v-model="digits[index]"
                @input="handleInput(index, $event)"
                @keydown="handleKeydown(index, $event)"
                type="text"
                maxlength="1"
                class="otp-box"
                :class="{ filled: digit }"
              />
            </div>
          </template>
        </OTPInput>

        <!-- New Password Input -->
        <PasswordInput
          v-model="newPassword"
          :unstyled="true"
          :show-strength-indicator="true"
          :show-toggle="true"
          placeholder="Enter new password"
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
                placeholder="Enter new password"
              />
              <div class="input-underline"></div>
            </div>
          </template>

          <template #toggle="{ showPassword, togglePasswordVisibility }">
            <button
              @click="togglePasswordVisibility"
              class="password-toggle-btn"
              type="button"
            >
              <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </template>

          <template #strength="{ strength, strengthPercent }">
            <div class="password-strength">
              <div class="strength-bar">
                <div
                  class="strength-fill"
                  :style="{ width: strengthPercent, backgroundColor: strength.color }"
                ></div>
              </div>
              <span class="strength-label" :style="{ color: strength.color }">
                {{ strength.label }} Password
              </span>
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

        <!-- Confirm Password Input -->
        <div class="form-group">
          <label for="confirmPassword" class="custom-label">Confirm New Password<span class="required">*</span></label>
          <div class="input-wrapper">
            <div class="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="16" r="1" stroke="currentColor" stroke-width="2"/>
                <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              class="custom-input"
              placeholder="Confirm new password"
              @keyup.enter="handleSubmit"
            />
            <div class="input-underline"></div>
          </div>
        </div>

        <div v-if="error" class="error-message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ error }}
        </div>

        <SubmitButton
          :is-loading="isLoading"
          :disabled="!isFormValid || isLoading"
          :unstyled="true"
          @click="handleSubmit"
        >
          <template #loading>
            <div class="custom-spinner"></div>
          </template>

          <template #default>
            <span>{{ isLoading ? 'Updating Password...' : 'Update Password' }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
        </SubmitButton>
      </div>

      <!-- Navigation Links -->
      <div class="auth-links">
        <p>
          Remember your password?
          <router-link to="/login" class="link">Sign in</router-link>
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
import { EmailInput, PasswordInput, OTPInput, SubmitButton } from '../index.js'

export default {
  name: 'ResetPasswordPage',
  components: {
    EmailInput,
    PasswordInput,
    OTPInput,
    SubmitButton
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    // Form data
    const email = ref('')
    const otp = ref('')
    const newPassword = ref('')
    const confirmPassword = ref('')

    // Computed properties
    const isLoading = computed(() => store.getters['auth/isLoading'])
    const error = computed(() => store.getters['auth/error'])

    const isFormValid = computed(() => {
      return email.value.trim() !== '' &&
             otp.value.trim().length === 6 &&
             newPassword.value.trim() !== '' &&
             confirmPassword.value.trim() !== '' &&
             isValidEmail(email.value) &&
             newPassword.value.length >= 8 &&
             newPassword.value === confirmPassword.value
    })

    // Methods
    const handleEmailValidation = ({ valid }) => {
      // Email validation is handled by the component
    }

    const handlePasswordValidation = ({ valid }) => {
      // Password validation is handled by the component
    }

    const handleOTPComplete = (otpValue) => {
      otp.value = otpValue
    }

    const handleSubmit = async () => {
      // Clear any previous errors
      store.dispatch('auth/clearError')

      // Validate form
      if (!email.value.trim()) {
        store.commit('auth/SET_ERROR', 'Email is required')
        return
      }

      if (!isValidEmail(email.value)) {
        store.commit('auth/SET_ERROR', 'Please enter a valid email address')
        return
      }

      if (!otp.value.trim()) {
        store.commit('auth/SET_ERROR', 'Verification code is required')
        return
      }

      if (otp.value.length !== 6) {
        store.commit('auth/SET_ERROR', 'Please enter a valid 6-digit code')
        return
      }

      if (!newPassword.value.trim()) {
        store.commit('auth/SET_ERROR', 'New password is required')
        return
      }

      if (newPassword.value.length < 8) {
        store.commit('auth/SET_ERROR', 'Password must be at least 8 characters long')
        return
      }

      if (!confirmPassword.value.trim()) {
        store.commit('auth/SET_ERROR', 'Please confirm your new password')
        return
      }

      if (newPassword.value !== confirmPassword.value) {
        store.commit('auth/SET_ERROR', 'Passwords do not match')
        return
      }

      try {
        await store.dispatch('auth/resetPassword', {
          email: email.value,
          otp: otp.value,
          newPassword: newPassword.value
        })

        console.log('✅ Password Reset Successful!')
        console.log('📧 Email:', email.value)

        // Show success message and redirect to login
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Password updated successfully! Please sign in with your new password.'
        })

        router.push('/login')
      } catch (e) {
        console.error('Password reset failed:', e)
      }
    }

    return {
      email,
      otp,
      newPassword,
      confirmPassword,
      isLoading,
      error,
      isFormValid,
      handleEmailValidation,
      handlePasswordValidation,
      handleOTPComplete,
      handleSubmit
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
  max-width: 32rem;
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

.form-group {
  margin-bottom: 1.5rem;
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

/* Password Strength */
.password-strength {
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.strength-label {
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
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

/* Password Toggle Button */
.password-toggle-btn {
  position: absolute;
  right: 3.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  z-index: 2;
}

.password-toggle-btn:hover {
  color: #667eea;
  background: #f8fafc;
}

.password-toggle-btn svg {
  display: block;
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

  .otp-grid {
    gap: 0.25rem;
  }

  .otp-box {
    height: 50px;
    font-size: 1.25rem;
  }

  .password-toggle-btn {
    right: 3rem;
  }
}
</style>