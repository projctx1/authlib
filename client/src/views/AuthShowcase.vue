<template>
  <div class="auth-showcase">
    <header class="showcase-header">
      <h1>🔐 Vue Auth SDK - Authentication Showcase</h1>
      <p>Demonstrating flexible authentication flows with custom styling</p>
    </header>

    <nav class="showcase-nav">
      <button
        v-for="flow in authFlows"
        :key="flow.id"
        @click="currentFlow = flow.id"
        :class="{ active: currentFlow === flow.id }"
        class="nav-btn"
      >
        {{ flow.title }}
      </button>
    </nav>

    <main class="showcase-content">
       <!-- Style Comparison Demo -->
       <div v-if="currentFlow === 'style-demo'" class="flow-section">
         <h2>🎨 Style Comparison Demo</h2>
         <p>Demonstrating default vs custom styling capabilities</p>

         <div class="demo-container">
           <div class="comparison-grid">
             <div class="comparison-item">
               <h3>Default Styled Components</h3>
               <p>Using built-in component styles</p>

               <EmailInput
                 v-model="demoData.defaultEmail"
                 placeholder="Default email styling"
               />

               <PasswordInput
                 v-model="demoData.defaultPassword"
                 placeholder="Default password styling"
                 style="margin-top: 1rem;"
               />

               <SubmitButton
                 :disabled="!demoData.defaultEmail || !demoData.defaultPassword"
                 style="margin-top: 1rem;"
               >
                 Default Button Style
               </SubmitButton>
             </div>

             <div class="comparison-item">
               <h3>Custom Styled Components</h3>
               <p>Complete UI customization with unstyled mode</p>

               <EmailInput
                 v-model="demoData.customEmail"
                 :unstyled="true"
                 placeholder="Custom email styling"
               >
                 <template #label="{ label, required }">
                   <label class="custom-label">Email Address<span v-if="required" class="required">*</span></label>
                 </template>

                 <template #input="{ inputId, value, updateValue, handleBlur, handleFocus }">
                   <div class="input-wrapper">
                     <div class="input-icon">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="2"/>
                         <path d="M3 5L12 13L21 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                       </svg>
                     </div>
                     <input
                       :id="inputId"
                       :value="value"
                       @input="updateValue($event.target.value)"
                       @blur="handleBlur"
                       @focus="handleFocus"
                       type="email"
                       class="custom-input"
                       placeholder="Enter your email"
                     />
                     <div class="input-underline"></div>
                   </div>
                 </template>
               </EmailInput>

               <PasswordInput
                 v-model="demoData.customPassword"
                 :unstyled="true"
                 :show-toggle="true"
                 placeholder="Custom password styling"
                 style="margin-top: 1rem;"
               >
                 <template #label="{ label, required }">
                   <label class="custom-label">Password<span v-if="required" class="required">*</span></label>
                 </template>

                 <template #input="{ inputId, value, updateValue, handleBlur, handleFocus, showPassword }">
                   <div class="input-wrapper">
                     <div class="input-icon">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                         <circle cx="12" cy="16" r="1" stroke="currentColor" stroke-width="2"/>
                         <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                       </svg>
                     </div>
                     <input
                       :id="inputId"
                       :value="value"
                       @input="updateValue($event.target.value)"
                       @blur="handleBlur"
                       @focus="handleFocus"
                       :type="showPassword ? 'text' : 'password'"
                       class="custom-input"
                       placeholder="Enter your password"
                     />
                     <div class="input-underline"></div>
                   </div>
                 </template>

                 <template #toggle="{ showPassword, togglePasswordVisibility }">
                   <button
                     @click="togglePasswordVisibility"
                     class="password-toggle-btn"
                     type="button"
                   >
                     <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                     </svg>
                     <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                       <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                     </svg>
                   </button>
                 </template>
               </PasswordInput>

               <SubmitButton
                 :unstyled="true"
                 :disabled="!demoData.customEmail || !demoData.customPassword"
                 style="margin-top: 1rem;"
               >
                 <template #default>
                   <span>Custom Button Style</span>
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                   </svg>
                 </template>
               </SubmitButton>
             </div>
           </div>
         </div>
       </div>

       <!-- Email-Only Login -->
       <div v-if="currentFlow === 'email-only'" class="flow-section">
        <h2>📧 Email-Only Login</h2>
        <p>Login with just email - OTP sent automatically</p>

        <div class="demo-container">
          <div class="email-only-demo">
            <div class="form-header">
              <div class="brand-icon">🔐</div>
              <h3>Secure Login</h3>
              <p>Enter your email to receive a verification code</p>
            </div>

            <!-- SDK EmailInput with custom styling -->
            <EmailInput
              v-model="emailOnlyData.email"
              :unstyled="true"
              placeholder="you@example.com"
              :validate-on-blur="true"
              @validate="handleEmailOnlyValidation"
            >
              <template #label="{ label, required }">
                <label class="custom-label">
                  {{ label }}<span v-if="required" class="required">*</span>
                </label>
              </template>

              <template #input="{ inputId, value, updateValue, handleBlur, handleFocus }">
                <div class="input-wrapper">
                  <input
                    :id="inputId"
                    :value="value"
                    @input="updateValue($event.target.value)"
                    @blur="handleBlur"
                    @focus="handleFocus"
                    type="email"
                    class="custom-input"
                    placeholder="Enter your email address"
                  />
                  <div class="input-underline"></div>
                </div>
              </template>

              <template #error="{ error }">
                <div v-if="error" class="custom-error">
                  <span class="error-icon">⚠️</span>
                  <span>{{ error }}</span>
                </div>
              </template>
            </EmailInput>

            <SubmitButton
              :is-loading="emailOnlyData.isLoading"
              :disabled="!emailOnlyData.isValid || emailOnlyData.isLoading"
              :unstyled="true"
              @click="handleEmailOnlyLogin"
            >
              <template #loading>
                <div class="custom-spinner"></div>
              </template>

              <template #default>
                <span>{{ emailOnlyData.isLoading ? 'Sending Code...' : 'Send Verification Code' }}</span>
                <span class="arrow">→</span>
              </template>
            </SubmitButton>
          </div>
        </div>
      </div>

      <!-- Email + Password Login -->
      <div v-if="currentFlow === 'email-password'" class="flow-section">
        <h2>🔑 Email + Password Login</h2>
        <p>Traditional login with email and password</p>

        <div class="demo-container">
          <div class="email-password-demo">
            <div class="form-header">
              <div class="brand-icon">🔐</div>
              <h3>Welcome Back</h3>
              <p>Sign in with your email and password</p>
            </div>

            <EmailInput
              v-model="emailPasswordData.email"
              :unstyled="true"
              placeholder="you@example.com"
            >
              <template #label="{ label, required }">
                <label class="custom-label">Email Address<span v-if="required" class="required">*</span></label>
              </template>

              <template #input="{ inputId, value, updateValue, handleBlur, handleFocus }">
                <div class="input-wrapper">
                  <input
                    :id="inputId"
                    :value="value"
                    @input="updateValue($event.target.value)"
                    @blur="handleBlur"
                    @focus="handleFocus"
                    type="email"
                    class="custom-input"
                    placeholder="Enter your email"
                  />
                  <div class="input-underline"></div>
                </div>
              </template>
            </EmailInput>

            <PasswordInput
              v-model="emailPasswordData.password"
              :unstyled="true"
              placeholder="Enter your password"
            >
              <template #label="{ label, required }">
                <label class="custom-label">Password<span v-if="required" class="required">*</span></label>
              </template>

              <template #input="{ inputId, value, updateValue, handleBlur, handleFocus }">
                <div class="input-wrapper">
                  <input
                    :id="inputId"
                    :value="value"
                    @input="updateValue($event.target.value)"
                    @blur="handleBlur"
                    @focus="handleFocus"
                    type="password"
                    class="custom-input"
                    placeholder="Enter your password"
                  />
                  <div class="input-underline"></div>
                </div>
              </template>
            </PasswordInput>

            <SubmitButton
              :is-loading="emailPasswordData.isLoading"
              :disabled="!emailPasswordData.email || !emailPasswordData.password"
              :unstyled="true"
              @click="handleEmailPasswordLogin"
            >
              <template #loading>
                <div class="custom-spinner"></div>
              </template>

              <template #default>
                <span>{{ emailPasswordData.isLoading ? 'Signing in...' : 'Sign In' }}</span>
              </template>
            </SubmitButton>
          </div>
        </div>
      </div>

      <!-- Registration -->
      <div v-if="currentFlow === 'register'" class="flow-section">
        <h2>📝 User Registration</h2>
        <p>Create a new account with email and password</p>

        <div class="demo-container">
          <div class="register-demo">
            <div class="form-header">
              <div class="brand-icon">🎉</div>
              <h3>Create Account</h3>
              <p>Join us today and get started</p>
            </div>

            <EmailInput
              v-model="registerData.email"
              :unstyled="true"
              placeholder="you@example.com"
            >
              <template #label="{ label, required }">
                <label class="custom-label">Email Address<span v-if="required" class="required">*</span></label>
              </template>

              <template #input="{ inputId, value, updateValue, handleBlur, handleFocus }">
                <div class="input-wrapper">
                  <input
                    :id="inputId"
                    :value="value"
                    @input="updateValue($event.target.value)"
                    @blur="handleBlur"
                    @focus="handleFocus"
                    type="email"
                    class="custom-input"
                    placeholder="Enter your email"
                  />
                  <div class="input-underline"></div>
                </div>
              </template>
            </EmailInput>

            <PasswordInput
              v-model="registerData.password"
              :unstyled="true"
              :show-strength-indicator="true"
              placeholder="Create a strong password"
            >
              <template #label="{ label, required }">
                <label class="custom-label">Password<span v-if="required" class="required">*</span></label>
              </template>

              <template #input="{ inputId, value, updateValue, handleBlur, handleFocus }">
                <div class="input-wrapper">
                  <input
                    :id="inputId"
                    :value="value"
                    @input="updateValue($event.target.value)"
                    @blur="handleBlur"
                    @focus="handleFocus"
                    type="password"
                    class="custom-input"
                    placeholder="Create a password"
                  />
                  <div class="input-underline"></div>
                </div>
              </template>

              <template #strength="{ strength, strengthPercent }">
                <div class="password-strength">
                  <div class="strength-bar">
                    <div
                      class="strength-fill"
                      :style="{ width: strengthPercent, backgroundColor: strength.color }"
                    ></div>
                  </div>
                  <span class="strength-label" :style="{ color: strength.color }">
                    {{ strength.label }} Password
                  </span>
                </div>
              </template>
            </PasswordInput>

            <SubmitButton
              :is-loading="registerData.isLoading"
              :disabled="!registerData.email || !registerData.password || registerData.password.length < 8"
              :unstyled="true"
              @click="handleRegister"
            >
              <template #loading>
                <div class="custom-spinner"></div>
              </template>

              <template #default>
                <span>{{ registerData.isLoading ? 'Creating Account...' : 'Create Account' }}</span>
              </template>
            </SubmitButton>
          </div>
        </div>
      </div>

      <!-- Forgot Password -->
      <div v-if="currentFlow === 'forgot-password'" class="flow-section">
        <h2>🔑 Forgot Password</h2>
        <p>Reset your password with email verification</p>

        <div class="demo-container">
          <div class="forgot-password-demo">
            <div class="form-header">
              <div class="brand-icon">🔑</div>
              <h3>Reset Password</h3>
              <p>Enter your email to receive a reset code</p>
            </div>

            <EmailInput
              v-model="forgotPasswordData.email"
              :unstyled="true"
              placeholder="you@example.com"
            >
              <template #label="{ label, required }">
                <label class="custom-label">Email Address<span v-if="required" class="required">*</span></label>
              </template>

              <template #input="{ inputId, value, updateValue, handleBlur, handleFocus }">
                <div class="input-wrapper">
                  <input
                    :id="inputId"
                    :value="value"
                    @input="updateValue($event.target.value)"
                    @blur="handleBlur"
                    @focus="handleFocus"
                    type="email"
                    class="custom-input"
                    placeholder="Enter your email"
                  />
                  <div class="input-underline"></div>
                </div>
              </template>
            </EmailInput>

            <SubmitButton
              :is-loading="forgotPasswordData.isLoading"
              :disabled="!forgotPasswordData.email"
              :unstyled="true"
              @click="handleForgotPassword"
            >
              <template #loading>
                <div class="custom-spinner"></div>
              </template>

              <template #default>
                <span>{{ forgotPasswordData.isLoading ? 'Sending Code...' : 'Send Reset Code' }}</span>
              </template>
            </SubmitButton>
          </div>
        </div>
      </div>

      <!-- OTP Verification -->
      <div v-if="currentFlow === 'otp-verify'" class="flow-section">
        <h2>📱 OTP Verification</h2>
        <p>Verify your identity with a 6-digit code</p>

        <div class="demo-container">
          <div class="otp-verify-demo">
            <div class="form-header">
              <div class="brand-icon">📱</div>
              <h3>Enter Verification Code</h3>
              <p>We've sent a 6-digit code to your email</p>
            </div>

            <div class="otp-display">
              <p class="otp-info">Code sent to: <strong>{{ otpVerifyData.email }}</strong></p>
            </div>

            <OTPInput
              v-model="otpVerifyData.code"
              :length="6"
              :unstyled="true"
              @complete="handleOTPComplete"
            >
              <template #input="{ digits, handleInput, handleKeydown }">
                <div class="otp-grid">
                  <input
                    v-for="(digit, index) in digits"
                    :key="index"
                    v-model="digits[index]"
                    @input="handleInput(index, $event)"
                    @keydown="handleKeydown(index, $event)"
                    type="text"
                    maxlength="1"
                    class="otp-box"
                    :class="{ filled: digit }"
                  />
                </div>
              </template>
            </OTPInput>

            <SubmitButton
              :is-loading="otpVerifyData.isLoading"
              :disabled="otpVerifyData.code.length !== 6"
              :unstyled="true"
              @click="handleOTPVerify"
            >
              <template #loading>
                <div class="custom-spinner"></div>
              </template>

              <template #default>
                <span>{{ otpVerifyData.isLoading ? 'Verifying...' : 'Verify Code' }}</span>
              </template>
            </SubmitButton>

            <button @click="handleResendOTP" class="resend-btn">
              Resend Code
            </button>
          </div>
        </div>
      </div>

      <!-- Password Reset -->
      <div v-if="currentFlow === 'reset-password'" class="flow-section">
        <h2>🔐 Reset Password</h2>
        <p>Set a new password for your account</p>

        <div class="demo-container">
          <div class="reset-password-demo">
            <div class="form-header">
              <div class="brand-icon">🔐</div>
              <h3>Set New Password</h3>
              <p>Create a strong password for your account</p>
            </div>

            <PasswordInput
              v-model="resetPasswordData.newPassword"
              :unstyled="true"
              :show-strength-indicator="true"
              placeholder="Enter new password"
            >
              <template #label="{ label, required }">
                <label class="custom-label">New Password<span v-if="required" class="required">*</span></label>
              </template>

              <template #input="{ inputId, value, updateValue, handleBlur, handleFocus }">
                <div class="input-wrapper">
                  <input
                    :id="inputId"
                    :value="value"
                    @input="updateValue($event.target.value)"
                    @blur="handleBlur"
                    @focus="handleFocus"
                    type="password"
                    class="custom-input"
                    placeholder="Enter new password"
                  />
                  <div class="input-underline"></div>
                </div>
              </template>

              <template #strength="{ strength, strengthPercent }">
                <div class="password-strength">
                  <div class="strength-bar">
                    <div
                      class="strength-fill"
                      :style="{ width: strengthPercent, backgroundColor: strength.color }"
                    ></div>
                  </div>
                  <span class="strength-label" :style="{ color: strength.color }">
                    {{ strength.label }} Password
                  </span>
                </div>
              </template>
            </PasswordInput>

            <SubmitButton
              :is-loading="resetPasswordData.isLoading"
              :disabled="!resetPasswordData.newPassword || resetPasswordData.newPassword.length < 8"
              :unstyled="true"
              @click="handleResetPassword"
            >
              <template #loading>
                <div class="custom-spinner"></div>
              </template>

              <template #default>
                <span>{{ resetPasswordData.isLoading ? 'Updating...' : 'Update Password' }}</span>
              </template>
            </SubmitButton>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

