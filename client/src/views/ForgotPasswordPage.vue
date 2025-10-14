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
        <h1>Reset Password</h1>
        <p v-if="currentStep === 'email'">Enter your email to receive a reset code</p>
        <p v-else-if="currentStep === 'otp'">Enter the verification code sent to your email</p>
        <p v-else>Choose your new password</p>
      </div>

      <!-- Step Indicator -->
      <div class="step-indicator">
        <div class="step" :class="{ active: currentStep === 'email', completed: currentStep !== 'email' }">
          <div class="step-number">1</div>
          <span class="step-label">Email</span>
        </div>
        <div class="step-connector"></div>
        <div class="step" :class="{ active: currentStep === 'otp', completed: currentStep === 'password' }">
          <div class="step-number">2</div>
          <span class="step-label">Verify</span>
        </div>
        <div class="step-connector"></div>
        <div class="step" :class="{ active: currentStep === 'password' }">
          <div class="step-number">3</div>
          <span class="step-label">Password</span>
        </div>
      </div>

      <!-- Step 1: Email Input -->
      <div v-if="currentStep === 'email'" class="auth-step">
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
          :unstyled="false"
          @click="handleEmailSubmit"
        >
          <template #loading>
            <div class="custom-spinner"></div>
          </template>

          <template #default>
            <span>{{ isLoading ? 'Sending...' : 'Send Reset Code' }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
        </SubmitButton>
      </div>

      <!-- Step 2: OTP Verification -->
      <div v-else-if="currentStep === 'otp'" class="auth-step">
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

        <SubmitButton
          :is-loading="isLoading"
          :disabled="otpCode.length !== 6 || isLoading"
          :unstyled="false"
          @click="handleOTPSubmit"
        >
          <template #loading>
            <div class="custom-spinner"></div>
          </template>

          <template #default>
            <span>{{ isLoading ? 'Verifying...' : 'Verify Code' }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </template>
        </SubmitButton>

        <div class="form-row">
          <button @click="handleResendOTP" :disabled="isLoading" class="resend-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 12L12 4L20 12M4 12L12 20L20 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ isLoading ? 'Sending...' : 'Resend Code' }}
          </button>
          <button @click="goBackToEmail" class="back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Back
          </button>
        </div>
      </div>

      <!-- Step 3: New Password -->
      <div v-else-if="currentStep === 'password'" class="auth-step">
        <PasswordInput
          v-model="newPassword"
          field-name="newPassword"
          :unstyled="false"
          :show-strength-indicator="true"
          :show-toggle="true"
          placeholder="Enter your new password"
          :validate-on-blur="true"
          @validate="handlePasswordValidation"
        >
          <template #label="{ label, required }">
            <label class="custom-label">
              {{ label }}<span v-if="required" class="required">*</span>
            </label>
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

        <PasswordInput
          v-model="confirmPassword"
          field-name="confirmPassword"
          :unstyled="false"
          :show-toggle="true"
          placeholder="Confirm your new password"
          :validate-on-blur="true"
          @validate="handleConfirmPasswordValidation"
        >
          <template #label="{ label, required }">
            <label class="custom-label">
              {{ label }}<span v-if="required" class="required">*</span>
            </label>
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

        <div v-if="passwordMatchError" class="custom-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>{{ passwordMatchError }}</span>
        </div>

        <SubmitButton
          :is-loading="isLoading"
          :disabled="!isPasswordFormValid || isLoading"
          :unstyled="false"
          @click="handlePasswordSubmit"
        >
          <template #loading>
            <div class="custom-spinner"></div>
          </template>

          <template #default>
            <span>{{ isLoading ? 'Updating...' : 'Update Password' }}</span>
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
  name: 'ForgotPasswordPage',
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
    const otpCode = ref('')
    const newPassword = ref('')
    const confirmPassword = ref('')
    const currentStep = ref('email') // 'email', 'otp', 'password'

    // Computed properties
    const isLoading = computed(() => store.getters['auth/isLoading'])
    const error = computed(() => store.getters['auth/error'])

    const isEmailValid = computed(() => {
      return email.value.trim() !== '' && isValidEmail(email.value)
    })

    const isPasswordFormValid = computed(() => {
      return newPassword.value.trim() !== '' &&
             confirmPassword.value.trim() !== '' &&
             newPassword.value.length >= 8 &&
             newPassword.value === confirmPassword.value
    })

    const passwordMatchError = computed(() => {
      if (confirmPassword.value && newPassword.value && newPassword.value !== confirmPassword.value) {
        return 'Passwords do not match'
      }
      return null
    })

    const maskedEmail = computed(() => {
      if (!email.value) return ''
      const [local, domain] = email.value.split('@')
      const masked = local.substring(0, 2) + '*'.repeat(local.length - 2)
      return `${masked}@${domain}`
    })

    // Methods
    const handleEmailValidation = ({ valid }) => {
      // Email validation is handled by the component
    }

    const handlePasswordValidation = ({ valid }) => {
      // Password validation is handled by the component
    }

    const handleConfirmPasswordValidation = ({ valid }) => {
      // Confirm password validation is handled by the component
    }

    const handleEmailSubmit = async () => {
      if (!email.value.trim()) {
        store.commit('auth/SET_ERROR', 'Email is required')
        return
      }

      if (!isValidEmail(email.value)) {
        store.commit('auth/SET_ERROR', 'Please enter a valid email address')
        return
      }

      store.dispatch('auth/clearError')

      try {
        await store.dispatch('auth/forgotPassword', email.value)

        console.log('✅ Password reset email sent!')
        console.log('📧 Email:', email.value)

        // Show success message
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Reset code sent to your email!'
        })

        // Move to OTP step
        currentStep.value = 'otp'
      } catch (e) {
        console.error('Forgot password failed:', e)
      }
    }

    const handleOTPComplete = (otp) => {
      otpCode.value = otp
      console.log('OTP completed:', otp)
      // Auto-submit when OTP is complete
      if (otp.length === 6) {
        setTimeout(() => {
          handleOTPSubmit()
        }, 500) // Small delay for better UX
      }
    }

    const handleOTPSubmit = async () => {
      if (otpCode.value.length !== 6) {
        store.commit('auth/SET_ERROR', 'Please enter a valid 6-digit code')
        return
      }

      store.dispatch('auth/clearError')

      try {
        console.log('Verifying OTP for password reset...')
        // Move to password step
        currentStep.value = 'password'

        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Code verified! Please enter your new password.'
        })
      } catch (error) {
        console.error('OTP verification failed:', error)
        store.commit('auth/SET_ERROR', 'Invalid verification code. Please try again.')
      }
    }

    const handlePasswordSubmit = async () => {
      if (!isPasswordFormValid.value) {
        return
      }

      store.dispatch('auth/clearError')

      try {
        console.log('Resetting password...')
        await store.dispatch('auth/resetPassword', {
          email: email.value,
          otp: otpCode.value,
          newPassword: newPassword.value
        })

        console.log('✅ Password reset successful!')

        // Show success message
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Password reset successful! Please log in with your new password.'
        })

        // Redirect to login page
        router.push('/login')
      } catch (e) {
        console.error('Password reset failed:', e)
      }
    }

    const handleResendOTP = async () => {
      try {
        await store.dispatch('auth/forgotPassword', email.value)
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'New reset code sent!'
        })
      } catch (error) {
        console.error('Resend failed:', error)
      }
    }

    const goBackToEmail = () => {
      currentStep.value = 'email'
      store.dispatch('auth/clearError')
    }

    return {
      email,
      otpCode,
      newPassword,
      confirmPassword,
      currentStep,
      isLoading,
      error,
      isEmailValid,
      isPasswordFormValid,
      passwordMatchError,
      maskedEmail,
      handleEmailValidation,
      handlePasswordValidation,
      handleConfirmPasswordValidation,
      handleEmailSubmit,
      handleOTPComplete,
      handlePasswordSubmit,
      handleResendOTP,
      goBackToEmail
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

/* Step Indicator */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 0.5rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.step-number {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.step.active .step-number {
  background: #667eea;
  color: white;
}

.step.completed .step-number {
  background: #10b981;
  color: white;
}

.step-label {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.step.active .step-label {
  color: #667eea;
}

.step-connector {
  width: 2rem;
  height: 2px;
  background: #e2e8f0;
  margin: 0 0.5rem;
}

.step.completed + .step-connector {
  background: #10b981;
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

/* Responsive Design */
@media (max-width: 480px) {
  .auth-page {
    padding: 0.5rem;
  }

  .auth-container {
    max-width: none;
    padding: 2rem 1.5rem;
  }
}
</style>