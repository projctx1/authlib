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
    
    
    return {
      currentForm,
      otpEmail,
      handleAuthSuccess,
      handleRegisterSuccess,
      handleForgotPasswordSuccess,
      handleResetPasswordSuccess,
      handleOTPSuccess,
      handleOTPLogin
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
  background: #fff;
}

.auth-container {
  width: 100%;
  max-width: 28rem;
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
