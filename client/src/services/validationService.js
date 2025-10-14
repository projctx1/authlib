/**
 * Centralized Validation Service
 * Provides consistent validation across all components
 */

import { isValidEmail, getEmailError, validatePassword, isValidOTP } from '../utils/validators.js'

class ValidationService {
  constructor() {
    this.rules = new Map()
    this.errors = new Map()
    this.setupDefaultRules()
  }

  // Setup default validation rules
  setupDefaultRules() {
    // Email validation
    this.registerRule('email', (value) => {
      if (!value || !value.trim()) return false
      return isValidEmail(value.trim())
    }, (value) => getEmailError(value) || 'Please enter a valid email address')

    // Required field
    this.registerRule('required', (value) => {
      return !!(value && value.trim())
    }, 'This field is required')

    // Minimum length
    this.registerRule('minLength', (min) => (value) => {
      return !value || value.length >= min
    }, (min) => `Minimum ${min} characters required`)

    // Maximum length
    this.registerRule('maxLength', (max) => (value) => {
      return !value || value.length <= max
    }, (max) => `Maximum ${max} characters allowed`)

    // Password validation
    this.registerRule('password', (value) => {
      if (!value) return false
      const errors = validatePassword(value)
      return errors.length === 0
    }, (value) => {
      const errors = validatePassword(value)
      return errors[0] || 'Password is not strong enough'
    })

    // OTP validation
    this.registerRule('otp', (length = 6) => (value) => {
      return isValidOTP(value, length)
    }, (length = 6) => `Please enter a valid ${length}-digit code`)

    // Phone validation
    this.registerRule('phone', (value) => {
      if (!value) return true // Phone is optional by default
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
      return phoneRegex.test(value)
    }, 'Please enter a valid phone number')
  }

  // Register validation rule
  registerRule(name, validator, message) {
    this.rules.set(name, { validator, message })
  }

  // Validate field
  async validateField(fieldName, value, rules = []) {
    const errors = []

    for (const rule of rules) {
      const ruleConfig = typeof rule === 'string'
        ? this.rules.get(rule)
        : rule

      if (!ruleConfig) continue

      const isValid = typeof ruleConfig.validator === 'function'
        ? await ruleConfig.validator(value)
        : ruleConfig.validator.test(value)

      if (!isValid) {
        const message = typeof ruleConfig.message === 'function'
          ? ruleConfig.message(value)
          : ruleConfig.message
        errors.push(message)
      }
    }

    if (errors.length > 0) {
      this.errors.set(fieldName, errors[0])
      return { valid: false, error: errors[0] }
    }

    this.errors.delete(fieldName)
    return { valid: true, error: null }
  }

  // Get field error
  getError(fieldName) {
    return this.errors.get(fieldName) || null
  }

  // Clear all errors
  clearErrors() {
    this.errors.clear()
  }

  // Clear specific field error
  clearField(fieldName) {
    this.errors.delete(fieldName)
  }

  // Check if form is valid
  isFormValid(fieldNames) {
    for (const fieldName of fieldNames) {
      if (this.errors.has(fieldName)) {
        return false
      }
    }
    return true
  }
}

// Create singleton instance
export const validationService = new ValidationService()