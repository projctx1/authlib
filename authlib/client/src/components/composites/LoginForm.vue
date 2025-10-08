<template>
  <AuthCard :title="stepTitle" :subtitle="stepSubtitle">
    <form @submit.prevent="handleSubmit" class="auth-form">
      <!-- Step 1: Email Input -->
      <div v-if="currentStep === 'email'">
        <EmailInput v-model="email" label="Email Address" required />
        
        <AlertMessage v-if="error" type="error" :message="error" />
        
        <SubmitButton :is-loading="isLoading" :disabled="!isEmailValid" full-width>
          Continue
        </SubmitButton>
        
        <SocialLoginButtons :providers="['google', 'github']" @social-login="handleSocialLogin" />
      </div>
      
      <!-- Step 2: Choose Login Method -->
      <div v-else-if="currentStep === 'method'" class="method-selection">
        <div class="user-info">
          <div class="user-avatar">👤</div>
          <p class="user-email">{{ email }}</p>
          <p class="welcome-text">How would you like to sign in?</p>
        </div>
        
        <div class="method-options">
          <button type="button" @click="selectMethod('password')" class="method-button">
            <div class="method-icon">🔑</div>
            <div class="method-content">
              <h3>Use Password</h3>
              <p>Sign in with your password</p>
            </div>
          </button>
          
          <button type="button" @click="selectMethod('otp')" class="method-button">
            <div class="method-icon">📧</div>
            <div class="method-content">
              <h3>Send me an OTP</h3>
              <p>Get a verification code via email</p>
            </div>
          </button>
        </div>
        
        <div class="step-navigation">
          <TextButton @click="goBack" class="back-button">
            ← Change email
          </TextButton>
          <TextButton @click="$emit('switch-to-register')" class="signup-link">
            Sign up instead
          </TextButton>
        </div>
      </div>
      
      <!-- Step 3A: Password Login -->
      <div v-else-if="currentStep === 'password'">
        <div class="user-info-small">
          <span class="user-email-small">{{ email }}</span>
          <TextButton @click="goBack" class="change-email">Change</TextButton>
        </div>
        
        <PasswordInput v-model="password" label="Password" required />
        
        <div class="form-row">
          <CheckboxInput v-model="rememberMe">Remember me</CheckboxInput>
          <TextButton @click="$emit('forgot-password')">Forgot password?</TextButton>
        </div>
        
        <AlertMessage v-if="error" type="error" :message="error" />
        
        <SubmitButton :is-loading="isLoading" :disabled="!password" full-width>
          Sign In
        </SubmitButton>
        
        <div class="step-footer">
          <p class="auth-footer-text">
            Don't have an account?
            <TextButton @click="$emit('switch-to-register')" class="signup-link">Sign up</TextButton>
          </p>
        </div>
      </div>
      
      <!-- Step 3B: OTP Verification -->
      <div v-else-if="currentStep === 'otp'">
        <div class="otp-info">
          <div class="otp-icon">📧</div>
          <p class="otp-message">
            We've sent a 6-digit code to<br>
            <strong>{{ maskedEmail }}</strong>
          </p>
        </div>
        
        <OTPInput
          v-model="otpCode"
          :length="6"
          show-timer
          show-resend
          @complete="handleOTPComplete"
          @resend="handleResendOTP"
        />
        
        <AlertMessage v-if="error" type="error" :message="error" />
        <AlertMessage v-if="success" type="success" :message="success" />
        
        <SubmitButton :is-loading="isLoading" :disabled="otpCode.length !== 6" full-width>
          Verify & Sign In
        </SubmitButton>
        
        <div class="otp-actions">
          <TextButton @click="goBack" class="back-button">
            ← Back to login options
          </TextButton>
          <TextButton @click="$emit('switch-to-register')" class="signup-link">
            Create new account
          </TextButton>
        </div>
        
        <div class="step-footer">
          <p class="auth-footer-text">
            Don't have an account?
            <TextButton @click="$emit('switch-to-register')" class="signup-link">Create one</TextButton>
          </p>
        </div>
      </div>
    </form>
    
    <!-- Footer (shown on email step) -->
    <template v-if="currentStep === 'email'" #footer>
      <p class="auth-footer-text">
        Don't have an account?
        <TextButton @click="$emit('switch-to-register')">Sign up</TextButton>
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
import CheckboxInput from '../inputs/CheckboxInput.vue'
import OTPInput from '../inputs/OTPInput.vue'
import SubmitButton from '../buttons/SubmitButton.vue'
import TextButton from '../buttons/TextButton.vue'
import SocialLoginButtons from '../buttons/SocialLoginButtons.vue'
import AlertMessage from '../feedback/AlertMessage.vue'

