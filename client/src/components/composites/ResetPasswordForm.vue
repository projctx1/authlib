<template>
  <AuthCard title="Reset Your Password" subtitle="Enter the verification code and your new password">
    <form @submit.prevent="handleSubmit" class="auth-form">
      <!-- OTP Input -->
      <div class="otp-section">
        <label class="form-label">Verification Code</label>
        <OTPInput
          v-model="otp"
          :length="6"
          show-timer
          show-resend
          @complete="handleOTPComplete"
          @resend="handleResendOTP"
        />
      </div>

      <!-- New Password Input -->
      <div class="password-section">
        <PasswordInput
          v-model="newPassword"
          label="New Password"
          placeholder="Enter your new password"
          required
          show-strength-indicator
        />

        <PasswordInput
          v-model="confirmPassword"
          label="Confirm New Password"
          placeholder="Confirm your new password"
          required
        />
      </div>

      <AlertMessage v-if="error" type="error" :message="error" />
      <AlertMessage v-if="success" type="success" :message="success" />

      <SubmitButton :is-loading="isLoading" :disabled="!isFormValid" full-width>
        Reset Password
      </SubmitButton>

      <div class="form-actions">
        <TextButton @click="$emit('back-to-login')" class="back-button">
          ← Back to Sign In
        </TextButton>
      </div>
    </form>
  </AuthCard>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import AuthCard from '../cards/AuthCard.vue'
import OTPInput from '../inputs/OTPInput.vue'
import PasswordInput from '../inputs/PasswordInput.vue'
import SubmitButton from '../buttons/SubmitButton.vue'
import TextButton from '../buttons/TextButton.vue'
import AlertMessage from '../feedback/AlertMessage.vue'

export default {
  name: 'ResetPasswordForm',
  components: {
    AuthCard,
    OTPInput,
    PasswordInput,
    SubmitButton,
    TextButton,
    AlertMessage
  },
  emits: ['success', 'back-to-login'],

  setup(props, { emit }) {
    const store = useStore()
    const otp = ref('')
    const newPassword = ref('')
    const confirmPassword = ref('')
    const isLoading = ref(false)
    const success = ref('')

    const error = computed(() => store.getters['auth/error'])

    // Form validation
    const isFormValid = computed(() => {
      return otp.value.length === 6 &&
             newPassword.value.length >= 8 &&
             newPassword.value === confirmPassword.value
    })

    const handleSubmit = async () => {
      if (!isFormValid.value) {
        store.commit('auth/SET_ERROR', 'Please fill in all fields correctly')
        return
      }

      isLoading.value = true
      store.dispatch('auth/clearError')

      try {
        // Get email from store (set during forgot password)
        const email = store.getters['auth/resetEmail']
        if (!email) {
          store.commit('auth/SET_ERROR', 'Session expired. Please request password reset again.')
          return
        }

        const response = await store.dispatch('auth/resetPassword', {
          email,
          otp: otp.value,
          newPassword: newPassword.value
        })

        success.value = 'Password reset successfully! You can now sign in with your new password.'

        setTimeout(() => {
          emit('success')
        }, 2000)

      } catch (e) {
        // Error is handled by the store
      } finally {
        isLoading.value = false
      }
    }

    const handleOTPComplete = async (otpValue) => {
      otp.value = otpValue
      if (isFormValid.value) {
        await handleSubmit()
      }
    }

    const handleResendOTP = async () => {
      try {
        const email = store.getters['auth/resetEmail']
        if (email) {
          await store.dispatch('auth/forgotPassword', email)
          success.value = 'New verification code sent to your email'
          setTimeout(() => {
            success.value = ''
          }, 3000)
        }
      } catch (error) {
        // Error handled by store
      }
    }

    return {
      otp,
      newPassword,
      confirmPassword,
      isLoading,
      error,
      success,
      isFormValid,
      handleSubmit,
      handleOTPComplete,
      handleResendOTP
    }
  }
}
</script>

<style scoped>
.auth-form {
  max-width: 100%;
}

.otp-section {
  margin-bottom: 1.5rem;
}

.password-section {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-actions {
  margin-top: 1.5rem;
  text-align: center;
}

.back-button {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.back-button:hover {
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .otp-section,
  .password-section {
    margin-bottom: 1rem;
  }
}
</style>