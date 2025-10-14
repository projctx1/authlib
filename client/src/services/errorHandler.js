/**
 * Centralized Error Handler
 * Provides consistent error handling across the application
 */

class ErrorHandler {
  constructor() {
    this.handlers = new Map()
    this.setupDefaultHandlers()
  }

  // Setup default error handlers
  setupDefaultHandlers() {
    // 401 Unauthorized
    this.registerHandler('http_401', (error) => ({
      message: 'Your session has expired. Please log in again.',
      type: 'warning',
      action: 'logout'
    }))

    // 422 Validation Error
    this.registerHandler('http_422', (error) => ({
      message: error.response?.data?.message || 'Validation failed',
      type: 'error',
      fields: error.response?.data?.errors
    }))

    // 429 Rate Limited
    this.registerHandler('http_429', (error) => ({
      message: 'Too many requests. Please try again later.',
      type: 'warning'
    }))

    // Network errors
    this.registerHandler('ECONNABORTED', () => ({
      message: 'Request timeout. Please check your connection.',
      type: 'error'
    }))

    this.registerHandler('NETWORK_ERROR', () => ({
      message: 'Network error. Please check your connection.',
      type: 'error'
    }))
  }

  // Register error handler for specific error types
  registerHandler(errorType, handler) {
    this.handlers.set(errorType, handler)
  }

  // Handle error with fallback
  handle(error, context = {}) {
    const errorType = this.getErrorType(error)
    const handler = this.handlers.get(errorType) || this.defaultHandler

    return handler(error, context)
  }

  // Determine error type
  getErrorType(error) {
    if (error.response) {
      return `http_${error.response.status}`
    }
    if (error.code) {
      return error.code
    }
    if (error.message) {
      return error.message.toUpperCase().replace(/\s+/g, '_')
    }
    return 'unknown'
  }

  // Default error handler
  defaultHandler(error, context) {
    console.error('[ErrorHandler]', error, context)

    return {
      message: error.message || 'An unexpected error occurred',
      type: 'error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }
  }

  // Handle auth errors specifically
  handleAuthError(error, store) {
    const errorInfo = this.handle(error)

    switch (errorInfo.action) {
      case 'logout':
        store.dispatch('auth/logout')
        break
      default:
        store.commit('auth/SET_ERROR', errorInfo.message)
    }

    return errorInfo
  }
}

export const errorHandler = new ErrorHandler()