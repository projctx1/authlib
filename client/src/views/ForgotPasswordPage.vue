<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>Reset Password</h1>
        <p>Enter your email to receive a reset code</p>
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
          :disabled="!isEmailValid || isLoading"
          class="submit-btn"
        >
          {{ isLoading ? 'Sending...' : 'Send Reset Code' }}
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
  name: 'ForgotPasswordPage',
  setup() {
    const store = useStore()
    const router = useRouter()

    // Form data
    const email = ref('')

    // Refs for input control
    const emailInput = ref(null)

    // Computed properties
    const isLoading = computed(() => store.getters['auth/isLoading'])
    const error = computed(() => store.getters['auth/error'])

    const isEmailValid = computed(() => {
      return email.value.trim() !== '' && isValidEmail(email.value)
    })

    // Methods
    const handleSubmit = async () => {
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

        // Redirect to reset password page
        router.push('/reset-password')
      } catch (e) {
        nextTick(() => emailInput.value?.focus())
      }
    }

    return {
      email,
      isLoading,
      error,
      success: computed(() => store.getters['auth/resetEmail'] ? 'Reset code sent!' : ''),
      isEmailValid,
      emailInput,
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