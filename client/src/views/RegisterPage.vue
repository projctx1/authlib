<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>Create Account</h1>
        <p>Get started with your new account</p>
      </div>

      <div class="auth-step">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            id="name"
            ref="nameInput"
            v-model="name"
            type="text"
            class="form-input"
            placeholder="Enter your full name"
            required
            @keyup.enter="focusNext('email')"
          />
        </div>

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
            @keyup.enter="focusNext('password')"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            ref="passwordInput"
            v-model="password"
            type="password"
            class="form-input"
            placeholder="Create a password"
            required
            @keyup.enter="focusNext('confirmPassword')"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            ref="confirmPasswordInput"
            v-model="confirmPassword"
            type="password"
            class="form-input"
            placeholder="Confirm your password"
            required
            @keyup.enter="handleSubmit"
          />
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input
              ref="termsInput"
              v-model="acceptTerms"
              type="checkbox"
            />
            I agree to the <a href="#" class="link">Terms of Service</a> and <a href="#" class="link">Privacy Policy</a>
          </label>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button
          @click="handleSubmit"
          :disabled="!isFormValid || isLoading"
          class="submit-btn"
        >
          {{ isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>
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
import { ref, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { isValidEmail } from '../utils/validators'
import { baseURL } from '../services/api.js'

export default {
  name: 'RegisterPage',
  setup() {
    const store = useStore()
    const router = useRouter()

    // Form data
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const acceptTerms = ref(false)

    // Refs for input control
    const nameInput = ref(null)
    const emailInput = ref(null)
    const passwordInput = ref(null)
    const confirmPasswordInput = ref(null)
    const termsInput = ref(null)

    // Computed properties
    const isLoading = computed(() => store.getters['auth/isLoading'])
    const error = computed(() => store.getters['auth/error'])

    const isFormValid = computed(() => {
      return name.value.trim() !== '' &&
             email.value.trim() !== '' &&
             password.value.trim() !== '' &&
             confirmPassword.value.trim() !== '' &&
             isValidEmail(email.value) &&
             password.value.length >= 8 &&
             password.value === confirmPassword.value &&
             acceptTerms.value
    })

    // Methods
    const focusNext = (nextField) => {
      nextTick(() => {
        switch (nextField) {
          case 'email':
            emailInput.value?.focus()
            break
          case 'password':
            passwordInput.value?.focus()
            break
          case 'confirmPassword':
            confirmPasswordInput.value?.focus()
            break
        }
      })
    }

    const handleSubmit = async () => {
      // Clear any previous errors
      store.dispatch('auth/clearError')

      // Validate form
      if (!name.value.trim()) {
        store.commit('auth/SET_ERROR', 'Full name is required')
        nextTick(() => nameInput.value?.focus())
        return
      }

      if (!email.value.trim()) {
        store.commit('auth/SET_ERROR', 'Email is required')
        nextTick(() => emailInput.value?.focus())
        return
      }

      if (!isValidEmail(email.value)) {
        store.commit('auth/SET_ERROR', 'Please enter a valid email address')
        nextTick(() => emailInput.value?.focus())
        return
      }

      if (!password.value.trim()) {
        store.commit('auth/SET_ERROR', 'Password is required')
        nextTick(() => passwordInput.value?.focus())
        return
      }

      if (password.value.length < 8) {
        store.commit('auth/SET_ERROR', 'Password must be at least 8 characters long')
        nextTick(() => passwordInput.value?.focus())
        return
      }

      if (!confirmPassword.value.trim()) {
        store.commit('auth/SET_ERROR', 'Please confirm your password')
        nextTick(() => confirmPasswordInput.value?.focus())
        return
      }

      if (password.value !== confirmPassword.value) {
        store.commit('auth/SET_ERROR', 'Passwords do not match')
        nextTick(() => confirmPasswordInput.value?.focus())
        return
      }

      if (!acceptTerms.value) {
        store.commit('auth/SET_ERROR', 'Please accept the terms and conditions')
        nextTick(() => termsInput.value?.focus())
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
        // Focus on first empty field or email field
        if (!name.value.trim()) {
          nextTick(() => nameInput.value?.focus())
        } else if (!email.value.trim()) {
          nextTick(() => emailInput.value?.focus())
        } else {
          nextTick(() => emailInput.value?.focus())
        }
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
      nameInput,
      emailInput,
      passwordInput,
      confirmPasswordInput,
      termsInput,
      focusNext,
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

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.4;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  border: 1px solid #fcc;
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
}
</style>