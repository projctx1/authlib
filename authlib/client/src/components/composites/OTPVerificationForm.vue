<template>
  <AuthCard title="Verify Your Account" subtitle="Enter the 6-digit code sent to your email">
    <form @submit.prevent="handleSubmit" class="auth-form">
      <OTPInput
        v-model="code"
        :length="6"
        show-timer
        show-resend
        @complete="handleComplete"
        @resend="handleResend"
      />

      <AlertMessage v-if="error" type="error" :message="error" />

      <SubmitButton :is-loading="isLoading" :disabled="code.length !== 6" full-width>
        Verify Code
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
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import AuthCard from '../cards/AuthCard.vue'
import OTPInput from '../inputs/OTPInput.vue'
import SubmitButton from '../buttons/SubmitButton.vue'
import TextButton from '../buttons/TextButton.vue'
import AlertMessage from '../feedback/AlertMessage.vue'

export default {
  name: 'OTPVerificationForm',
  components: { AuthCard, OTPInput, SubmitButton, TextButton, AlertMessage },
  emits: ['success', 'back-to-login'],
  
  setup(props, { emit }) {
    const store = useStore()
    const code = ref('')
    const isLoading = ref(false)
    
    const error = computed(() => store.getters['otp/error'])
    
    onMounted(() => {
      store.dispatch('otp/sendOTP', { expirySeconds: 300 })
    })
    
    const handleComplete = async (otp) => {
      code.value = otp
      await handleSubmit()
    }
    
    const handleSubmit = async () => {
      isLoading.value = true
      try {
        const isValid = await store.dispatch('otp/verifyOTP', code.value)
        if (isValid) emit('success')
      } finally {
        isLoading.value = false
      }
    }
    
    const handleResend = () => {
      store.dispatch('otp/resendOTP', { expirySeconds: 300, cooldownSeconds: 60 })
    }
    
    return { code, isLoading, error, handleComplete, handleSubmit, handleResend }
  }
}
</script>

<style scoped>
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
</style>

<style scoped>
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
</style>
