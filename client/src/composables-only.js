// Composables-only export file for smaller bundle size

// Composables
import { useTheme } from './composables/useTheme'
import { useAuth } from './composables/useAuth'
import { useFormValidation } from './composables/useFormValidation'

// Utilities
import * as validators from './utils/validators'

// Plugin installation function for composables only
const VueAuthComposables = {
  install(app, options = {}) {
    // Provide composables globally
    app.provide('useTheme', useTheme)
    app.provide('useAuth', useAuth)
    app.provide('useFormValidation', useFormValidation)

    console.log('🚀 Vue Auth Composables installed!')
  }
}

// Named exports
export {
  // Composables
  useTheme,
  useAuth,
  useFormValidation,

  // Utilities
  validators
}

// Default export (plugin)
export default VueAuthComposables