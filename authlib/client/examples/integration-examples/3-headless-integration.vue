<!-- 
  EXAMPLE 3: Headless Integration (1 hour)
  
  This shows how to use only the store logic and build completely
  custom UI components while leveraging the SDK's authentication logic.
-->

<template>
  <div class="headless-auth-app">
    <!-- Custom navigation -->
    <nav class="custom-nav">
      <div class="nav-brand">
        <h1>Custom Auth UI</h1>
      </div>
      <div class="nav-actions">
        <button 
          v-if="!isAuthenticated"
          @click="showAuthModal = true"
          class="nav-btn primary"
        >
          Sign In
        </button>
        <div v-else class="user-menu">
          <img :src="currentUser?.avatar" :alt="currentUser?.name" class="avatar" />
          <span>{{ currentUser?.name }}</span>
          <button @click="logout" class="nav-btn secondary">Logout</button>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="main-content">
      <div v-if="!isAuthenticated" class="landing-page">
        <div class="hero-section">
          <h1>Welcome to Our Platform</h1>
          <p>Experience the power of custom authentication</p>
          <button @click="showAuthModal = true" class="cta-button">
            Get Started
          </button>
        </div>
      </div>
      
      <div v-else class="dashboard">
        <h2>Welcome back, {{ currentUser?.name }}! 👋</h2>
        <div class="dashboard-grid">
          <div class="stat-card">
            <h3>Login Method</h3>
            <p>{{ currentUser?.loginMethod || 'password' }}</p>
          </div>
          <div class="stat-card">
            <h3>Account Type</h3>
            <p>{{ currentUser?.provider || 'email' }}</p>
          </div>
          <div class="stat-card">
            <h3>Last Login</h3>
            <p>{{ formatDate(new Date()) }}</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Custom Auth Modal -->
    <div v-if="showAuthModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ authMode === 'login' ? 'Sign In' : authMode === 'register' ? 'Create Account' : 'Verify Email' }}</h2>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        
        <div class="modal-body">
          <!-- Custom Login Form -->
          <form v-if="authMode === 'login'" @submit.prevent="handleLogin" class="custom-form">
            <div class="form-group">
              <label>Email Address</label>
              <input 
                v-model="loginForm.email"
                type="email"
                :class="{ error: emailError }"
                @blur="validateEmail"
                placeholder="Enter your email"
              />
              <span v-if="emailError" class="error-text">{{ emailError }}</span>
            </div>
            
            <div class="form-group" v-if="!loginForm.useOTP">
              <label>Password</label>
              <div class="password-input">
                <input 
                  v-model="loginForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                />
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  class="toggle-password"
                >
                  {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
            </div>
            
            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" v-model="loginForm.rememberMe" />
                <span>Remember me</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" v-model="loginForm.useOTP" />
                <span>Use OTP (more secure)</span>
              </label>
            </div>
            
            <div v-if="authError" class="error-message">
              {{ authError }}
            </div>
            
            <button 
              type="submit" 
              :disabled="!isLoginFormValid || isLoading"
              class="submit-btn"
            >
              <span v-if="isLoading" class="spinner"></span>
              {{ isLoading ? 'Signing in...' : (loginForm.useOTP ? 'Send OTP' : 'Sign In') }}
            </button>
            
            <div class="form-footer">
              <button type="button" @click="authMode = 'register'" class="link-btn">
                Don't have an account? Sign up
              </button>
              <button type="button" @click="authMode = 'forgot'" class="link-btn">
                Forgot password?
              </button>
            </div>
          </form>
          
          <!-- Custom OTP Form -->
          <form v-else-if="authMode === 'otp'" @submit.prevent="handleOTPVerification" class="custom-form">
            <div class="otp-header">
              <div class="otp-icon">📧</div>
              <p>We sent a 6-digit code to</p>
              <strong>{{ maskedEmail }}</strong>
            </div>
            
            <div class="otp-input-group">
              <input 
                v-for="(digit, index) in otpDigits"
                :key="index"
                v-model="otpDigits[index]"
                type="text"
                maxlength="1"
                class="otp-digit"
                @input="handleOTPInput(index, $event)"
                @keydown="handleOTPKeydown(index, $event)"
                :ref="el => otpInputs[index] = el"
              />
            </div>
            
            <div class="otp-timer" v-if="otpTimer > 0">
              Code expires in {{ formatTimer(otpTimer) }}
            </div>
            
            <div v-if="authError" class="error-message">
              {{ authError }}
            </div>
            
            <button 
              type="submit" 
              :disabled="!isOTPComplete || isLoading"
              class="submit-btn"
            >
              <span v-if="isLoading" class="spinner"></span>
              {{ isLoading ? 'Verifying...' : 'Verify & Sign In' }}
            </button>
            
            <div class="otp-actions">
              <button 
                type="button" 
                @click="resendOTP" 
                :disabled="canResend === false"
                class="link-btn"
              >
                Resend Code
              </button>
              <button type="button" @click="authMode = 'login'" class="link-btn">
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { isValidEmail, getEmailError } from '../src/utils/validators.js'

export default {
  name: 'HeadlessAuthApp',
  
  setup() {
    const store = useStore()
    
    // State
    const showAuthModal = ref(false)
    const authMode = ref('login')
    const showPassword = ref(false)
    const otpTimer = ref(0)
    const canResend = ref(true)
    const otpInputs = ref([])
    
    // Form data
    const loginForm = ref({
      email: '',
      password: '',
      rememberMe: false,
      useOTP: false
    })
    
    const otpDigits = ref(['', '', '', '', '', ''])
    
    // Computed
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
    const currentUser = computed(() => store.getters['auth/currentUser'])
    const isLoading = computed(() => store.getters['auth/isLoading'])
    const authError = computed(() => store.getters['auth/error'])
    
    const emailError = ref('')
    
    const isLoginFormValid = computed(() => {
      if (loginForm.value.useOTP) {
        return loginForm.value.email.trim() !== '' && isValidEmail(loginForm.value.email)
      }
      return loginForm.value.email.trim() !== '' && 
             loginForm.value.password.trim() !== '' && 
             isValidEmail(loginForm.value.email)
    })
    
    const isOTPComplete = computed(() => {
      return otpDigits.value.every(digit => digit !== '')
    })
    
    const maskedEmail = computed(() => {
      if (!loginForm.value.email) return ''
      const [local, domain] = loginForm.value.email.split('@')
      if (local.length <= 2) return loginForm.value.email
      const masked = local.substring(0, 2) + '*'.repeat(local.length - 2)
      return `${masked}@${domain}`
    })
    
    // Methods
    const validateEmail = () => {
      emailError.value = getEmailError(loginForm.value.email)
    }
    
    const handleLogin = async () => {
      validateEmail()
      if (emailError.value) return
      
      try {
        if (loginForm.value.useOTP) {
          await store.dispatch('auth/initiateOTPLogin', {
            email: loginForm.value.email
          })
          authMode.value = 'otp'
          startOTPTimer()
        } else {
          await store.dispatch('auth/login', {
            email: loginForm.value.email,
            password: loginForm.value.password,
            remember: loginForm.value.rememberMe
          })
          closeModal()
        }
      } catch (error) {
        console.error('Login failed:', error)
      }
    }
    
    const handleOTPVerification = async () => {
      const code = otpDigits.value.join('')
      try {
        await store.dispatch('auth/verifyLoginOTP', {
          email: loginForm.value.email,
          code
        })
        closeModal()
      } catch (error) {
        console.error('OTP verification failed:', error)
        // Clear OTP inputs on error
        otpDigits.value = ['', '', '', '', '', '']
        if (otpInputs.value[0]) {
          otpInputs.value[0].focus()
        }
      }
    }
    
    const handleOTPInput = (index, event) => {
      const value = event.target.value
      if (!/^\d*$/.test(value)) {
        event.target.value = otpDigits.value[index]
        return
      }
      
      otpDigits.value[index] = value
      
      // Auto-focus next input
      if (value && index < 5 && otpInputs.value[index + 1]) {
        otpInputs.value[index + 1].focus()
      }
    }
    
    const handleOTPKeydown = (index, event) => {
      // Handle backspace
      if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
        otpInputs.value[index - 1].focus()
      }
    }
    
    const startOTPTimer = () => {
      otpTimer.value = 300 // 5 minutes
      const interval = setInterval(() => {
        otpTimer.value--
        if (otpTimer.value <= 0) {
          clearInterval(interval)
        }
      }, 1000)
    }
    
    const resendOTP = async () => {
      try {
        await store.dispatch('auth/sendLoginOTP', {
          email: loginForm.value.email,
          expirySeconds: 300
        })
        startOTPTimer()
        canResend.value = false
        setTimeout(() => {
          canResend.value = true
        }, 60000) // 1 minute cooldown
      } catch (error) {
        console.error('Failed to resend OTP:', error)
      }
    }
    
    const closeModal = () => {
      showAuthModal.value = false
      authMode.value = 'login'
      loginForm.value = {
        email: '',
        password: '',
        rememberMe: false,
        useOTP: false
      }
      otpDigits.value = ['', '', '', '', '', '']
      emailError.value = ''
    }
    
    const logout = () => {
      store.dispatch('auth/logout')
    }
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const formatTimer = (seconds) => {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    
    return {
      // State
      showAuthModal,
      authMode,
      showPassword,
      otpTimer,
      canResend,
      otpInputs,
      loginForm,
      otpDigits,
      emailError,
      
      // Computed
      isAuthenticated,
      currentUser,
      isLoading,
      authError,
      isLoginFormValid,
      isOTPComplete,
      maskedEmail,
      
      // Methods
      validateEmail,
      handleLogin,
      handleOTPVerification,
      handleOTPInput,
      handleOTPKeydown,
      resendOTP,
      closeModal,
      logout,
      formatDate,
      formatTimer
    }
  }
}
</script>

<style scoped>
.headless-auth-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%);
}

