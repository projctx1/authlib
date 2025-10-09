<template>
  <div class="component-showcase">
    <!-- Header -->
    <header class="showcase-header">
      <h1>🧩 Vue Auth SDK - Component Showcase</h1>
      <p>Interactive examples of all available components with usage instructions</p>
    </header>

    <!-- Navigation -->
    <nav class="component-nav">
      <button 
        v-for="section in sections" 
        :key="section.id"
        @click="activeSection = section.id"
        :class="{ active: activeSection === section.id }"
        class="nav-button"
      >
        {{ section.icon }} {{ section.name }}
      </button>
    </nav>

    <!-- Content -->
    <main class="showcase-content">
      <!-- Input Components -->
      <section v-if="activeSection === 'inputs'" class="component-section">
        <h2>📝 Input Components</h2>
        
        <!-- EmailInput -->
        <div class="component-demo">
          <h3>EmailInput</h3>
          <p>Smart email input with validation and typo detection</p>
          
          <div class="demo-container">
            <div class="demo-example">
              <EmailInput 
                v-model="demoData.email"
                label="Email Address"
                placeholder="Enter your email"
                :error="emailError"
                @blur="validateEmail"
              />
            </div>
            
            <div class="demo-code">
              <h4>Usage:</h4>
              <pre><code>&lt;EmailInput 
  v-model="email"
  label="Email Address"
  placeholder="Enter your email"
  :error="emailError"
  @blur="validateEmail"
/&gt;</code></pre>
            </div>
          </div>
          
          <div class="demo-features">
            <h4>Features:</h4>
            <ul>
              <li>✅ Built-in email validation</li>
              <li>✅ Typo detection (gmail.co → gmail.com)</li>
              <li>✅ Real-time error feedback</li>
              <li>✅ Accessible labels and ARIA</li>
            </ul>
          </div>
        </div>

        <!-- PasswordInput -->
        <div class="component-demo">
          <h3>PasswordInput</h3>
          <p>Secure password input with strength indicator and toggle visibility</p>
          
          <div class="demo-container">
            <div class="demo-example">
              <PasswordInput 
                v-model="demoData.password"
                label="Password"
                show-strength-indicator
                show-toggle
                :min-length="8"
              />
            </div>
            
            <div class="demo-code">
              <h4>Usage:</h4>
              <pre><code>&lt;PasswordInput 
  v-model="password"
  label="Password"
  show-strength-indicator
  show-toggle
  :min-length="8"
/&gt;</code></pre>
            </div>
          </div>
          
          <div class="demo-features">
            <h4>Features:</h4>
            <ul>
              <li>🔒 Show/hide password toggle</li>
              <li>📊 Real-time strength indicator</li>
              <li>🎯 Minimum length validation</li>
              <li>🎨 Custom strength colors</li>
            </ul>
          </div>
        </div>

        <!-- TextInput -->
        <div class="component-demo">
          <h3>TextInput</h3>
          <p>General purpose text input with validation</p>
          
          <div class="demo-container">
            <div class="demo-example">
              <TextInput 
                v-model="demoData.name"
                field-name="fullName"
                label="Full Name"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div class="demo-code">
              <h4>Usage:</h4>
              <pre><code>&lt;TextInput 
  v-model="name"
  field-name="fullName"
  label="Full Name"
  placeholder="Enter your full name"
  required
/&gt;</code></pre>
            </div>
          </div>
        </div>

        <!-- OTPInput -->
        <div class="component-demo">
          <h3>OTPInput</h3>
          <p>One-time password input with timer and resend functionality</p>
          
          <div class="demo-container">
            <div class="demo-example">
              <OTPInput 
                v-model="demoData.otp"
                :length="6"
                show-timer
                show-resend
                @complete="handleOTPComplete"
                @resend="handleOTPResend"
              />
            </div>
            
            <div class="demo-code">
              <h4>Usage:</h4>
              <pre><code>&lt;OTPInput 
  v-model="otp"
  :length="6"
  show-timer
  show-resend
  @complete="handleComplete"
  @resend="handleResend"
/&gt;</code></pre>
            </div>
          </div>
          
          <div class="demo-features">
            <h4>Features:</h4>
            <ul>
              <li>🔢 Auto-focus next digit</li>
              <li>⏱️ Countdown timer</li>
              <li>🔄 Resend with cooldown</li>
              <li>✨ Auto-submit on complete</li>
            </ul>
          </div>
        </div>

        <!-- CheckboxInput -->
        <div class="component-demo">
          <h3>CheckboxInput</h3>
          <p>Styled checkbox with custom content support</p>
          
          <div class="demo-container">
            <div class="demo-example">
              <CheckboxInput v-model="demoData.terms">
                I agree to the <a href="#" @click.prevent>Terms of Service</a>
              </CheckboxInput>
              
              <CheckboxInput v-model="demoData.newsletter">
                Subscribe to newsletter
              </CheckboxInput>
            </div>
            
            <div class="demo-code">
              <h4>Usage:</h4>
              <pre><code>&lt;CheckboxInput v-model="terms"&gt;
  I agree to the &lt;a href="/terms"&gt;Terms&lt;/a&gt;
