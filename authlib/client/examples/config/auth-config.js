/**
 * Vue Auth SDK Configuration
 * 
 * This file shows how to configure the SDK for different environments
 * and customize its behavior to match your application needs.
 */

// Development Configuration
export const developmentConfig = {
  // API Configuration
  api: {
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
    endpoints: {
      login: '/auth/login',
      register: '/auth/register',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
      sendOTP: '/auth/send-otp',
      verifyOTP: '/auth/verify-otp',
      refreshToken: '/auth/refresh',
      logout: '/auth/logout'
    }
  },
  
  // Validation Rules
  validation: {
    email: {
      // Allow only specific domains (optional)
      allowedDomains: [], // Empty = allow all
      // Block disposable email providers
      blockDisposable: false,
      // Custom validation message
      customMessage: 'Please enter a valid email address'
    },
    password: {
      minLength: 6, // Minimum password length
      requireUppercase: false,
      requireLowercase: false,
      requireNumbers: false,
      requireSymbols: false,
      customMessage: 'Password must be at least 6 characters'
    }
  },
  
  // OTP Configuration
  otp: {
    length: 6, // Number of digits
    expiryMinutes: 5, // How long OTP is valid
    resendCooldown: 60, // Seconds before allowing resend
    maxAttempts: 3, // Max verification attempts
    autoSubmit: true // Auto-submit when all digits entered
  },
  
  // UI Configuration
  ui: {
    theme: 'light', // 'light' | 'dark' | 'auto'
    showSocialLogin: true,
    socialProviders: ['google', 'github'],
    showRememberMe: true,
    showForgotPassword: true,
    enableOTPLogin: true,
    animations: true,
    autoFocus: true
  },
  
  // Security Settings
  security: {
    enableCSRF: false, // Disable for development
    sessionTimeout: 3600, // 1 hour
    maxLoginAttempts: 10, // More lenient for dev
    lockoutDuration: 300, // 5 minutes
    enableBruteForceProtection: false
  },
  
  // Development Features
  debug: {
    enableLogs: true,
    showStateInConsole: true,
    mockAPI: true, // Use mock responses
    autoFillForms: true // Pre-fill forms for testing
  }
}

// Production Configuration
export const productionConfig = {
  api: {
    baseURL: 'https://api.yourapp.com',
    timeout: 15000,
    endpoints: {
      login: '/v1/auth/login',
      register: '/v1/auth/register',
      forgotPassword: '/v1/auth/forgot-password',
      resetPassword: '/v1/auth/reset-password',
      sendOTP: '/v1/auth/send-otp',
      verifyOTP: '/v1/auth/verify-otp',
      refreshToken: '/v1/auth/refresh',
      logout: '/v1/auth/logout'
    }
  },
  
  validation: {
    email: {
      allowedDomains: ['company.com', 'subsidiary.com'], // Company emails only
      blockDisposable: true,
      customMessage: 'Please use your company email address'
    },
    password: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: true,
      customMessage: 'Password must be at least 12 characters with mixed case, numbers, and symbols'
    }
  },
  
  otp: {
    length: 6,
    expiryMinutes: 3, // Shorter for security
    resendCooldown: 120, // Longer cooldown
    maxAttempts: 3,
    autoSubmit: false // Manual submission for security
  },
  
  ui: {
    theme: 'auto',
    showSocialLogin: false, // Disable for enterprise
    socialProviders: [],
    showRememberMe: false, // Disable for security
    showForgotPassword: true,
    enableOTPLogin: true,
    animations: true,
    autoFocus: true
  },
  
  security: {
    enableCSRF: true,
    sessionTimeout: 1800, // 30 minutes
    maxLoginAttempts: 3,
    lockoutDuration: 1800, // 30 minutes
    enableBruteForceProtection: true
  },
  
  debug: {
    enableLogs: false,
    showStateInConsole: false,
    mockAPI: false,
    autoFillForms: false
  }
}