.custom-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-brand h1 {
  color: white;
  margin: 0;
  font-size: 1.5rem;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-btn.primary {
  background: #3b82f6;
  color: white;
}

.nav-btn.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.nav-btn:hover {
  transform: translateY(-1px);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
}

.avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
}

.main-content {
  padding: 4rem 2rem;
}

.landing-page {
  text-align: center;
  color: white;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-section p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-button {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.cta-button:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.dashboard {
  max-width: 1000px;
  margin: 0 auto;
  color: white;
}

.dashboard h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  opacity: 0.8;
}

.stat-card p {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
}

.modal-body {
  padding: 1.5rem;
}

.custom-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #374151;
}

.form-group input {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-group input.error {
  border-color: #ef4444;
}

.error-text {
  color: #ef4444;
  font-size: 0.875rem;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
}

.form-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.error-message {
  padding: 0.75rem;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.submit-btn {
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.form-footer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.link-btn {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-size: 0.875rem;
  text-decoration: underline;
}

/* OTP Styles */
.otp-header {
  text-align: center;
  margin-bottom: 2rem;
}

.otp-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.otp-input-group {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.otp-digit {
  width: 3rem;
  height: 3rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: border-color 0.2s;
}

.otp-digit:focus {
  outline: none;
  border-color: #3b82f6;
}

.otp-timer {
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.otp-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .custom-nav {
    padding: 1rem;
  }
  
  .nav-brand h1 {
    font-size: 1.25rem;
  }
  
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    margin: 1rem;
  }
}
</style>
