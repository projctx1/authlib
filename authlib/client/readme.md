# Vue Auth SDK

A comprehensive Vue.js and SCSS authentication SDK that provides beautiful, customizable authentication components with built-in state management, validation, and theming support.

## ✨ Features

- 🔐 **Secure Authentication** - JWT token-based authentication with refresh token support
- 🎨 **Beautiful UI Components** - Pre-built Vue components with SCSS styling
- 📱 **Responsive Design** - Mobile-first design that works on all devices
- 🔄 **State Management** - Vuex integration for centralized authentication state
- ✅ **Form Validation** - Real-time validation with customizable rules
- 🌙 **Dark Mode** - Built-in theme switching with CSS custom properties
- 🔑 **OTP Verification** - Two-factor authentication support
- 🌐 **Social Login** - Google, GitHub, Facebook integration
- 🎯 **TypeScript Ready** - Full TypeScript support (optional)
- 📦 **Tree Shakeable** - Import only what you need

## 🚀 Quick Start

### Installation

```bash
npm install vue-auth-sdk
# or
yarn add vue-auth-sdk
```

### Basic Usage

```javascript
import { createApp } from 'vue'
import VueAuthSDK from 'vue-auth-sdk'
import App from './App.vue'

const app = createApp(App)

// Install the plugin
app.use(VueAuthSDK, {
  apiEndpoint: 'https://your-api.com/auth',
  theme: 'light' // or 'dark'
})

app.mount('#app')
```

### Using Individual Components

```vue
<template>
  <div>
    <LoginForm 
      @success="handleLoginSuccess"
      @switch-to-register="showRegister = true"
    />
  </div>
</template>

<script>
import { LoginForm } from 'vue-auth-sdk'

export default {
  components: { LoginForm },
  methods: {
    handleLoginSuccess(user) {
      console.log('User logged in:', user)
      this.$router.push('/dashboard')
    }
  }
}
</script>
```

## 📚 Components

### Form Components

#### LoginForm
```vue
<LoginForm 
  @success="handleSuccess"
  @switch-to-register="showRegister"
  @forgot-password="showForgotPassword"
/>
```

#### RegisterForm
```vue
<RegisterForm 
  @success="handleSuccess"
  @switch-to-login="showLogin"
/>
```

#### ForgotPasswordForm
```vue
<ForgotPasswordForm 
  @success="handleSuccess"
  @back-to-login="showLogin"
/>
```

#### OTPVerificationForm
```vue
<OTPVerificationForm 
  @success="handleSuccess"
/>
```

### Input Components

#### EmailInput
```vue
<EmailInput 
  v-model="email"
  label="Email Address"
  placeholder="Enter your email"
  required
/>
```

#### PasswordInput
```vue
<PasswordInput 
  v-model="password"
  label="Password"
  show-strength-indicator
  show-toggle
  required
/>
```

#### TextInput
```vue
<TextInput 
  v-model="name"
  field-name="name"
  label="Full Name"
  placeholder="Enter your name"
  required
/>
```

#### OTPInput
```vue
<OTPInput 
  v-model="otp"
  :length="6"
  show-timer
  show-resend
  @complete="handleComplete"
  @resend="handleResend"
/>
```

### Button Components

#### SubmitButton
```vue
<SubmitButton 
  :is-loading="loading"
  :disabled="!isValid"
  full-width
>
  Sign In
</SubmitButton>
```

#### SocialLoginButtons
```vue
<SocialLoginButtons 
  :providers="['google', 'github', 'facebook']"
  @social-login="handleSocialLogin"
/>
```

## 🎨 Theming

The SDK supports light and dark themes out of the box. You can also create custom themes.

### Built-in Themes

```javascript
// Set theme programmatically
this.$store.dispatch('ui/setTheme', 'dark')

// Or use the theme toggle component
<button @click="toggleTheme">Toggle Theme</button>
```

### Custom Themes

Create custom themes by overriding CSS custom properties:

```css
[data-theme="custom"] {
  --primary-color: #your-color;
  --bg-primary: #your-bg;
  --text-primary: #your-text;
  /* ... other variables */
}
```

