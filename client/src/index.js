// Main SDK export file
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

// Composables
import { useTheme } from './composables/useTheme'
import { useAuth } from './composables/useAuth'
import { useFormValidation } from './composables/useFormValidation'

// Styles
import './styles/main.scss'

// Plugin installation function
const VueAuthSDK = {
  install(app, options = {}) {
    // Merge options with defaults
    const config = {
      apiEndpoint: '/api/auth',
      theme: 'default',
      injectStyles: true,
      componentPrefix: '',
      lazyLoad: false,
      components: {
        LoginForm: true,
        RegisterForm: true,
        ForgotPasswordForm: true,
        OTPVerificationForm: true,
        EmailInput: true,
        PasswordInput: true,
        TextInput: true,
        CheckboxInput: true,
        OTPInput: true,
        SubmitButton: true,
        TextButton: true,
        SocialLoginButtons: true,
        AuthCard: true,
        AlertMessage: true,
        LoadingSpinner: true
      },
      ...options
    }

    // Lazy load helper
    const defineAsyncComponent = (loader) => {
      if (typeof window !== 'undefined' && window.defineAsyncComponent) {
        return window.defineAsyncComponent(loader)
      }
      // Fallback for environments without defineAsyncComponent
      return loader()
    }

    // Conditionally register components based on config
    const registerComponent = (name, componentLoader) => {
      if (config.components[name]) {
        const componentName = `${config.componentPrefix}${name}`

        if (config.lazyLoad) {
          // Lazy load component
          const asyncComponent = defineAsyncComponent(componentLoader)
          app.component(componentName, asyncComponent)
        } else {
          // Load component immediately
          const component = componentLoader()
          app.component(componentName, component)
        }
      }
    }

    // Register composite form components
    registerComponent('LoginForm', () => LoginForm)
    registerComponent('RegisterForm', () => RegisterForm)
    registerComponent('ForgotPasswordForm', () => ForgotPasswordForm)
    registerComponent('OTPVerificationForm', () => OTPVerificationForm)

    // Register input components
    registerComponent('EmailInput', () => EmailInput)
    registerComponent('PasswordInput', () => PasswordInput)
    registerComponent('TextInput', () => TextInput)
    registerComponent('CheckboxInput', () => CheckboxInput)
    registerComponent('OTPInput', () => OTPInput)

    // Register button components
    registerComponent('SubmitButton', () => SubmitButton)
    registerComponent('TextButton', () => TextButton)
    registerComponent('SocialLoginButtons', () => SocialLoginButtons)

    // Register card components
    registerComponent('AuthCard', () => AuthCard)

    // Register feedback components
    registerComponent('AlertMessage', () => AlertMessage)
    registerComponent('LoadingSpinner', () => LoadingSpinner)

    // Add store if not already present
    if (!app.config.globalProperties.$store) {
      app.use(store)
    }

    // Initialize theme system
    if (config.theme && config.theme !== 'default') {
      // Apply custom theme immediately
      const { applyTheme } = useTheme()
      applyTheme(config.theme)
    } else {
      // Initialize with default theme
      store.dispatch('ui/initTheme')
    }

    // Provide SDK configuration globally
    app.provide('authSDKConfig', {
      apiEndpoint: config.apiEndpoint,
      theme: config.theme,
      injectStyles: config.injectStyles,
      componentPrefix: config.componentPrefix,
      ...config
    })

    // Provide theme composable globally
    app.provide('useTheme', useTheme)

    console.log('🚀 Vue Auth SDK installed with enhanced flexibility!')
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
  validators,

  // Composables
  useTheme,
  useAuth,
  useFormValidation
}

// Default export (plugin)
export default VueAuthSDK

// Auto-install when used via script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueAuthSDK)
}
