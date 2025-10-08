// Main SDK export file
import { createApp } from 'vue'
import store from './store'
import router from './router'

// Components
import LoginForm from './components/composites/LoginForm.vue'
import RegisterForm from './components/composites/RegisterForm.vue'
import ForgotPasswordForm from './components/composites/ForgotPasswordForm.vue'
import OTPVerificationForm from './components/composites/OTPVerificationForm.vue'

// Input Components
import EmailInput from './components/inputs/EmailInput.vue'
import PasswordInput from './components/inputs/PasswordInput.vue'
import TextInput from './components/inputs/TextInput.vue'
import CheckboxInput from './components/inputs/CheckboxInput.vue'
import OTPInput from './components/inputs/OTPInput.vue'

// Button Components
import SubmitButton from './components/buttons/SubmitButton.vue'
import TextButton from './components/buttons/TextButton.vue'
import SocialLoginButtons from './components/buttons/SocialLoginButtons.vue'

// Card Components
import AuthCard from './components/cards/AuthCard.vue'

// Feedback Components
import AlertMessage from './components/feedback/AlertMessage.vue'
import LoadingSpinner from './components/feedback/LoadingSpinner.vue'

// Utilities
import * as validators from './utils/validators'

// Styles
import './styles/main.scss'

// Plugin installation function
const VueAuthSDK = {
  install(app, options = {}) {
    // Register all components globally
    app.component('LoginForm', LoginForm)
    app.component('RegisterForm', RegisterForm)
    app.component('ForgotPasswordForm', ForgotPasswordForm)
    app.component('OTPVerificationForm', OTPVerificationForm)
    
    app.component('EmailInput', EmailInput)
    app.component('PasswordInput', PasswordInput)
    app.component('TextInput', TextInput)
    app.component('CheckboxInput', CheckboxInput)
    app.component('OTPInput', OTPInput)
    
    app.component('SubmitButton', SubmitButton)
    app.component('TextButton', TextButton)
    app.component('SocialLoginButtons', SocialLoginButtons)
    
    app.component('AuthCard', AuthCard)
    app.component('AlertMessage', AlertMessage)
    app.component('LoadingSpinner', LoadingSpinner)
    
    // Add store if not already present
    if (!app.config.globalProperties.$store) {
      app.use(store)
    }
    
    // Initialize theme
    store.dispatch('ui/initTheme')
    
    // Provide SDK configuration
    app.provide('authSDKConfig', {
      apiEndpoint: options.apiEndpoint || '/api/auth',
      theme: options.theme || 'light',
      ...options
    })
  }
}

// Named exports for individual components
export {
  // Composite Forms
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  OTPVerificationForm,
  
  // Input Components
  EmailInput,
  PasswordInput,
  TextInput,
  CheckboxInput,
  OTPInput,
  
  // Button Components
  SubmitButton,
  TextButton,
  SocialLoginButtons,
  
  // Card Components
  AuthCard,
  
  // Feedback Components
  AlertMessage,
  LoadingSpinner,
  
  // Store and Router
  store,
  router,
  
  // Utilities
  validators
}

// Default export (plugin)
export default VueAuthSDK

// Auto-install when used via script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueAuthSDK)
}