// Custom Theme Configuration
export const customTheme = {
  colors: {
    // Primary brand colors
    primary: '#6366f1',      // Indigo
    primaryHover: '#4f46e5',
    primaryLight: '#e0e7ff',
    
    // Secondary colors
    secondary: '#8b5cf6',    // Purple
    secondaryHover: '#7c3aed',
    secondaryLight: '#ede9fe',
    
    // Status colors
    success: '#10b981',      // Emerald
    successLight: '#d1fae5',
    error: '#ef4444',        // Red
    errorLight: '#fee2e2',
    warning: '#f59e0b',      // Amber
    warningLight: '#fef3c7',
    info: '#3b82f6',         // Blue
    infoLight: '#dbeafe',
    
    // Neutral colors
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827'
  },
  
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem'     // 64px
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px'
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'monospace']
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  }
}

// Environment-specific configuration
export const getConfig = () => {
  const env = process.env.NODE_ENV || 'development'
  
  switch (env) {
    case 'production':
      return productionConfig
    case 'development':
    default:
      return developmentConfig
  }
}

// Custom validation rules
export const customValidators = {
  // Company email validator
  companyEmail: (email) => {
    const companyDomains = ['company.com', 'subsidiary.com']
    const domain = email.split('@')[1]
    return companyDomains.includes(domain) || 'Please use your company email address'
  },
  
  // Strong password validator
  strongPassword: (password) => {
    const checks = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    
    const failed = Object.entries(checks)
      .filter(([_, passed]) => !passed)
      .map(([check]) => check)
    
    if (failed.length === 0) return true
    
    const messages = {
      length: 'at least 12 characters',
      uppercase: 'an uppercase letter',
      lowercase: 'a lowercase letter',
      number: 'a number',
      symbol: 'a special character'
    }
    
    return `Password must contain ${failed.map(f => messages[f]).join(', ')}`
  },
  
  // Phone number validator
  phoneNumber: (phone) => {
    const phoneRegex = /^[+]?[(]?[\d\s\-()]{10,}$/
    return phoneRegex.test(phone) || 'Please enter a valid phone number'
  }
}

// Social login configuration
export const socialConfig = {
  google: {
    clientId: process.env.VUE_APP_GOOGLE_CLIENT_ID,
    scope: 'email profile',
    buttonText: 'Continue with Google',
    buttonStyle: 'light' // 'light' | 'dark'
  },
  
  github: {
    clientId: process.env.VUE_APP_GITHUB_CLIENT_ID,
    scope: 'user:email',
    buttonText: 'Continue with GitHub',
    buttonStyle: 'dark'
  },
  
  facebook: {
    appId: process.env.VUE_APP_FACEBOOK_APP_ID,
    scope: 'email',
    buttonText: 'Continue with Facebook',
    buttonStyle: 'blue'
  }
}

// Analytics configuration
export const analyticsConfig = {
  // Google Analytics
  googleAnalytics: {
    measurementId: process.env.VUE_APP_GA_MEASUREMENT_ID,
    events: {
      login: 'user_login',
      register: 'user_register',
      logout: 'user_logout',
      otpSent: 'otp_sent',
      otpVerified: 'otp_verified'
    }
  },
  
  // Custom analytics
  customAnalytics: {
    apiEndpoint: '/api/analytics/track',
    enableUserTracking: true,
    enableErrorTracking: true,
    enablePerformanceTracking: false
  }
}

// Error messages configuration
export const errorMessages = {
  network: 'Network error. Please check your connection and try again.',
  timeout: 'Request timed out. Please try again.',
  unauthorized: 'Invalid credentials. Please check your email and password.',
  forbidden: 'Access denied. Please contact support if this persists.',
  notFound: 'Service not found. Please try again later.',
  serverError: 'Server error. Please try again later.',
  validationError: 'Please check your input and try again.',
  otpExpired: 'Verification code has expired. Please request a new one.',
  otpInvalid: 'Invalid verification code. Please try again.',
  accountLocked: 'Account temporarily locked due to multiple failed attempts.',
  emailExists: 'An account with this email already exists.',
  weakPassword: 'Password is too weak. Please choose a stronger password.'
}

// Default export with current environment config
export default getConfig()
