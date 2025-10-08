<template>
  <div class="auth-view">
    <div class="auth-container">
      <Transition name="fade" mode="out-in">
        <LoginForm
          v-if="currentForm === 'login'"
          @switch-to-register="currentForm = 'register'"
          @forgot-password="currentForm = 'forgot-password'"
          @otp-login="handleOTPLogin"
          @success="handleAuthSuccess"
        />
        <RegisterForm
          v-else-if="currentForm === 'register'"
          @switch-to-login="currentForm = 'login'"
          @success="handleRegisterSuccess"
        />
        <ForgotPasswordForm
          v-else-if="currentForm === 'forgot-password'"
          @back-to-login="currentForm = 'login'"
          @success="handleForgotPasswordSuccess"
        />
        <ResetPasswordForm
          v-else-if="currentForm === 'reset-password'"
          @back-to-login="currentForm = 'login'"
          @success="handleResetPasswordSuccess"
        />
        <OTPVerificationForm
          v-else-if="currentForm === 'otp'"
          @success="handleOTPSuccess"
          @back-to-login="currentForm = 'login'"
        />
        <OTPLoginForm
          v-else-if="currentForm === 'otp-login'"
          :email="otpEmail"
          @success="handleAuthSuccess"
          @back-to-login="currentForm = 'login'"
        />
      </Transition>
    </div>
    
    <!-- Theme Toggle -->
    <button class="theme-toggle" @click="toggleTheme">
      <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import LoginForm from '../components/composites/LoginForm.vue'
import RegisterForm from '../components/composites/RegisterForm.vue'
import ForgotPasswordForm from '../components/composites/ForgotPasswordForm.vue'
import ResetPasswordForm from '../components/composites/ResetPasswordForm.vue'
import OTPVerificationForm from '../components/composites/OTPVerificationForm.vue'
import OTPLoginForm from '../components/composites/OTPLoginForm.vue'

export default {
  name: 'AuthView',
  components: {
    LoginForm,
    RegisterForm,
    ForgotPasswordForm,
    ResetPasswordForm,
    OTPVerificationForm,
    OTPLoginForm
  },
  
  setup() {
    const store = useStore()
    const router = useRouter()
    const currentForm = ref('login')
    const otpEmail = ref('')
    
    const isDark = computed(() => store.getters['ui/isDark'])
    
    const handleAuthSuccess = () => {
      router.push('/dashboard')
    }
    
    const handleRegisterSuccess = () => {
      // Redirect back to login after successful registration
      currentForm.value = 'login'
      store.dispatch('ui/showToast', {
        type: 'success',
        message: 'Account created successfully! You can now sign in with your email and password.'
      })
    }
    
    const handleForgotPasswordSuccess = () => {
      currentForm.value = 'reset-password'
      store.dispatch('ui/showToast', {
        type: 'success',
        message: 'Verification code sent to your email'
      })
    }

    const handleResetPasswordSuccess = () => {
      currentForm.value = 'login'
      store.dispatch('auth/CLEAR_RESET_EMAIL') // Clear the stored email
      store.dispatch('ui/showToast', {
        type: 'success',
        message: 'Password reset successfully! You can now sign in with your new password.'
      })
    }
    
    const handleOTPSuccess = () => {
      router.push('/dashboard')
    }
    
    const handleOTPLogin = (data) => {
      otpEmail.value = data.email
      currentForm.value = 'otp-login'
    }
    
    const toggleTheme = () => {
      const newTheme = isDark.value ? 'light' : 'dark'
      store.dispatch('ui/setTheme', newTheme)
    }
    
    return {
      currentForm,
      otpEmail,
      isDark,
      handleAuthSuccess,
      handleRegisterSuccess,
      handleForgotPasswordSuccess,
      handleResetPasswordSuccess,
      handleOTPSuccess,
      handleOTPLogin,
      toggleTheme
    }
  }
}
</script>

<style scoped>
.auth-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: #f8fafc;
  position: relative;
}

.auth-container {
  width: 100%;
  max-width: 28rem;
}

.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
}

.theme-toggle:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.theme-toggle svg {
  width: 1.5rem;
  height: 1.5rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
