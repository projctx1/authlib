<template>
  <div class="otp-input-wrapper">
    <label v-if="label" class="otp-input-label">{{ label }}</label>
    
    <div class="otp-input-container">
      <input
        v-for="(digit, index) in digits"
        :key="index"
        :ref="el => inputRefs[index] = el"
        v-model="digits[index]"
        type="text"
        inputmode="numeric"
        maxlength="1"
        class="otp-digit"
        :class="{ 'has-value': digit, 'has-error': error }"
        @input="handleInput(index, $event)"
        @keydown="handleKeydown(index, $event)"
        @paste="handlePaste"
      />
    </div>
    
    <div v-if="showTimer && expiryTime" class="otp-timer">
      <span v-if="!isExpired">Code expires in {{ countdown }}s</span>
      <span v-else class="expired">Code expired</span>
    </div>
    
    <button
      v-if="showResend"
      class="otp-resend"
      :disabled="!canResend"
      @click="handleResend"
    >
      {{ canResend ? 'Resend Code' : `Resend in ${resendCountdown}s` }}
    </button>
    
    <p v-if="error" class="otp-error">{{ error }}</p>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { isValidOTP } from '../../utils/validators'

export default {
  name: 'OTPInput',
  
  props: {
    modelValue: { type: String, default: '' },
    label: { type: String, default: 'Enter Verification Code' },
    length: { type: Number, default: 6 },
    showTimer: { type: Boolean, default: true },
    showResend: { type: Boolean, default: true }
  },
  
  emits: ['update:modelValue', 'complete', 'resend'],
  
  setup(props, { emit }) {
    const store = useStore()
    const digits = ref(Array(props.length).fill(''))
    const inputRefs = ref([])
    const countdown = ref(0)
    const resendCountdown = ref(0)
    const countdownTimer = ref(null)
    
    const error = computed(() => store.getters['otp/error'])
    const expiryTime = computed(() => store.getters['otp/expiryTime'])
    const resendCooldownEnd = computed(() => store.getters['otp/resendCooldownEnd'])
    const canResend = computed(() => store.getters['otp/canResend'])
    const isExpired = computed(() => store.getters['otp/isExpired'])
    
    const code = computed(() => digits.value.join(''))
    
    watch(code, (value) => {
      emit('update:modelValue', value)
      store.dispatch('otp/updateCode', value)
      
      if (value.length === props.length) {
        emit('complete', value)
      }
    })
    
    watch(() => props.modelValue, (value) => {
      if (value && value !== code.value) {
        digits.value = value.split('').concat(Array(props.length).fill('')).slice(0, props.length)
      }
    })
    
    const updateCountdown = () => {
      if (expiryTime.value) {
        const remaining = Math.max(0, Math.floor((expiryTime.value - Date.now()) / 1000))
        countdown.value = remaining
        
        if (remaining === 0 && !isExpired.value) {
          store.dispatch('otp/setExpired')
        }
      }
      
      if (resendCooldownEnd.value) {
        const remaining = Math.max(0, Math.floor((resendCooldownEnd.value - Date.now()) / 1000))
        resendCountdown.value = remaining
      }
    }
    
    onMounted(() => {
      if (inputRefs.value[0]) {
        inputRefs.value[0].focus()
      }
      
      countdownTimer.value = setInterval(updateCountdown, 1000)
      updateCountdown()
    })
    
    onUnmounted(() => {
      if (countdownTimer.value) {
        clearInterval(countdownTimer.value)
      }
    })
    
    const handleInput = (index, event) => {
      const value = event.target.value

      // Only allow single digits
      if (!/^\d?$/.test(value)) {
        digits.value[index] = ''
        return
      }

      digits.value[index] = value

      // Auto-focus next input
      if (value && index < props.length - 1) {
        inputRefs.value[index + 1]?.focus()
      }
    }

    // Validate OTP using our validator utility
    const validateOTP = () => {
      const otpValue = code.value
      return isValidOTP(otpValue, props.length)
    }

    // Check if OTP is complete and valid
    const isCompleteAndValid = computed(() => {
      return code.value.length === props.length && validateOTP()
    })
    
    const handleKeydown = (index, event) => {
      // Handle backspace
      if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
        inputRefs.value[index - 1]?.focus()
      }
      
      // Handle arrow keys
      if (event.key === 'ArrowLeft' && index > 0) {
        inputRefs.value[index - 1]?.focus()
      }
      if (event.key === 'ArrowRight' && index < props.length - 1) {
        inputRefs.value[index + 1]?.focus()
      }
    }
    
    const handlePaste = (event) => {
      event.preventDefault()
      const pasteData = event.clipboardData.getData('text')
      const pasteDigits = pasteData.replace(/\D/g, '').split('').slice(0, props.length)
      
      pasteDigits.forEach((digit, index) => {
        digits.value[index] = digit
      })
      
      // Focus last filled input or first empty
      const lastIndex = Math.min(pasteDigits.length, props.length - 1)
      inputRefs.value[lastIndex]?.focus()
    }
    
    const handleResend = () => {
      digits.value = Array(props.length).fill('')
      emit('resend')
      store.dispatch('otp/resendOTP')
      if (inputRefs.value[0]) {
        inputRefs.value[0].focus()
      }
    }
    
    return {
      digits,
      inputRefs,
      error,
      expiryTime,
      canResend,
      isExpired,
      countdown,
      resendCountdown,
      isCompleteAndValid,
      handleInput,
      handleKeydown,
      handlePaste,
      handleResend,
      validateOTP
    }
  }
}
</script>
