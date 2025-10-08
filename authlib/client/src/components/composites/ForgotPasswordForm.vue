<template>
  <AuthCard title="Reset Password" subtitle="Enter your email to receive a verification code">
    <form @submit.prevent="handleSubmit" class="auth-form">
      <EmailInput v-model="email" label="Email Address" required />
      
      <AlertMessage v-if="success" type="success" message="Verification code sent! Enter the code below to reset your password." />
      <AlertMessage v-if="error" type="error" :message="error" />
      
      <SubmitButton :is-loading="isLoading" :disabled="!isFormValid" full-width>Send Verification Code</SubmitButton>
      
      <TextButton @click="$emit('back-to-login')" style="width: 100%; margin-top: 1rem;">
        Back to Sign In
      </TextButton>
    </form>
  </AuthCard>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { isValidEmail, getEmailError } from '../../utils/validators'
import AuthCard from '../cards/AuthCard.vue'
import EmailInput from '../inputs/EmailInput.vue'
import SubmitButton from '../buttons/SubmitButton.vue'
import TextButton from '../buttons/TextButton.vue'
import AlertMessage from '../feedback/AlertMessage.vue'

export default {
  name: 'ForgotPasswordForm',
  components: { AuthCard, EmailInput, SubmitButton, TextButton, AlertMessage },
  emits: ['back-to-login', 'success'],
  
  setup(props, { emit }) {
    const store = useStore()
    const email = ref('')
    const success = ref(false)
    
    const isLoading = computed(() => store.getters['auth/isLoading'])
    const error = computed(() => store.getters['auth/error'])
    
    // Form validation
    const isFormValid = computed(() => {
      return email.value.trim() !== '' && 
             isValidEmail(email.value)
    })
    
    const handleSubmit = async () => {
      // Clear any previous errors
      store.dispatch('auth/clearError')
      
      // Validate form before submission
      if (!email.value.trim()) {
        store.commit('auth/SET_ERROR', 'Email is required')
        return
      }
      
      const emailError = getEmailError(email.value)
      if (emailError) {
        store.commit('auth/SET_ERROR', emailError)
        return
      }
      
      try {
        await store.dispatch('auth/forgotPassword', email.value)
        success.value = true
        setTimeout(() => {
          emit('success')
        }, 2000)
      } catch (e) {
        // Error is handled by the store
      }
    }
    
    return { email, success, isLoading, error, isFormValid, handleSubmit }
  }
}
</script>
