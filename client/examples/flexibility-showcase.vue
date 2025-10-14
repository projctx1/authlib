<template>
  <div class="showcase-app">
    <header class="showcase-header">
      <h1>🎨 Vue Auth SDK - Flexibility Showcase</h1>
      <p>Demonstrating the power of the enhanced, flexible authentication system</p>
    </header>

    <div class="showcase-nav">
      <button
        v-for="example in examples"
        :key="example.id"
        @click="currentExample = example.id"
        :class="{ active: currentExample === example.id }"
        class="nav-btn"
      >
        {{ example.title }}
      </button>
    </div>

    <main class="showcase-content">
      <!-- Example 1: Basic Usage -->
      <div v-if="currentExample === 'basic'" class="example-section">
        <h2>📧 Basic Email-Only Login (Your Use Case)</h2>
        <p>Simple, clean email-only authentication with custom styling</p>

        <div class="demo-container">
          <div class="custom-login-demo">
            <EmailInput
              v-model="basicDemo.email"
              :unstyled="true"
              placeholder="you@example.com"
              :validate-on-blur="true"
              @validate="handleBasicValidation"
            >
              <template #error="{ error }">
                <p v-if="error" class="custom-error">⚠️ {{ error }}</p>
              </template>
            </EmailInput>

            <button
              @click="handleBasicLogin"
              :disabled="!basicDemo.isValid || basicDemo.isLoading"
              class="custom-submit-btn"
            >
              {{ basicDemo.isLoading ? 'Signing in...' : 'Continue with Email' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Example 2: Custom Theme -->
      <div v-if="currentExample === 'theme'" class="example-section">
        <h2>🎨 Runtime Theme Switching</h2>
        <p>Change themes without rebuilding the application</p>

        <div class="theme-controls">
          <button @click="applyTheme('default')" class="theme-btn">Default</button>
          <button @click="applyTheme('dark')" class="theme-btn">Dark</button>
          <button @click="applyTheme('highContrast')" class="theme-btn">High Contrast</button>
          <button @click="applyTheme('custom')" class="theme-btn">Custom</button>
        </div>

        <div class="demo-container">
          <div class="themed-demo" data-auth-theme="custom">
            <AuthCard title="Themed Login" subtitle="With custom colors">
              <EmailInput v-model="themeDemo.email" />
              <PasswordInput v-model="themeDemo.password" />
              <SubmitButton :is-loading="themeDemo.isLoading" full-width>
                Sign In
              </SubmitButton>
            </AuthCard>
          </div>
        </div>
      </div>

      <!-- Example 3: Slot Customization -->
      <div v-if="currentExample === 'slots'" class="example-section">
        <h2>🎯 Advanced Slot Customization</h2>
        <p>Customize every aspect of the UI while keeping the logic</p>

        <div class="demo-container">
          <AuthCard :show-logo="false">
            <template #header>
              <div class="brand-header">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMzQjgyRjYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMiAyTDIgMTJMMTIgMjJMIDIyIDEyTDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+" alt="Logo" class="brand-logo" />
                <h2>Acme Corp</h2>
                <p>Enterprise Authentication</p>
              </div>
            </template>

            <EmailInput v-model="slotDemo.email">
              <template #icon>
                <span class="custom-icon">📧</span>
              </template>
              <template #suffix="{ hasValue }">
                <span v-if="hasValue" class="check-icon">✓</span>
              </template>
            </EmailInput>

            <PasswordInput v-model="slotDemo.password">
              <template #icon>
                <span class="custom-icon">🔒</span>
              </template>
            </PasswordInput>

            <SubmitButton full-width>
              <template #icon>
                <span>🚀</span>
              </template>
              Launch App
            </SubmitButton>

            <template #footer>
              <div class="custom-footer">
                <p>🔒 Secured by Vue Auth SDK</p>
                <div class="footer-links">
                  <a href="#">Privacy</a>
                  <a href="#">Terms</a>
                  <a href="#">Support</a>
                </div>
              </div>
            </template>
          </AuthCard>
        </div>
      </div>

      <!-- Example 4: Headless Usage -->
      <div v-if="currentExample === 'headless'" class="example-section">
        <h2>👻 Headless Mode (Complete Control)</h2>
        <p>Use SDK logic without any default styling</p>

        <div class="demo-container">
          <div class="headless-demo">
            <div class="form-field">
              <label class="headless-label">Email Address</label>
              <EmailInput
                v-model="headlessDemo.email"
                :unstyled="true"
                input-class="headless-input"
              >
                <template #input="{ inputId, value, updateValue, handleBlur, handleFocus }">
                  <div class="input-wrapper">
                    <input
                      :id="inputId"
                      :value="value"
                      @input="updateValue($event.target.value)"
                      @blur="handleBlur"
                      @focus="handleFocus"
                      type="email"
                      class="headless-input"
                      placeholder="Enter your email..."
                    />
                    <div class="input-underline"></div>
                  </div>
                </template>
              </EmailInput>
            </div>

            <div class="form-field">
              <label class="headless-label">Password</label>
              <PasswordInput
                v-model="headlessDemo.password"
                :unstyled="true"
                input-class="headless-input"
              >
                <template #input="{ inputId, value, updateValue, handleBlur, handleFocus }">
                  <div class="input-wrapper">
                    <input
                      :id="inputId"
                      :value="value"
                      @input="updateValue($event.target.value)"
                      @blur="handleBlur"
                      @focus="handleFocus"
                      type="password"
                      class="headless-input"
                      placeholder="Enter your password..."
                    />
                    <div class="input-underline"></div>
                  </div>
                </template>
              </PasswordInput>
            </div>

            <button @click="handleHeadlessLogin" class="headless-button">
              Sign In
            </button>
          </div>
        </div>
      </div>

      <!-- Example 5: Composables Only -->
      <div v-if="currentExample === 'composables'" class="example-section">
        <h2>🧩 Composables Only (Logic Reuse)</h2>
        <p>Use authentication logic without any UI components</p>

        <div class="demo-container">
          <div class="composables-demo">
            <div class="stats-grid">
              <div class="stat-card">
                <h4>Authentication State</h4>
                <p>{{ auth.isAuthenticated.value ? '✅ Authenticated' : '❌ Not authenticated' }}</p>
              </div>
              <div class="stat-card">
                <h4>Current User</h4>
                <p>{{ auth.currentUser.value?.email || 'No user' }}</p>
              </div>
              <div class="stat-card">
                <h4>Loading State</h4>
                <p>{{ auth.isLoading.value ? '⏳ Loading...' : '✅ Ready' }}</p>
              </div>
            </div>

            <div class="controls">
              <button @click="testLogin" :disabled="auth.isLoading.value" class="control-btn">
                Test Login
              </button>
              <button @click="testLogout" :disabled="auth.isLoading.value" class="control-btn">
                Test Logout
              </button>
              <button @click="testError" class="control-btn">
                Test Error
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

// Import enhanced components
import { EmailInput, PasswordInput, SubmitButton, AuthCard } from '../src/index.js'

// Import composables
import { useAuth, useTheme, useFormValidation } from '../src/index.js'

export default {
  name: 'FlexibilityShowcase',
  components: {
    EmailInput,
    PasswordInput,
    SubmitButton,
    AuthCard
  },

  setup() {
    const store = useStore()
    const router = useRouter()
    const currentExample = ref('basic')

    // Get composables
    const auth = useAuth()
    const theme = useTheme()

    // Demo data
    const basicDemo = reactive({
      email: '',
      isValid: false,
      isLoading: false
    })

    const themeDemo = reactive({
      email: '',
      password: '',
      isLoading: false
    })

    const slotDemo = reactive({
      email: '',
      password: ''
    })

    const headlessDemo = reactive({
      email: '',
      password: ''
    })

    // Examples configuration
    const examples = [
      { id: 'basic', title: '📧 Basic Usage' },
      { id: 'theme', title: '🎨 Runtime Themes' },
      { id: 'slots', title: '🎯 Slot Customization' },
      { id: 'headless', title: '👻 Headless Mode' },
      { id: 'composables', title: '🧩 Composables Only' }
    ]

    // Methods
    const handleBasicValidation = ({ valid }) => {
      basicDemo.isValid = valid
    }

    const handleBasicLogin = async () => {
      if (!basicDemo.isValid) return

      basicDemo.isLoading = true

      try {
        await auth.login({ email: basicDemo.email, password: 'demo123' })
        console.log('✅ Basic login successful!')
      } catch (error) {
        console.error('❌ Basic login failed:', error)
      } finally {
        basicDemo.isLoading = false
      }
    }

    const applyTheme = (themeName) => {
      theme.applyTheme(themeName)
    }

    const handleHeadlessLogin = async () => {
      try {
        await auth.login({
          email: headlessDemo.email,
          password: headlessDemo.password
        })
        console.log('✅ Headless login successful!')
      } catch (error) {
        console.error('❌ Headless login failed:', error)
      }
    }

    const testLogin = async () => {
      try {
        await auth.login({ email: 'test@example.com', password: 'password123' })
      } catch (error) {
        // Expected to fail with demo credentials
      }
    }

    const testLogout = async () => {
      try {
        await auth.logout()
      } catch (error) {
        console.error('Logout error:', error)
      }
    }

    const testError = () => {
      auth.clearError()
    }

    // Initialize with custom theme
    onMounted(() => {
      theme.applyTheme('default')
    })

    return {
      currentExample,
      examples,
      basicDemo,
      themeDemo,
      slotDemo,
      headlessDemo,
      auth,
      theme,
      handleBasicValidation,
      handleBasicLogin,
      applyTheme,
      handleHeadlessLogin,
      testLogin,
      testLogout,
      testError
    }
  }
}
</script>

<style scoped>
.showcase-app {
  min-height: 100vh;
  background: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.showcase-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
}

.showcase-header h1 {
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
  font-weight: 800;
}

.showcase-header p {
  margin: 0;
  font-size: 1.2rem;
  opacity: 0.9;
}

.showcase-nav {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.nav-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.nav-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.nav-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.showcase-content {
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.example-section {
  margin-bottom: 3rem;
}

.example-section h2 {
  color: #1e293b;
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

.example-section p {
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.demo-container {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.custom-login-demo {
  max-width: 400px;
  margin: 0 auto;
}

/* Custom styling for basic demo */
.custom-error {
  background: #fef2f2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  border: 1px solid #fecaca;
}

.custom-submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
}

.custom-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.custom-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Theme controls */
.theme-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.theme-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.theme-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

/* Themed demo */
.themed-demo {
  max-width: 400px;
  margin: 0 auto;
}

/* Brand header */
.brand-header {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-logo {
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
  border-radius: 50%;
}

.brand-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.brand-header p {
  color: #64748b;
}

/* Custom icons */
.custom-icon {
  font-size: 1.25rem;
}

.check-icon {
  color: #10b981;
  font-weight: bold;
}

/* Custom footer */
.custom-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.custom-footer p {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.footer-links a {
  color: #667eea;
  text-decoration: none;
  font-size: 0.875rem;
}

.footer-links a:hover {
  text-decoration: underline;
}

/* Headless demo */
.headless-demo {
  max-width: 400px;
  margin: 0 auto;
}

.form-field {
  margin-bottom: 1.5rem;
}

.headless-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #1e293b;
}

.input-wrapper {
  position: relative;
}

.headless-input {
  width: 100%;
  padding: 1rem 0;
  background: transparent;
  border: none;
  border-bottom: 2px solid #e2e8f0;
  font-size: 1rem;
  color: #1e293b;
  transition: border-color 0.3s;
}

.headless-input:focus {
  outline: none;
  border-bottom-color: #667eea;
}

.input-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.headless-input:focus + .input-underline {
  width: 100%;
}

.headless-button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.headless-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

/* Composables demo */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  padding: 1.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  text-align: center;
}

.stat-card h4 {
  margin: 0 0 0.5rem 0;
  color: #1e293b;
  font-size: 1rem;
}

.stat-card p {
  margin: 0;
  color: #64748b;
  font-weight: 500;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.control-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.control-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .showcase-header {
    padding: 2rem 1rem;
  }

  .showcase-header h1 {
    font-size: 2rem;
  }

  .showcase-nav {
    padding: 1rem;
  }

  .showcase-content {
    padding: 2rem 1rem;
  }

  .theme-controls {
    gap: 0.5rem;
  }

  .theme-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .controls {
    flex-direction: column;
  }
}
</style>