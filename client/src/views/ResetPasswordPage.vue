<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>Set New Password</h1>
        <p>Enter the verification code and your new password</p>
      </div>

      <div class="auth-step">
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
            @keyup.enter="focusNext('otp')"
          />
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
            @keyup.enter="focusNext('password')"
          />
        </div>

        <div class="form-group">
          <label for="password">New Password</label>
          <input
            id="password"
            ref="passwordInput"
            v-model="newPassword"
            type="password"
            class="form-input"
            placeholder="Enter new password"
            required
            @keyup.enter="focusNext('confirmPassword')"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            ref="confirmPasswordInput"
            v-model="confirmPassword"
            type="password"
            class="form-input"
            placeholder="Confirm new password"
            required
            @keyup.enter="handleSubmit"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          {{ success }}
        </div>

        <button
          @click="handleSubmit"
          :disabled="!isFormValid || isLoading"
          class="submit-btn"
        >
          {{ isLoading ? 'Updating Password...' : 'Update Password' }}
        </button>
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
import { ref, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { isValidEmail } from '../utils/validators'

export default {
  name: 'ResetPasswordPage',
  setup() {
    const store = useStore()
    const router = useRouter()

    // Form data
    const email = ref('')
    const otp = ref('')
    const newPassword = ref('')
    const confirmPassword = ref('')

    // Refs for input control
    const emailInput = ref(null)
    const otpInput = ref(null)
    const passwordInput = ref(null)
    const confirmPasswordInput = ref(null)

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
    const focusNext = (nextField) => {
      nextTick(() => {
        switch (nextField) {
          case 'otp':
            otpInput.value?.focus()
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

      if (!otp.value.trim()) {
        store.commit('auth/SET_ERROR', 'Verification code is required')
        nextTick(() => otpInput.value?.focus())
        return
      }

      if (otp.value.length !== 6) {
        store.commit('auth/SET_ERROR', 'Please enter a valid 6-digit code')
        nextTick(() => otpInput.value?.focus())
        return
      }

      if (!newPassword.value.trim()) {
        store.commit('auth/SET_ERROR', 'New password is required')
        nextTick(() => passwordInput.value?.focus())
        return
      }

      if (newPassword.value.length < 8) {
        store.commit('auth/SET_ERROR', 'Password must be at least 8 characters long')
        nextTick(() => passwordInput.value?.focus())
        return
      }

      if (!confirmPassword.value.trim()) {
        store.commit('auth/SET_ERROR', 'Please confirm your new password')
        nextTick(() => confirmPasswordInput.value?.focus())
        return
      }

      if (newPassword.value !== confirmPassword.value) {
        store.commit('auth/SET_ERROR', 'Passwords do not match')
        nextTick(() => confirmPasswordInput.value?.focus())
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
        // Focus on first field with error or OTP field
        if (!email.value.trim()) {
          nextTick(() => emailInput.value?.focus())
        } else if (!otp.value.trim()) {
          nextTick(() => otpInput.value?.focus())
        } else {
          nextTick(() => otpInput.value?.focus())
        }
      }
    }

    return {
      email,
      otp,
      newPassword,
      confirmPassword,
      isLoading,
      error,
      success: computed(() => store.getters['auth/resetEmail'] === email.value ? 'Reset code verified!' : ''),
      isFormValid,
      emailInput,
      otpInput,
      passwordInput,
      confirmPasswordInput,
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