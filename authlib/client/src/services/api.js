/**
* API Service Layer for Backend Integration
* Handles all HTTP requests with automatic token management using fetch
*/

// Create API configuration
const baseURL = import.meta.env.VITE_API_URL || 'https://authlib.vercel.app'
const DEFAULT_TIMEOUT = 15000

// API request function using fetch
class APIService {
 constructor() {
   this.baseURL = baseURL
   this.defaultHeaders = {
     'Content-Type': 'application/json'
   }
 }

 // Main request method
 async request(config) {
   const url = config.url.startsWith('http') ? config.url : `${this.baseURL}${config.url}`
   const method = config.method || 'GET'

   // Prepare headers
   let headers = { ...this.defaultHeaders }
   if (config.headers) {
     headers = { ...headers, ...config.headers }
   }

   // Add auth token if available
   const token = localStorage.getItem('auth_token')
   if (token) {
     headers.Authorization = `Bearer ${token}`
   }

   // Prepare request options
   const requestOptions = {
     method,
     headers,
     credentials: 'omit'
   }

   // Add body for non-GET requests
   if (config.data && method !== 'GET') {
     requestOptions.body = JSON.stringify(config.data)
   }

   // Handle timeout
   const controller = new AbortController()
   const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)
   requestOptions.signal = controller.signal

   try {
     const response = await fetch(url, requestOptions)
     clearTimeout(timeoutId)

     // Handle response
     return await this.handleResponse(response, config)
   } catch (error) {
     clearTimeout(timeoutId)
     if (error.name === 'AbortError') {
       throw new Error('Request timeout')
     }
     throw error
   }
 }

 // Handle HTTP response with interceptor logic
 async handleResponse(response, originalRequest) {
   let data
   const contentType = response.headers.get('content-type')

   if (contentType && contentType.includes('application/json')) {
     data = await response.json()
   } else {
     data = await response.text()
   }

   // Handle 401 Unauthorized (token expired)
   if (response.status === 401 && !originalRequest._retry) {
     originalRequest._retry = true

     try {
       // Try to refresh token
       const refreshToken = localStorage.getItem('refresh_token')
       if (refreshToken) {
         const refreshResponse = await fetch(`${this.baseURL}/auth/refresh`, {
           method: 'POST',
           headers: this.defaultHeaders,
           credentials: 'omit',
           body: JSON.stringify({ refreshToken })
         })

         if (refreshResponse.ok) {
           const refreshData = await refreshResponse.json()
           if (refreshData.success) {
             const { token } = refreshData.data
             localStorage.setItem('auth_token', token)

             // Retry original request with new token
             originalRequest.headers = {
               ...originalRequest.headers,
               Authorization: `Bearer ${token}`
             }
             return this.request(originalRequest)
           }
         }
       }
     } catch (refreshError) {
       // Refresh failed, redirect to login
       localStorage.removeItem('auth_token')
       localStorage.removeItem('refresh_token')
       localStorage.removeItem('auth_user')
       window.location.href = '/auth'
     }
   }

   if (!response.ok) {
     const error = new Error(data.message || `HTTP error! status: ${response.status}`)
     error.status = response.status
     error.response = { status: response.status, data }
     throw error
   }

   return { data, status: response.status }
 }

 // HTTP method shortcuts
 async get(url, config = {}) {
   return this.request({ ...config, method: 'GET', url })
 }

 async post(url, data = {}, config = {}) {
   return this.request({ ...config, method: 'POST', url, data })
 }

 async put(url, data = {}, config = {}) {
   return this.request({ ...config, method: 'PUT', url, data })
 }

 async delete(url, config = {}) {
   return this.request({ ...config, method: 'DELETE', url })
 }

 async patch(url, data = {}, config = {}) {
   return this.request({ ...config, method: 'PATCH', url, data })
 }
}

// Create and export API instance
const API = new APIService()
export default API
