# Getting Started with Vue Auth SDK

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
vue-auth-sdk/
├── src/
│   ├── components/          # Reusable Vue components
│   │   ├── buttons/         # Button components
│   │   ├── cards/           # Card components
│   │   ├── composites/      # Form compositions
│   │   ├── feedback/        # Feedback components
│   │   └── inputs/          # Input components
│   ├── store/              # Vuex store modules
│   │   └── modules/        # Individual store modules
│   ├── styles/             # SCSS styling system
│   │   └── components/     # Component-specific styles
│   ├── utils/              # Utility functions
│   ├── views/              # Page components
│   ├── router/             # Vue Router configuration
│   ├── App.vue             # Root component
│   ├── main.js             # Application entry point
│   └── index.js            # SDK export file
├── examples/               # Usage examples
├── package.json            # Project configuration
├── vite.config.js          # Vite configuration
└── README.md               # Documentation
```

## 🎯 Available Components

### Form Components
- `LoginForm` - Complete login form with validation
- `RegisterForm` - User registration form
- `ForgotPasswordForm` - Password reset form
- `OTPVerificationForm` - OTP verification form

### Input Components
- `EmailInput` - Email input with validation
- `PasswordInput` - Password input with strength indicator
- `TextInput` - Generic text input
- `CheckboxInput` - Checkbox input
- `OTPInput` - OTP code input

### Button Components
- `SubmitButton` - Form submit button with loading state
- `TextButton` - Text-style button
- `SocialLoginButtons` - Social media login buttons

### Card Components
- `AuthCard` - Authentication card wrapper

### Feedback Components
- `AlertMessage` - Alert/notification messages
- `LoadingSpinner` - Loading spinner

## 🎨 Theming

The SDK supports light and dark themes out of the box:

```javascript
// Toggle theme
this.$store.dispatch('ui/setTheme', 'dark')

// Get current theme
const isDark = this.$store.getters['ui/isDark']
```

### Custom Themes

Override CSS custom properties to create custom themes:

```css
[data-theme="custom"] {
  --primary-color: #your-color;
  --bg-primary: #your-background;
  --text-primary: #your-text-color;
}
```

## 🔧 Configuration

### API Endpoints

Configure your API endpoints in the store modules:

```javascript
// src/store/modules/auth.js
const API_BASE = 'https://your-api.com'

const endpoints = {
  login: `${API_BASE}/auth/login`,
  register: `${API_BASE}/auth/register`,
  // ... other endpoints
}
```

### Validation Rules

Customize validation rules in `src/utils/validators.js`:

```javascript
export const passwordRules = {
  minLength: 8,
  requireLowercase: true,
  requireUppercase: true,
  requireNumbers: true,
  requireSymbols: false
}
```

## 📱 Responsive Design

All components are mobile-first and responsive:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🔒 Security Features

- JWT token management
- Automatic token refresh
- Secure password validation
- XSS protection
- CSRF protection ready

## 🧪 Testing

Run the development server to test all components:

```bash
npm run dev
```

Navigate through the authentication flow:
1. Login form with validation
2. Registration with password strength
3. Forgot password flow
4. OTP verification
5. Theme switching

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify/Vercel

1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Environment Variables

Create `.env` files for different environments:

```bash
# .env.development
VITE_API_URL=http://localhost:8000/api

# .env.production  
VITE_API_URL=https://your-api.com/api
```

## 📚 Usage Examples

### Basic Integration

```vue
<template>
  <div>
    <LoginForm @success="handleLogin" />
  </div>
</template>

<script>
import { LoginForm } from './src/index.js'

export default {
  components: { LoginForm },
  methods: {
    handleLogin(user) {
      console.log('User logged in:', user)
      this.$router.push('/dashboard')
    }
  }
}
</script>
```

### With Custom Styling

```vue
<template>
  <LoginForm class="custom-login" />
</template>

<style>
.custom-login {
  --primary-color: #your-brand-color;
}
</style>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Check the examples in `/examples/`
- Review component documentation in `/src/components/`
- Open an issue for bugs or feature requests

---

Happy coding! 🎉
