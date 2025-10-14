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
        <h1>Create Account</h1>
        <p>Join us today and get started</p>
      </div>

      <div class="auth-step">
        <!-- Full Name Input -->
        <div class="form-group">
          <label for="name" class="custom-label">Full Name<span class="required">*</span></label>
          <div class="input-wrapper">
            <div class="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input
              id="name"
              v-model="name"
              type="text"
              class="custom-input"
              placeholder="Enter your full name"
              @keyup.enter="focusEmail"
            />
            <div class="input-underline"></div>
          </div>
        </div>

        <!-- Email Input -->
        <EmailInput
          v-model="email"
          field-name="registerEmail"
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
          field-name="registerPassword"
          :unstyled="false"
          :show-strength-indicator="true"
          :show-toggle="false"
          placeholder="Create a strong password"
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
                placeholder="Create a strong password"
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
          <label for="confirmPassword" class="custom-label">Confirm Password<span class="required">*</span></label>
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
              :class="{ 'has-error': passwordMatchError }"
              placeholder="Confirm your password"
              @keyup.enter="handleSubmit"
              @input="validatePasswords"
            />
            <div class="input-underline"></div>
          </div>

          <!-- Real-time password match error -->
          <div v-if="passwordMatchError" class="custom-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ passwordMatchError }}</span>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="form-group">
          <label class="checkbox-wrapper">
            <input
              v-model="acceptTerms"
              type="checkbox"
              class="custom-checkbox"
            />
            <span class="checkmark"></span>
            <span class="checkbox-label">
              I agree to the
              <a href="#" class="link">Terms of Service</a>
              and
              <a href="#" class="link">Privacy Policy</a>
            </span>
          </label>
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
          :unstyled="false"
          @click="handleSubmit"
        >
          <template #loading>
            <div class="custom-spinner"></div>
          </template>

          <template #default>
            <span>{{ isLoading ? 'Creating Account...' : 'Create Account' }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
            </svg>
          </template>
        </SubmitButton>
      </div>

      <!-- Navigation Links -->
      <div class="auth-links">
        <p>
          Already have an account?
          <router-link to="/login" class="link">Sign in</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { isValidEmail } from '../utils/validators'

// Import enhanced SDK components
import { EmailInput, PasswordInput, SubmitButton } from '../index.js'

export default {
  name: 'RegisterPage',
  components: {
    EmailInput,
    PasswordInput,
    SubmitButton
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    // Form data
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const acceptTerms = ref(false)

    // Pre-populate email if coming from login page
    onMounted(() => {
      if (route.query.email && isValidEmail(route.query.email)) {
        email.value = route.query.email
      }
    })

    // Computed properties
    const isLoading = computed(() => store.getters['auth/isLoading'])
    const error = computed(() => store.getters['auth/error'])

    const isFormValid = computed(() => {
      const validEmail = isValidEmail(email.value)
      const validPassword = password.value.length >= 8
      const passwordsMatch = password.value === confirmPassword.value

      console.log('Form validation:', {
        name: name.value.trim() !== '',
        email: email.value.trim() !== '',
        password: password.value.trim() !== '',
        confirmPassword: confirmPassword.value.trim() !== '',
        validEmail,
        validPassword,
        passwordsMatch,
        acceptTerms: acceptTerms.value,
        overall: name.value.trim() !== '' &&
                email.value.trim() !== '' &&
                password.value.trim() !== '' &&
                confirmPassword.value.trim() !== '' &&
                validEmail &&
                validPassword &&
                passwordsMatch &&
                acceptTerms.value
      })

      return name.value.trim() !== '' &&
             email.value.trim() !== '' &&
             password.value.trim() !== '' &&
             confirmPassword.value.trim() !== '' &&
             validEmail &&
             validPassword &&
             passwordsMatch &&
             acceptTerms.value
    })

    // Real-time password match validation
    const passwordMatchError = computed(() => {
      if (confirmPassword.value && password.value && password.value !== confirmPassword.value) {
        return 'Passwords do not match'
      }
      return null
    })

    // Watch for password match errors and update store
    watch([password, confirmPassword], () => {
      if (passwordMatchError.value) {
        store.commit('auth/SET_ERROR', passwordMatchError.value)
      } else if (error.value === 'Passwords do not match') {
        store.dispatch('auth/clearError')
      }
    })

    // Methods
    const focusEmail = () => {
      // Focus will be handled by the EmailInput component
    }

    const handleEmailValidation = ({ valid }) => {
      // Email validation is handled by the component
    }

    const handlePasswordValidation = ({ valid }) => {
      // Password validation is handled by the component
    }

    const validatePasswords = () => {
      // Trigger real-time validation
      if (passwordMatchError.value) {
        store.commit('auth/SET_ERROR', passwordMatchError.value)
      } else if (error.value === 'Passwords do not match') {
        store.dispatch('auth/clearError')
      }
    }

    const handleSubmit = async () => {
      console.log('Submit button clicked')
      console.log('Form data:', {
        name: name.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        acceptTerms: acceptTerms.value,
        isFormValid: isFormValid.value
      })

      // Clear any previous errors
      store.dispatch('auth/clearError')

      // Validate form
      if (!name.value.trim()) {
        console.log('Validation failed: name empty')
        store.commit('auth/SET_ERROR', 'Full name is required')
        return
      }

      if (!email.value.trim()) {
        store.commit('auth/SET_ERROR', 'Email is required')
        return
      }

      if (!isValidEmail(email.value)) {
        store.commit('auth/SET_ERROR', 'Please enter a valid email address')
        return
      }

      if (!password.value.trim()) {
        store.commit('auth/SET_ERROR', 'Password is required')
        return
      }

      if (password.value.length < 8) {
        store.commit('auth/SET_ERROR', 'Password must be at least 8 characters long')
        return
      }

      if (!confirmPassword.value.trim()) {
        store.commit('auth/SET_ERROR', 'Please confirm your password')
        return
      }

      if (password.value !== confirmPassword.value) {
        store.commit('auth/SET_ERROR', 'Passwords do not match')
        return
      }

      if (!acceptTerms.value) {
        store.commit('auth/SET_ERROR', 'Please accept the terms and conditions')
        return
      }

      try {
        const result = await store.dispatch('auth/register', {
          email: email.value,
          password: password.value
        })

        console.log('✅ Registration Successful!')
        console.log('👤 User Data:', result.user)

        // Send OTP for email verification after registration
        try {
          await store.dispatch('auth/sendLoginOTP', { email: email.value })

          // Store email for verification page
          store.commit('auth/SET_RESET_EMAIL', email.value)

          // Show success message and redirect to OTP verification
          store.dispatch('ui/showToast', {
            type: 'success',
            message: 'Account created! Please verify your email to continue.'
          })

          // Redirect to OTP verification page
          router.push('/verify-registration')
        } catch (otpError) {
          console.error('Failed to send verification OTP:', otpError)
          store.dispatch('ui/showToast', {
            type: 'error',
            message: 'Account created but failed to send verification email. Please try logging in.'
          })
          router.push('/login')
        }
      } catch (e) {
        console.error('Registration failed:', e)
      }
    }

    return {
      name,
      email,
      password,
      confirmPassword,
      acceptTerms,
      isLoading,
      error,
      isFormValid,
      passwordMatchError,
      focusEmail,
      handleEmailValidation,
      handlePasswordValidation,
      validatePasswords,
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

/* Checkbox Styling */
.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  cursor: pointer;
}

.custom-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: relative;
  top: 0;
  left: 0;
  height: 1.25rem;
  width: 1.25rem;
  background-color: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.custom-checkbox:checked ~ .checkmark {
  background-color: #667eea;
  border-color: #667eea;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.custom-checkbox:checked ~ .checkmark:after {
  display: block;
}

.custom-checkbox ~ .checkmark:after {
  left: 0.375rem;
  top: 0.1875rem;
  width: 0.25rem;
  height: 0.5rem;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-label {
  color: #64748b;
  margin: 0;
}

.checkbox-label .link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.checkbox-label .link:hover {
  color: #5a67d8;
  text-decoration: underline;
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

  .password-toggle-btn {
    right: 3rem;
  }
}
</style>