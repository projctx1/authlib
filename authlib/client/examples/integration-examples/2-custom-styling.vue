<!-- 
  EXAMPLE 2: Custom Styling Integration (30 minutes)
  
  This shows how to use individual components with custom branding
  and styling to match your app's design system.
-->

<template>
  <div class="custom-auth-app">
    <!-- Custom branded header -->
    <div class="brand-header">
      <div class="brand-logo">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
        </svg>
        <span>SecureApp</span>
      </div>
      <p class="brand-tagline">Enterprise-grade security made simple</p>
    </div>

    <!-- Custom auth container -->
    <div class="auth-container">
      <div class="auth-card-wrapper">
        <!-- Login Form with custom styling -->
        <LoginForm 
          v-if="currentView === 'login'"
          @success="handleLogin"
          @forgot-password="currentView = 'forgot'"
          @otp-login="handleOTPLogin"
          class="branded-form"
        />
        
        <!-- OTP Login Form -->
        <OTPLoginForm
          v-else-if="currentView === 'otp'"
          :email="otpEmail"
          @success="handleLogin"
          @back-to-login="currentView = 'login'"
          class="branded-form"
        />
        
        <!-- Forgot Password Form -->
        <ForgotPasswordForm
          v-else-if="currentView === 'forgot'"
          @success="handleForgotSuccess"
          @back-to-login="currentView = 'login'"
          class="branded-form"
        />
        
        <!-- Custom footer -->
        <div class="auth-footer">
          <p>© 2024 SecureApp. All rights reserved.</p>
          <div class="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#help">Help Center</a>
          </div>
        </div>
      </div>
      
      <!-- Custom features sidebar -->
      <div class="features-sidebar">
        <h3>Why Choose SecureApp?</h3>
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">🔐</div>
            <div>
              <h4>Bank-Level Security</h4>
              <p>256-bit encryption and multi-factor authentication</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⚡</div>
            <div>
              <h4>Lightning Fast</h4>
              <p>Optimized for speed and performance</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🌍</div>
            <div>
              <h4>Global Access</h4>
              <p>Available worldwide with 99.9% uptime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore, useRouter } from 'vuex'
import LoginForm from '../src/components/composites/LoginForm.vue'
import OTPLoginForm from '../src/components/composites/OTPLoginForm.vue'
import ForgotPasswordForm from '../src/components/composites/ForgotPasswordForm.vue'

export default {
  name: 'CustomStyledApp',
  components: {
    LoginForm,
    OTPLoginForm,
    ForgotPasswordForm
  },
  
  setup() {
    const store = useStore()
    const router = useRouter()
    const currentView = ref('login')
    const otpEmail = ref('')
    
    const handleLogin = (user) => {
      console.log('Login successful:', user)
      // Custom success logic
      showSuccessAnimation()
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    }
    
    const handleOTPLogin = (data) => {
      otpEmail.value = data.email
      currentView.value = 'otp'
    }
    
    const handleForgotSuccess = () => {
      currentView.value = 'login'
      showNotification('Password reset instructions sent!')
    }
    
    const showSuccessAnimation = () => {
      // Custom success animation
      document.body.classList.add('login-success')
      setTimeout(() => {
        document.body.classList.remove('login-success')
      }, 2000)
    }
    
    const showNotification = (message) => {
      // Custom notification system
      const notification = document.createElement('div')
      notification.className = 'custom-notification'
      notification.textContent = message
      document.body.appendChild(notification)
      
      setTimeout(() => {
        notification.remove()
      }, 3000)
    }
    
    return {
      currentView,
      otpEmail,
      handleLogin,
      handleOTPLogin,
      handleForgotSuccess
    }
  }
}
</script>

<style scoped>
.custom-auth-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

.brand-header {
  text-align: center;
  padding: 2rem;
  color: white;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.brand-logo svg {
  width: 2rem;
  height: 2rem;
}

.brand-tagline {
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0;
}

.auth-container {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.auth-card-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.features-sidebar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  padding: 2rem;
}

.features-sidebar h3 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.feature-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.feature-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.feature-item h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
}

.feature-item p {
  margin: 0;
  opacity: 0.9;
  line-height: 1.5;
}

.auth-footer {
  margin-top: 2rem;
  padding: 1.5rem;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  backdrop-filter: blur(10px);
  color: white;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.875rem;
}

.footer-links a:hover {
  color: white;
  text-decoration: underline;
}

/* Custom form styling */
.branded-form {
  /* Override SDK variables */
  --primary-color: #6366f1;
  --bg-primary: rgba(255, 255, 255, 0.95);
  --border-radius-lg: 1rem;
}

.branded-form :deep(.auth-card) {
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.branded-form :deep(.auth-button-primary) {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.branded-form :deep(.auth-button-primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.branded-form :deep(.auth-input) {
  border: 2px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.branded-form :deep(.auth-input:focus) {
  border-color: #6366f1;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Success animation */
:global(body.login-success) {
  animation: successPulse 1.5s ease-in-out;
}

@keyframes successPulse {
  0%, 100% { background-color: transparent; }
  50% { background-color: rgba(16, 185, 129, 0.1); }
}

/* Custom notification */
:global(.custom-notification) {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background-color: #10b981;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .auth-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .features-sidebar {
    order: -1;
    padding: 1rem;
  }
  
  .feature-list {
    flex-direction: row;
    overflow-x: auto;
    gap: 1rem;
  }
  
  .feature-item {
    flex-shrink: 0;
    min-width: 200px;
  }
}
</style>
