<template>
  <AuthCard title="Create Account" subtitle="Get started today">
    <form @submit.prevent="handleSubmit" class="auth-form">
      <TextInput v-model="name" field-name="name" label="Full Name" required />
      <EmailInput v-model="email" label="Email Address" required />
      <PasswordInput v-model="password" label="Password" required show-strength-indicator />
      <PasswordInput v-model="confirmPassword" field-name="confirmPassword" label="Confirm Password" required />
      
      <CheckboxInput v-model="acceptTerms">
        I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
      </CheckboxInput>
      
      <AlertMessage v-if="error" type="error" :message="error" />
      
      <SubmitButton :is-loading="isLoading || isRegistering" :disabled="!isFormValid || isRegistering" full-width>
        {{ isRegistering ? 'Creating Account...' : 'Create Account' }}
      </SubmitButton>
      
      <SocialLoginButtons :providers="['google', 'github']" :disabled="isRegistering" @social-login="handleSocialLogin" />
    </form>
    
    <template #footer>
      <p class="auth-footer-text">
        Already have an account?
        <TextButton @click="$emit('switch-to-login')">Sign in</TextButton>
      </p>
    </template>
  </AuthCard>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { isValidEmail, getEmailError } from '../../utils/validators'
import AuthCard from '../cards/AuthCard.vue'
import EmailInput from '../inputs/EmailInput.vue'
import PasswordInput from '../inputs/PasswordInput.vue'
import TextInput from '../inputs/TextInput.vue'
import CheckboxInput from '../inputs/CheckboxInput.vue'
import SubmitButton from '../buttons/SubmitButton.vue'
import TextButton from '../buttons/TextButton.vue'
import SocialLoginButtons from '../buttons/SocialLoginButtons.vue'
import AlertMessage from '../feedback/AlertMessage.vue'

export default {
  name: 'RegisterForm',
  components: { 
    AuthCard, 
    EmailInput, 
    PasswordInput, 
    TextInput, 
    CheckboxInput, 
    SubmitButton, 
    TextButton, 
    SocialLoginButtons, 
    AlertMessage 
  },
  emits: ['switch-to-login', 'success'],
  
  setup(props, { emit }) {
    const store = useStore()
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const acceptTerms = ref(false)
    const isRegistering = ref(false)
    
    const isLoading = computed(() => store.getters['auth/isLoading'])
    const error = computed(() => store.getters['auth/error'])
    
    // Form validation
    const isFormValid = computed(() => {
      return name.value.trim() !== '' &&
             email.value.trim() !== '' &&
             password.value.trim() !== '' &&
             confirmPassword.value.trim() !== '' &&
             isValidEmail(email.value) &&
             password.value.length >= 8 &&
             password.value === confirmPassword.value &&
             acceptTerms.value &&
             !isRegistering.value // Prevent submission while registering
    })
    
    const handleSubmit = async () => {
      // Clear any previous errors
      store.dispatch('auth/clearError')

      // Validate form before submission
      if (!name.value.trim()) {
        store.commit('auth/SET_ERROR', 'Full name is required')
        return
      }

      if (!email.value.trim()) {
        store.commit('auth/SET_ERROR', 'Email is required')
        return
      }

      const emailError = getEmailError(email.value)
      if (emailError) {
        store.commit('auth/SET_ERROR', emailError)
        return
      }

      if (!password.value.trim()) {
        store.commit('auth/SET_ERROR', 'Password is required')
        return
      }

      if (password.value.length < 8) {
        store.commit('auth/SET_ERROR', 'Password must be at least 8 characters')
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

      isRegistering.value = true

      try {
        await store.dispatch('auth/register', {
          email: email.value,
          password: password.value
        })

        // Show success feedback in the form before emitting success
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Account created successfully! Redirecting to login...'
        })

        // Small delay to let user see the success message
        setTimeout(() => {
          emit('success')
        }, 1500)
      } catch (e) {
        // Error is handled by the store
      } finally {
        isRegistering.value = false
      }
    }
    
    const handleSocialLogin = (provider) => {
      if (!isRegistering.value) {
        store.dispatch('auth/socialLogin', provider)
          .then(() => emit('success'))
          .catch(() => {
            // Error is handled by the store
          })
      }
    }
    
    return {
      name,
      email,
      password,
      confirmPassword,
      acceptTerms,
      isLoading,
      isRegistering,
      error,
      isFormValid,
      handleSubmit,
      handleSocialLogin
    }
  }
}
</script>
