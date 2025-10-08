// Password strength calculation
export const getPasswordStrength = (password) => {
  if (!password) {
    return { score: 0, label: 'Enter password', color: '#9ca3af' }
  }
  
  let score = 0
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[^A-Za-z0-9]/.test(password),
    longLength: password.length >= 12
  }
  
  // Calculate score
  Object.values(checks).forEach(check => {
    if (check) score++
  })
  
  // Determine strength level
  if (score <= 2) {
    return { score, label: 'Weak', color: '#ef4444' }
  } else if (score <= 4) {
    return { score, label: 'Medium', color: '#f59e0b' }
  } else {
    return { score, label: 'Strong', color: '#10b981' }
  }
}

// Common email domains and their correct formats
const validDomains = [
  // Gmail
  'gmail.com',
  // Outlook/Hotmail
  'outlook.com', 'hotmail.com', 'live.com',
  // Yahoo
  'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de',
  // Apple
  'icloud.com', 'me.com', 'mac.com',
  // Other major providers
  'aol.com', 'protonmail.com', 'proton.me',  'tutanota.com'
]

// Valid TLDs for business/personal domains
const validTLDs = [
  'com', 'org', 'net', 'edu', 'gov', 'mil', 'int',
  'co.uk', 'co.za', 'co.au', 'co.nz', 'co.jp',
  'uk', 'de', 'fr', 'it', 'es', 'nl', 'be', 'ch', 'at',
  'ca', 'au', 'nz', 'jp', 'kr', 'cn', 'in', 'br', 'mx',
  'ru', 'pl', 'se', 'no', 'dk', 'fi', 'ie', 'pt', 'gr',
  'info', 'biz', 'name', 'mobi', 'tel', 'travel', 'jobs'
]

// Email validation with domain checking
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return false
  
  // Extract domain
  const domain = email.toLowerCase().split('@')[1]
  if (!domain) return false
  
  // Check for common typos in popular domains
  const commonTypos = {
    'gmail.co': 'gmail.com',
    'gmail.con': 'gmail.com', 
    'gmail.sss': 'gmail.com',
    'gmail.xxx': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'outlook.co': 'outlook.com',
    'hotmail.co': 'hotmail.com',
    'yahoo.co': 'yahoo.com',
    'icloud.co': 'icloud.com'
  }
  
  // If it's a known typo, it's invalid
  if (commonTypos[domain]) {
    return false
  }
  
  // Check if it's a known email provider domain
  const isKnownProvider = validDomains.includes(domain)
  
  if (isKnownProvider) {
    return true
  }
  
  // For other domains, check if they have valid TLD
  const domainParts = domain.split('.')
  if (domainParts.length < 2) return false
  
  // Get the TLD (last part) or compound TLD (last two parts for things like co.uk)
  const lastPart = domainParts[domainParts.length - 1]
  const secondLastPart = domainParts.length > 2 ? domainParts[domainParts.length - 2] : ''
  const compoundTLD = secondLastPart ? `${secondLastPart}.${lastPart}` : lastPart
  
  // Check if TLD is valid
  const hasValidTLD = validTLDs.includes(lastPart) || validTLDs.includes(compoundTLD)
  
  if (!hasValidTLD) {
    return false
  }
  
  // Additional checks for non-provider domains
  // No consecutive dots or invalid characters
  if (domain.includes('..') || /[^a-z0-9.-]/.test(domain)) return false
  
  // Domain name part (before TLD) must be at least 2 characters
  const domainName = domainParts[0]
  if (domainName.length < 2) return false
  
  return true
}

// Get email validation error message
export const getEmailError = (email) => {
  if (!email || !email.trim()) return 'Email is required'
  
  const domain = email.toLowerCase().split('@')[1]
  
  const commonTypos = {
    'gmail.co': 'Did you mean gmail.com?',
    'gmail.con': 'Did you mean gmail.com?',
    'gmail.sss': 'Did you mean gmail.com?',
    'gmail.xxx': 'Did you mean gmail.com?',
    'gmai.com': 'Did you mean gmail.com?',
    'gmial.com': 'Did you mean gmail.com?',
    'outlook.co': 'Did you mean outlook.com?',
    'hotmail.co': 'Did you mean hotmail.com?',
    'yahoo.co': 'Did you mean yahoo.com?',
    'icloud.co': 'Did you mean icloud.com?'
  }
  
  if (domain && commonTypos[domain]) {
    return commonTypos[domain]
  }
  
  // Check for Gmail-like domains with invalid TLDs
  if (domain && domain.startsWith('gmail.') && domain !== 'gmail.com') {
    return 'Did you mean gmail.com?'
  }
  
  // Check for other provider-like domains with invalid TLDs
  if (domain && domain.startsWith('outlook.') && domain !== 'outlook.com') {
    return 'Did you mean outlook.com?'
  }
  
  if (domain && domain.startsWith('yahoo.') && !domain.match(/^yahoo\.(com|co\.uk|fr|de)$/)) {
    return 'Did you mean yahoo.com?'
  }
  
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address'
  }
  
  return null
}

// Phone validation
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
  return phoneRegex.test(phone)
}

// Password validation rules
export const passwordRules = {
  minLength: 8,
  requireLowercase: true,
  requireUppercase: true,
  requireNumbers: true,
  requireSymbols: false
}

export const validatePassword = (password, rules = passwordRules) => {
  const errors = []
  
  if (password.length < rules.minLength) {
    errors.push(`Password must be at least ${rules.minLength} characters`)
  }
  
  if (rules.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letters')
  }
  
  if (rules.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letters')
  }
  
  if (rules.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain numbers')
  }
  
  if (rules.requireSymbols && !/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain special characters')
  }
  
  return errors
}

// Form validation helpers
export const validateField = (value, rules) => {
  if (!rules || rules.length === 0) return null
  
  for (const rule of rules) {
    if (rule === 'required' && (!value || value.trim() === '')) {
      return 'This field is required'
    }
    
    if (rule === 'email' && value && !isValidEmail(value)) {
      return 'Please enter a valid email address'
    }
    
    if (rule === 'phone' && value && !isValidPhone(value)) {
      return 'Please enter a valid phone number'
    }
    
    if (typeof rule === 'object') {
      if (rule.minLength && value && value.length < rule.minLength) {
        return `Minimum ${rule.minLength} characters required`
      }
      
      if (rule.maxLength && value && value.length > rule.maxLength) {
        return `Maximum ${rule.maxLength} characters allowed`
      }
      
      if (rule.pattern && value && !rule.pattern.test(value)) {
        return rule.message || 'Invalid format'
      }
      
      if (rule.custom && typeof rule.custom === 'function') {
        const result = rule.custom(value)
        if (result !== true) {
          return result || 'Invalid value'
        }
      }
    }
  }
  
  return null
}

// OTP validation
export const isValidOTP = (otp, length = 6) => {
  return otp && otp.length === length && /^\d+$/.test(otp)
}

// Name validation
export const isValidName = (name) => {
  return name && name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim())
}

// URL validation
export const isValidURL = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