export default {
  name: 'LoginForm',
  components: { 
    AuthCard, 
    EmailInput, 
    PasswordInput, 
    CheckboxInput, 
    OTPInput,
    SubmitButton, 
    TextButton, 
    SocialLoginButtons, 
    AlertMessage 
  },
  emits: ['forgot-password', 'switch-to-register', 'success'],
  
  setup(props, { emit }) {
    const store = useStore()
    const email = ref('')
    const password = ref('')
    const otpCode = ref('')
    const rememberMe = ref(false)
    const currentStep = ref('email') // 'email', 'method', 'password', 'otp'
    const success = ref('')
    
    const isLoading = computed(() => store.getters['auth/isLoading'])
    const error = computed(() => store.getters['auth/error'])
    
    // Step titles and subtitles
    const stepTitle = computed(() => {
      switch (currentStep.value) {
        case 'email': return 'Sign In'
        case 'method': return 'Welcome back!'
        case 'password': return 'Enter Password'
        case 'otp': return 'Check your email'
        default: return 'Sign In'
      }
    })
    
    const stepSubtitle = computed(() => {
      switch (currentStep.value) {
        case 'email': return 'Enter your email to continue'
        case 'method': return email.value
        case 'password': return 'Enter your password to sign in'
        case 'otp': return `We sent a code to ${maskedEmail.value}`
        default: return 'Welcome back!'
      }
    })
    
    // Email validation
    const isEmailValid = computed(() => {
      return email.value.trim() !== '' && isValidEmail(email.value)
    })
    
    // Mask email for display
    const maskedEmail = computed(() => {
      if (!email.value) return ''
      const [local, domain] = email.value.split('@')
      const masked = local.substring(0, 2) + '*'.repeat(local.length - 2)
      return `${masked}@${domain}`
    })
    
    const handleSubmit = async () => {
      store.dispatch('auth/clearError')
      
      if (currentStep.value === 'email') {
        // Step 1: Email validation and proceed to method selection
        if (!isEmailValid.value) {
          store.commit('auth/SET_ERROR', 'Please enter a valid email address')
          return
        }
        currentStep.value = 'method'
        return
      }
      
      if (currentStep.value === 'password') {
        // Step 3A: Password login
        if (!password.value.trim()) {
          store.commit('auth/SET_ERROR', 'Password is required')
          return
        }
        
        try {
          const result = await store.dispatch('auth/login', {
            email: email.value,
            password: password.value
          })
          
          if (result) {
            // Log authentication success to console
            console.log('🎉 Password Login Successful!')
            console.log('🔑 JWT Token:', store.getters['auth/token'])
            console.log('👤 User Data:', result.user)
            console.log('🔐 Is Authenticated:', store.getters['auth/isAuthenticated'])
            
            // Small delay to ensure store state is updated
            setTimeout(() => {
              console.log('🚀 LoginForm: Emitting success event (password)')
              emit('success', result)
            }, 100)
          }
        } catch (e) {
          // Error is handled by the store
        }
        return
      }
      
      if (currentStep.value === 'otp') {
        // Step 3B: OTP verification
        if (otpCode.value.length !== 6) {
          store.commit('auth/SET_ERROR', 'Please enter the 6-digit code')
          return
        }
        
        try {
          const result = await store.dispatch('auth/verifyLoginOTP', {
            email: email.value,
            code: otpCode.value
          })
          
          if (result.success) {
            // Log authentication success to console
            console.log('🎉 OTP Login Successful!')
            console.log('🔑 JWT Token:', store.getters['auth/token'])
            console.log('👤 User Data:', result.user)
            console.log('🔐 Is Authenticated:', store.getters['auth/isAuthenticated'])
            
            success.value = 'Login successful! Redirecting...'
            setTimeout(() => {
              console.log('🚀 LoginForm: Emitting success event')
              emit('success', result.user)
            }, 100)
          }
        } catch (e) {
          otpCode.value = '' // Clear the code on error
        }
      }
    }
    
    const selectMethod = async (method) => {
      if (method === 'password') {
        currentStep.value = 'password'
      } else if (method === 'otp') {
        // Send OTP first
        try {
          await store.dispatch('auth/sendLoginOTP', { 
            email: email.value
          })
          currentStep.value = 'otp'
          success.value = 'Verification code sent to your email!'
          setTimeout(() => {
            success.value = ''
          }, 3000)
        } catch (e) {
          // Error is handled by the store
        }
      }
    }
    
    const goBack = () => {
      if (currentStep.value === 'method') {
        currentStep.value = 'email'
      } else if (currentStep.value === 'password' || currentStep.value === 'otp') {
        currentStep.value = 'method'
      }
      store.dispatch('auth/clearError')
    }
    
    const handleOTPComplete = async (otp) => {
      otpCode.value = otp
      await handleSubmit()
    }
    
    const handleResendOTP = async () => {
      try {
        await store.dispatch('auth/sendLoginOTP', { 
          email: email.value
        })
        
        success.value = 'New code sent to your email'
        setTimeout(() => {
          success.value = ''
        }, 3000)
      } catch (error) {
        // Error handled by store
      }
    }
    
    const handleSocialLogin = (provider) => {
      console.log(`Social login with ${provider}`)
      // TODO: Implement social login
    }
    
    return { 
      email, 
      password, 
      otpCode,
      rememberMe, 
      currentStep,
      success,
      isLoading, 
      error, 
      stepTitle,
      stepSubtitle,
      isEmailValid,
      maskedEmail,
      handleSubmit, 
      selectMethod,
      goBack,
      handleOTPComplete,
      handleResendOTP,
      handleSocialLogin 
    }
  }
}
</script>
<style scoped>
/* Method Selection */
.method-selection {
  text-align: center;
}