&lt;/CheckboxInput&gt;</code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Form Components -->
      <section v-if="activeSection === 'forms'" class="component-section">
        <h2>📋 Complete Form Components</h2>
        
        <!-- LoginForm -->
        <div class="component-demo">
          <h3>LoginForm</h3>
          <p>Complete login form with email/password and OTP options</p>
          
          <div class="demo-container">
            <div class="demo-example">
              <div class="form-preview">
                <LoginForm 
                  @success="handleDemoSuccess"
                  @forgot-password="showMessage('Forgot password clicked')"
                  @otp-login="showMessage('OTP login initiated')"
                />
              </div>
            </div>
            
            <div class="demo-code">
              <h4>Usage:</h4>
              <pre><code>&lt;LoginForm 
  @success="handleLogin"
  @forgot-password="showForgot"
  @otp-login="handleOTP"
/&gt;</code></pre>
            </div>
          </div>
          
          <div class="demo-features">
            <h4>Features:</h4>
            <ul>
              <li>🔐 Email + Password login</li>
              <li>📱 OTP login option</li>
              <li>💾 Remember me checkbox</li>
              <li>🔗 Social login buttons</li>
              <li>🎨 Fully customizable styling</li>
            </ul>
          </div>
        </div>

        <!-- RegisterForm -->
        <div class="component-demo">
          <h3>RegisterForm</h3>
          <p>User registration with validation and confirmation</p>
          
          <div class="demo-container">
            <div class="demo-example">
              <div class="form-preview">
                <RegisterForm 
                  @success="handleDemoSuccess"
                  @switch-to-login="showMessage('Switch to login')"
                />
              </div>
            </div>
            
            <div class="demo-code">
              <h4>Usage:</h4>
              <pre><code>&lt;RegisterForm 
  @success="handleRegister"
  @switch-to-login="showLogin"
/&gt;</code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- UI Components -->
      <section v-if="activeSection === 'ui'" class="component-section">
        <h2>🎨 UI Components</h2>
        
        <!-- AuthCard -->
        <div class="component-demo">
          <h3>AuthCard</h3>
          <p>Container card for authentication forms</p>
          
          <div class="demo-container">
            <div class="demo-example">
              <AuthCard title="Custom Form" subtitle="Build your own authentication">
                <div class="custom-content">
                  <p>Your custom content goes here</p>
                  <button class="demo-button">Custom Button</button>
                </div>
              </AuthCard>
            </div>
            
            <div class="demo-code">
              <h4>Usage:</h4>
              <pre><code>&lt;AuthCard title="Custom Form" subtitle="Description"&gt;
  &lt;!-- Your content --&gt;
&lt;/AuthCard&gt;</code></pre>
            </div>
          </div>
        </div>

        <!-- AlertMessage -->
        <div class="component-demo">
          <h3>AlertMessage</h3>
          <p>Status messages for success, error, warning, and info</p>
          
          <div class="demo-container">
            <div class="demo-example">
              <div class="alert-examples">
                <AlertMessage type="success" message="Operation completed successfully!" />
                <AlertMessage type="error" message="Something went wrong. Please try again." />
                <AlertMessage type="warning" message="Please verify your email address." />
                <AlertMessage type="info" message="New features are available." />
              </div>
            </div>
            
            <div class="demo-code">
              <h4>Usage:</h4>
              <pre><code>&lt;AlertMessage 
  type="success" 
  message="Success message" 
/&gt;</code></pre>
            </div>
          </div>
        </div>

        <!-- SubmitButton -->
        <div class="component-demo">
          <h3>SubmitButton</h3>
          <p>Loading-aware submit button with states</p>
          
          <div class="demo-container">
            <div class="demo-example">
              <div class="button-examples">
                <SubmitButton>Normal Button</SubmitButton>
                <SubmitButton :is-loading="true">Loading Button</SubmitButton>
                <SubmitButton disabled>Disabled Button</SubmitButton>
                <SubmitButton full-width>Full Width Button</SubmitButton>
              </div>
            </div>
            
            <div class="demo-code">
              <h4>Usage:</h4>
              <pre><code>&lt;SubmitButton 
  :is-loading="loading"
  :disabled="!isValid"
  full-width
&gt;
  Submit
&lt;/SubmitButton&gt;</code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Integration Examples -->
      <section v-if="activeSection === 'integration'" class="component-section">
        <h2>🔧 Integration Examples</h2>
        
        <div class="integration-examples">
          <div class="example-card">
            <h3>🚀 Quick Start</h3>
            <p>Drop-in authentication with minimal setup</p>
            <pre><code>import { AuthView } from 'vue-auth-sdk'

