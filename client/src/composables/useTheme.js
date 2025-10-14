import { ref, computed } from 'vue'

/**
 * Theme management composable for Vue Auth SDK
 * Provides runtime theme switching and CSS variable management
 */
export function useTheme() {
  const currentTheme = ref('default')
  const availableThemes = ref({
    default: {
      name: 'Default',
      colors: {
        primary: '#3b82f6',
        primaryHover: '#2563eb',
        primaryActive: '#1d4ed8',
        primaryLight: '#dbeafe',

        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',

        textPrimary: '#111827',
        textSecondary: '#6b7280',
        textTertiary: '#9ca3af',

        bgPrimary: '#ffffff',
        bgSecondary: '#f9fafb',
        bgTertiary: '#f3f4f6',
        bgDisabled: '#f3f4f6',

        border: '#e5e7eb',
        borderHover: '#d1d5db'
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        full: '9999px'
      }
    },

    dark: {
      name: 'Dark',
      colors: {
        primary: '#60a5fa',
        primaryHover: '#3b82f6',
        primaryActive: '#2563eb',
        primaryLight: '#1e40af',

        success: '#34d399',
        error: '#f87171',
        warning: '#fbbf24',
        info: '#60a5fa',

        textPrimary: '#f9fafb',
        textSecondary: '#d1d5db',
        textTertiary: '#9ca3af',

        bgPrimary: '#1f2937',
        bgSecondary: '#111827',
        bgTertiary: '#374151',
        bgDisabled: '#374151',

        border: '#374151',
        borderHover: '#4b5563'
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        full: '9999px'
      }
    },

    highContrast: {
      name: 'High Contrast',
      colors: {
        primary: '#0000ff',
        primaryHover: '#0000cc',
        primaryActive: '#0000aa',
        primaryLight: '#ccccff',

        success: '#008000',
        error: '#ff0000',
        warning: '#ffaa00',
        info: '#0000ff',

        textPrimary: '#000000',
        textSecondary: '#333333',
        textTertiary: '#666666',

        bgPrimary: '#ffffff',
        bgSecondary: '#f0f0f0',
        bgTertiary: '#e0e0e0',
        bgDisabled: '#e0e0e0',

        border: '#000000',
        borderHover: '#333333'
      },
      spacing: {
        xs: '0.375rem',
        sm: '0.75rem',
        md: '1.5rem',
        lg: '2.25rem',
        xl: '3rem'
      },
      borderRadius: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px'
      }
    }
  })

  /**
   * Apply a theme by setting CSS custom properties
   */
  const applyTheme = (themeName) => {
    const theme = availableThemes.value[themeName]
    if (!theme) {
      console.warn(`Theme "${themeName}" not found`)
      return
    }

    const root = document.documentElement
    currentTheme.value = themeName

    // Apply colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--auth-${kebabCase(key)}`, value)
    })

    // Apply spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--auth-spacing-${key}`, value)
    })

    // Apply border radius
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--auth-border-radius-${key}`, value)
    })

    // Set theme attribute for CSS selectors
    root.setAttribute('data-auth-theme', themeName)

    console.log(`🎨 Applied theme: ${theme.name}`)
  }

  /**
   * Reset to default theme
   */
  const resetTheme = () => {
    applyTheme('default')
  }

  /**
   * Get current theme object
   */
  const getCurrentTheme = computed(() => {
    return availableThemes.value[currentTheme.value] || availableThemes.value.default
  })

  /**
   * Create a custom theme
   */
  const createTheme = (name, themeConfig) => {
    availableThemes.value[name] = {
      name: themeConfig.name || name,
      ...themeConfig
    }
  }

  /**
   * Update current theme with partial config
   */
  const updateTheme = (updates) => {
    const theme = availableThemes.value[currentTheme.value]
    if (theme) {
      Object.assign(theme, updates)
      applyTheme(currentTheme.value)
    }
  }

  /**
   * Get all available theme names
   */
  const getThemeNames = computed(() => {
    return Object.keys(availableThemes.value)
  })

  /**
   * Initialize theme from localStorage or default
   */
  const initTheme = () => {
    const savedTheme = localStorage.getItem('auth-theme') || 'default'
    applyTheme(savedTheme)
  }

  /**
   * Save current theme to localStorage
   */
  const saveTheme = () => {
    localStorage.setItem('auth-theme', currentTheme.value)
  }

  return {
    // State
    currentTheme: computed(() => currentTheme.value),
    availableThemes: computed(() => availableThemes.value),
    getCurrentTheme,

    // Methods
    applyTheme,
    resetTheme,
    createTheme,
    updateTheme,
    getThemeNames,
    initTheme,
    saveTheme
  }
}

/**
 * Helper function to convert camelCase to kebab-case
 */
function kebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}