.user-info {
  margin-bottom: 2rem;
}

.user-avatar {
  width: 4rem;
  height: 4rem;
  background: var(--primary-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 1rem;
}

.user-email {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem;
}

.welcome-text {
  color: var(--text-secondary);
  margin: 0;
}

.method-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.method-button {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 0.75rem;
  background: var(--bg-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.method-button:hover {
  border-color: var(--primary-color);
  background: var(--primary-light);
}

.method-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.method-content h3 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.method-content p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* User Info Small */
.user-info-small {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.user-email-small {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.change-email {
  font-size: 0.875rem;
  color: var(--primary-color);
}

/* OTP Info */
.otp-info {
  text-align: center;
  margin-bottom: 2rem;
}

.otp-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.otp-message {
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

.otp-message strong {
  color: var(--text-primary);
  font-weight: 600;
}

.otp-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.step-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.step-footer {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.signup-link {
  color: var(--primary-color);
  font-size: 0.875rem;
}

.signup-link:hover {
  color: var(--primary-dark);
}

.back-button {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.back-button:hover {
  color: var(--text-primary);
}

/* Form Row */
.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
}

@media (max-width: 768px) {
  .method-options {
    gap: 0.75rem;
  }
  
  .method-button {
    padding: 0.75rem;
  }
  
  .method-icon {
    font-size: 1.25rem;
    margin-right: 0.75rem;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }
  
  .step-navigation,
  .otp-actions {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
  
  .step-footer {
    margin-top: 1rem;
    padding-top: 0.75rem;
  }
}
</style>