// Use complete auth view
&lt;AuthView @success="handleAuth" /&gt;</code></pre>
          </div>
          
          <div class="example-card">
            <h3>🎨 Custom Styling</h3>
            <p>Override styles with CSS variables</p>
            <pre><code>/* Custom theme */
.my-auth {
  --primary-color: #your-brand;
  --border-radius-md: 12px;
}

.my-auth :deep(.auth-button) {
  background: linear-gradient(45deg, #a, #b);
}</code></pre>
          </div>
          
          <div class="example-card">
            <h3>🔧 Individual Components</h3>
            <p>Mix and match components</p>
            <pre><code>import { EmailInput, PasswordInput } from 'vue-auth-sdk'

&lt;form&gt;
  &lt;EmailInput v-model="email" /&gt;
  &lt;PasswordInput v-model="password" /&gt;
&lt;/form&gt;</code></pre>
          </div>
        </div>
      </section>
    </main>

    <!-- Demo Message -->
    <div v-if="message" class="demo-message" @click="message = ''">
      {{ message }}
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { 
  EmailInput, 
  PasswordInput, 
  TextInput, 
  OTPInput, 
  CheckboxInput,
  LoginForm,
  RegisterForm,
  AuthCard,
  AlertMessage,
  SubmitButton
} from '../src/index.js'
import { getEmailError } from '../src/utils/validators.js'

export default {
  name: 'ComponentShowcase',
  components: {
    EmailInput,
    PasswordInput, 
    TextInput,
    OTPInput,
    CheckboxInput,
    LoginForm,
    RegisterForm,
    AuthCard,
    AlertMessage,
    SubmitButton
  },
  
  setup() {
    const activeSection = ref('inputs')
    const message = ref('')
    
    const sections = [
      { id: 'inputs', name: 'Input Components', icon: '📝' },
      { id: 'forms', name: 'Form Components', icon: '📋' },
      { id: 'ui', name: 'UI Components', icon: '🎨' },
      { id: 'integration', name: 'Integration', icon: '🔧' }
    ]
    
    const demoData = ref({
      email: '',
      password: '',
      name: '',
      otp: '',
      terms: false,
      newsletter: false
    })
    
    const emailError = computed(() => {
      return demoData.value.email ? getEmailError(demoData.value.email) : ''
    })
    
    const validateEmail = () => {
      // Validation happens automatically via computed
    }
    
    const handleOTPComplete = (code) => {
      showMessage(`OTP completed: ${code}`)
    }
    
    const handleOTPResend = () => {
      showMessage('OTP resent!')
    }
    
    const handleDemoSuccess = () => {
      showMessage('Demo form submitted successfully!')
    }
    
    const showMessage = (msg) => {
      message.value = msg
      setTimeout(() => {
        message.value = ''
      }, 3000)
    }
    
    return {
      activeSection,
      sections,
      demoData,
      emailError,
      message,
      validateEmail,
      handleOTPComplete,
      handleOTPResend,
      handleDemoSuccess,
      showMessage
    }
  }
}
</script>

<style scoped>
.component-showcase {
  min-height: 100vh;
  background-color: var(--bg-secondary);
}

.showcase-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
}

.showcase-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.showcase-header p {
  font-size: 1.125rem;
  opacity: 0.9;
}

.component-nav {
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 2rem;
  display: flex;
  gap: 1rem;
  overflow-x: auto;
}

.nav-button {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.nav-button:hover,
.nav-button.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.showcase-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.component-section h2 {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 2rem;
  text-align: center;
}

.component-demo {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 3rem;
}

.component-demo h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.component-demo > p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.demo-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.demo-example {
  padding: 1.5rem;
  background-color: var(--bg-secondary);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
}

.demo-code {
  padding: 1.5rem;
  background-color: #1f2937;
  border-radius: 0.5rem;
  color: #e5e7eb;
}

.demo-code h4 {
  color: #f3f4f6;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.demo-code pre {
  margin: 0;
  font-family: 'Fira Code', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  overflow-x: auto;
}

.demo-features {
  background-color: var(--bg-secondary);
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.demo-features h4 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.demo-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.demo-features li {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
}

.form-preview {
  max-width: 400px;
}

.alert-examples {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.button-examples {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}

.integration-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.example-card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 2rem;
}

.example-card h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.example-card p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.example-card pre {
  background-color: #1f2937;
  color: #e5e7eb;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  overflow-x: auto;
}

.demo-message {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background-color: #10b981;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.custom-content {
  text-align: center;
  padding: 2rem;
}

.demo-button {
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .showcase-header {
    padding: 2rem 1rem;
  }
  
  .showcase-header h1 {
    font-size: 2rem;
  }
  
  .component-nav {
    padding: 1rem;
  }
  
  .showcase-content {
    padding: 1rem;
  }
  
  .demo-container {
    grid-template-columns: 1fr;
  }
  
  .integration-examples {
    grid-template-columns: 1fr;
  }
}
</style>