### SCSS Variables

Customize the design system by overriding SCSS variables:

```scss
// Override before importing
$primary-color: #your-primary-color;
$border-radius-md: 12px;

@import 'vue-auth-sdk/styles/main.scss';
```

## 🔧 Configuration

### Plugin Options

```javascript
app.use(VueAuthSDK, {
  // API configuration
  apiEndpoint: 'https://api.example.com/auth',
  
  // Theme configuration
  theme: 'light', // 'light' | 'dark' | 'custom'
  
  // Validation configuration
  validation: {
    passwordMinLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: false
  },
  
  // OTP configuration
  otp: {
    length: 6,
    expirySeconds: 300,
    cooldownSeconds: 60
  },
  
  // Social login providers
  socialProviders: {
    google: {
      clientId: 'your-google-client-id'
    },
    github: {
      clientId: 'your-github-client-id'
    }
  }
})
```

## 🔄 State Management

The SDK uses Vuex for state management. Access the auth state:

```javascript
// In your components
computed: {
  isAuthenticated() {
    return this.$store.getters['auth/isAuthenticated']
  },
  currentUser() {
    return this.$store.getters['auth/currentUser']
  },
  isLoading() {
    return this.$store.getters['auth/isLoading']
  }
}

// Actions
methods: {
  async login(credentials) {
    try {
      await this.$store.dispatch('auth/login', credentials)
      // Handle success
    } catch (error) {
      // Handle error
    }
  },
  
  logout() {
    this.$store.dispatch('auth/logout')
  }
}
```

## 🛡️ Validation

The SDK includes comprehensive form validation:

```javascript
// Custom validation rules
const customRules = [
  'required',
  'email',
  { minLength: 8 },
  { pattern: /^[A-Z]/, message: 'Must start with uppercase' },
  { custom: (value) => value !== 'admin' || 'Cannot use admin' }
]
```

## 🔌 API Integration

### Default API Endpoints

The SDK expects these endpoints by default:

- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset
- `POST /auth/verify-otp` - OTP verification
- `GET /auth/user` - Get current user

### Custom API Integration

Override the default API calls:

```javascript
// In your store module
import { authModule } from 'vue-auth-sdk'

const customAuthModule = {
  ...authModule,
  actions: {
    ...authModule.actions,
    async login({ commit }, credentials) {
      // Your custom login logic
      const response = await yourApiCall('/custom/login', credentials)
      commit('SET_USER', response.user)
      commit('SET_TOKEN', response.token)
      return response
    }
  }
}
```

## 🎯 Examples

### Complete Authentication Flow

```vue
<template>
  <div class="auth-container">
    <LoginForm 
      v-if="currentView === 'login'"
      @success="handleAuthSuccess"
      @switch-to-register="currentView = 'register'"
      @forgot-password="currentView = 'forgot'"
    />
    
    <RegisterForm 
      v-else-if="currentView === 'register'"
      @success="handleRegisterSuccess"
      @switch-to-login="currentView = 'login'"
    />
    
    <ForgotPasswordForm 
      v-else-if="currentView === 'forgot'"
      @success="handleForgotSuccess"
      @back-to-login="currentView = 'login'"
    />
    
    <OTPVerificationForm 
      v-else-if="currentView === 'otp'"
      @success="handleOTPSuccess"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentView: 'login'
    }
  },
  methods: {
    handleAuthSuccess() {
      this.$router.push('/dashboard')
    },
    handleRegisterSuccess() {
      this.currentView = 'otp'
    },
    handleForgotSuccess() {
      this.currentView = 'login'
    },
    handleOTPSuccess() {
      this.$router.push('/dashboard')
    }
  }
}
</script>
```

### Custom Styling

```vue
<template>
  <LoginForm class="custom-login-form" />
</template>

<style scoped>
.custom-login-form {
  --primary-color: #your-brand-color;
  --border-radius-md: 16px;
}

.custom-login-form :deep(.auth-card) {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
</style>
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- All contributors who help improve this SDK
- The open-source community for inspiration and feedback
