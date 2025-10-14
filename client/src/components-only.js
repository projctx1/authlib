// Components-only export file for smaller bundle size
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

// Styles
import './styles/main.scss'

// Plugin installation function for components only
const VueAuthComponents = {
  install(app, options = {}) {
    const config = {
      componentPrefix: '',
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

    // Register components
    const registerComponent = (name, component) => {
      if (config.components[name]) {
        const componentName = `${config.componentPrefix}${name}`
        app.component(componentName, component)
      }
    }

    registerComponent('LoginForm', LoginForm)
    registerComponent('RegisterForm', RegisterForm)
    registerComponent('ForgotPasswordForm', ForgotPasswordForm)
    registerComponent('OTPVerificationForm', OTPVerificationForm)
    registerComponent('EmailInput', EmailInput)
    registerComponent('PasswordInput', PasswordInput)
    registerComponent('TextInput', TextInput)
    registerComponent('CheckboxInput', CheckboxInput)
    registerComponent('OTPInput', OTPInput)
    registerComponent('SubmitButton', SubmitButton)
    registerComponent('TextButton', TextButton)
    registerComponent('SocialLoginButtons', SocialLoginButtons)
    registerComponent('AuthCard', AuthCard)
    registerComponent('AlertMessage', AlertMessage)
    registerComponent('LoadingSpinner', LoadingSpinner)

    console.log('🚀 Vue Auth Components installed!')
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
  router
}

// Default export (plugin)
export default VueAuthComponents