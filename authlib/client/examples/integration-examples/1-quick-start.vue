
<template>
  <div id="app">
    <!-- Your app header -->
    <header class="app-header">
      <h1>My Awesome App</h1>
      <div v-if="isAuthenticated" class="user-info">
        Welcome, {{ currentUser?.name }}!
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </header>

    <!-- Main content -->
    <main>
      <!-- Show auth page if not logged in -->
      <AuthView v-if="!isAuthenticated" @success="handleAuthSuccess" />
      
      <!-- Show app content if logged in -->
      <div v-else class="dashboard">
        <h2>🎉 You're logged in!</h2>
        <p>Welcome to your dashboard, {{ currentUser?.name }}!</p>
        
        <div class="user-details">
          <h3>User Details:</h3>
          <pre>{{ JSON.stringify(currentUser, null, 2) }}</pre>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import AuthView from '../src/views/AuthView.vue'

export default {
  name: 'QuickStartApp',
  components: {
    AuthView
  },
  
  setup() {
    const store = useStore()
    
    // Get auth state from store
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
    const currentUser = computed(() => store.getters['auth/currentUser'])
    
    const handleAuthSuccess = () => {
      console.log('User successfully authenticated!')
      // Optional: redirect or show success message
    }
    
    const logout = () => {
      store.dispatch('auth/logout')
    }
    
    return {
      isAuthenticated,
      currentUser,
      handleAuthSuccess,
      logout
    }
  }
}
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #c82333;
}

.dashboard {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}

.user-details {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
}

.user-details pre {
  background-color: #e9ecef;
  padding: 1rem;
  border-radius: 0.25rem;
  overflow-x: auto;
}
</style>