// Import enhanced SDK components
import { EmailInput, PasswordInput, OTPInput, SubmitButton } from '../index.js'

export default {
  name: 'AuthShowcase',
  components: {
    EmailInput,
    PasswordInput,
    OTPInput,
    SubmitButton
  },

  setup() {
    const store = useStore()
    const router = useRouter()
    const currentFlow = ref('email-only')

    // Form data for each flow
    const emailOnlyData = reactive({
      email: '',
      isValid: false,
      isLoading: false
    })

    const emailPasswordData = reactive({
      email: '',
      password: '',
      isLoading: false
    })

    const registerData = reactive({
      email: '',
      password: '',
      isLoading: false
    })

    const forgotPasswordData = reactive({
      email: '',
      isLoading: false
    })

    const otpVerifyData = reactive({
      email: '',
      code: '',
      isLoading: false
    })

    const resetPasswordData = reactive({
      newPassword: '',
      isLoading: false
    })

    // Demo data for style comparison
    const demoData = reactive({
      defaultEmail: '',
      defaultPassword: '',
      customEmail: '',
      customPassword: ''
    })

    // Auth flows configuration
    const authFlows = [
      { id: 'style-demo', title: '🎨 Style Demo' },
      { id: 'email-only', title: '📧 Email Only' },
      { id: 'email-password', title: '🔑 Email + Password' },
      { id: 'register', title: '📝 Register' },
      { id: 'forgot-password', title: '🔑 Forgot Password' },
      { id: 'otp-verify', title: '📱 OTP Verify' },
      { id: 'reset-password', title: '🔐 Reset Password' }
    ]

    // Methods
    const handleEmailOnlyValidation = ({ valid }) => {
      emailOnlyData.isValid = valid
    }

    const handleEmailOnlyLogin = async () => {
      if (!emailOnlyData.isValid) return

      emailOnlyData.isLoading = true
      store.dispatch('auth/clearError')

      try {
        // Use the check-email endpoint first
        const checkResponse = await fetch(`${store.getters['api/baseURL']}/check-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailOnlyData.email })
        })

        const checkResult = await checkResponse.json()

        if (checkResult.success && checkResult.is_valid) {
          // User exists, send OTP for login
          await store.dispatch('auth/sendLoginOTP', { email: emailOnlyData.email })
          otpVerifyData.email = emailOnlyData.email
          currentFlow.value = 'otp-verify'

          store.dispatch('ui/showToast', {
            type: 'success',
            message: 'Verification code sent to your email!'
          })
        } else {
          // User doesn't exist, show error
          store.commit('auth/SET_ERROR', 'Email not found. Please register first.')
        }
      } catch (error) {
        console.error('Email-only login failed:', error)
      } finally {
        emailOnlyData.isLoading = false
      }
    }

    const handleEmailPasswordLogin = async () => {
      if (!emailPasswordData.email || !emailPasswordData.password) return

      emailPasswordData.isLoading = true
      store.dispatch('auth/clearError')

      try {
        const result = await store.dispatch('auth/login', {
          email: emailPasswordData.email,
          password: emailPasswordData.password
        })

        console.log('✅ Email+Password login successful!')
        store.dispatch('ui/showToast', { type: 'success', message: 'Login successful!' })
        router.push('/dashboard')
      } catch (error) {
        console.error('Email+Password login failed:', error)
      } finally {
        emailPasswordData.isLoading = false
      }
    }

    const handleRegister = async () => {
      if (!registerData.email || !registerData.password || registerData.password.length < 8) return

      registerData.isLoading = true
      store.dispatch('auth/clearError')

      try {
        const result = await store.dispatch('auth/register', {
          email: registerData.email,
          password: registerData.password
        })

        console.log('✅ Registration successful!')

        // Send OTP for email verification
        await store.dispatch('auth/sendLoginOTP', { email: registerData.email })

        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Account created! Please verify your email.'
        })

        // Redirect to OTP verification
        otpVerifyData.email = registerData.email
        currentFlow.value = 'otp-verify'
      } catch (error) {
        console.error('Registration failed:', error)
      } finally {
        registerData.isLoading = false
      }
    }

    const handleForgotPassword = async () => {
      if (!forgotPasswordData.email) return

      forgotPasswordData.isLoading = true
      store.dispatch('auth/clearError')

      try {
        await store.dispatch('auth/forgotPassword', forgotPasswordData.email)

        console.log('✅ Password reset email sent!')
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Reset code sent to your email!'
        })

        // Redirect to password reset
        resetPasswordData.email = forgotPasswordData.email
        currentFlow.value = 'reset-password'
      } catch (error) {
        console.error('Forgot password failed:', error)
      } finally {
        forgotPasswordData.isLoading = false
      }
    }

    const handleOTPComplete = (otp) => {
      otpVerifyData.code = otp
      if (otp.length === 6) {
        handleOTPVerify()
      }
    }

    const handleOTPVerify = async () => {
      if (otpVerifyData.code.length !== 6) return

      otpVerifyData.isLoading = true
      store.dispatch('auth/clearError')

      try {
        const result = await store.dispatch('auth/verifyLoginOTP', {
          email: otpVerifyData.email,
          code: otpVerifyData.code
        })

        console.log('✅ OTP verification successful!')
        store.dispatch('ui/showToast', { type: 'success', message: 'Verification successful!' })
        router.push('/dashboard')
      } catch (error) {
        console.error('OTP verification failed:', error)
        otpVerifyData.code = ''
      } finally {
        otpVerifyData.isLoading = false
      }
    }

    const handleResendOTP = async () => {
      try {
        await store.dispatch('auth/sendLoginOTP', { email: otpVerifyData.email })
        store.dispatch('ui/showToast', { type: 'success', message: 'New code sent!' })
      } catch (error) {
        console.error('Resend failed:', error)
      }
    }

    const handleResetPassword = async () => {
      if (!resetPasswordData.newPassword || resetPasswordData.newPassword.length < 8) return

      resetPasswordData.isLoading = true
      store.dispatch('auth/clearError')

      try {
        await store.dispatch('auth/resetPassword', {
          email: resetPasswordData.email,
          otp: '123456', // In real app, this would come from user input
          newPassword: resetPasswordData.newPassword
        })

        console.log('✅ Password reset successful!')
        store.dispatch('ui/showToast', { type: 'success', message: 'Password updated!' })
        router.push('/login')
      } catch (error) {
        console.error('Password reset failed:', error)
      } finally {
        resetPasswordData.isLoading = false
      }
    }

    return {
      currentFlow,
      authFlows,
      emailOnlyData,
      emailPasswordData,
      registerData,
      forgotPasswordData,
      otpVerifyData,
      resetPasswordData,
      demoData,
      handleEmailOnlyValidation,
      handleEmailOnlyLogin,
      handleEmailPasswordLogin,
      handleRegister,
      handleForgotPassword,
      handleOTPComplete,
      handleOTPVerify,
      handleResendOTP,
      handleResetPassword
    }
  }
}
</script>

<style scoped>
.auth-showcase {
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

.flow-section {
  margin-bottom: 3rem;
}

.flow-section h2 {
  color: #1e293b;
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

.flow-section p {
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

/* Form Headers */
.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.form-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: #64748b;
  margin: 0;
}

/* Custom Labels */
.custom-label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #1f2937;
  font-size: 0.9rem;
}

.required {
  color: #ef4444;
  margin-left: 0.25rem;
}

/* Custom Inputs */
.input-wrapper {
  position: relative;
}

.custom-input {
  width: 100%;
  padding: 1rem 0;
  background: transparent;
  border: none;
  border-bottom: 2px solid #e5e7eb;
  font-size: 1rem;
  color: #1f2937;
  transition: all 0.3s ease;
  outline: none;
}

.custom-input::placeholder {
  color: #9ca3af;
}

.custom-input:focus {
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

.custom-input:focus + .input-underline {
  width: 100%;
}

/* Custom Errors */
.custom-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.875rem;
}

.error-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

/* Custom Buttons */
.custom-submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.custom-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.custom-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.arrow {
  font-size: 1.2rem;
  transition: transform 0.2s ease;
}

.custom-submit-btn:hover:not(:disabled) .arrow {
  transform: translateX(4px);
}

/* Custom Spinner */
.custom-spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Password Strength */
.password-strength {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.strength-label {
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}

/* OTP Grid */
.otp-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.otp-box {
  width: 100%;
  height: 60px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.2s;
  background: #f8fafc;
  color: #1f2937;
}

.otp-box:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.otp-box.filled {
  border-color: #667eea;
  background: white;
}

/* OTP Display */
.otp-display {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.otp-info {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

.otp-info strong {
  color: #1f2937;
  font-weight: 600;
}

/* Resend Button */
.resend-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem;
  transition: color 0.2s;
  margin-top: 1rem;
}

.resend-btn:hover {
  color: #5a67d8;
}

/* Email Display */
.email-display {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.email-text {
  margin: 0 0 0.5rem 0;
  color: #64748b;
  font-size: 0.875rem;
}

.email-address {
  margin: 0;
  color: #1f2937;
  font-weight: 600;
  font-size: 1.1rem;
  word-break: break-all;
}

/* Style Comparison Demo */
.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.comparison-item {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  background: #f8fafc;
}

.comparison-item h3 {
  margin: 0 0 0.5rem 0;
  color: #1e293b;
  font-size: 1.125rem;
  font-weight: 600;
}

.comparison-item p {
  margin: 0 0 1.5rem 0;
  color: #64748b;
  font-size: 0.875rem;
}

/* Password Toggle Button */
.password-toggle-btn {
  position: absolute;
  right: 3.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  z-index: 2;
}

.password-toggle-btn:hover {
  color: #667eea;
  background: #f8fafc;
}

.password-toggle-btn svg {
  display: block;
}

/* Responsive Design */
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

  .comparison-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .otp-grid {
    gap: 0.25rem;
  }

  .otp-box {
    height: 50px;
    font-size: 1.25rem;
  }

  .password-toggle-btn {
    right: 3rem;
  }
}
</style>