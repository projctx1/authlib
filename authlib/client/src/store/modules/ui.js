export default {
  namespaced: true,
  
  state: {
    theme: 'light',
    loading: false,
    toasts: [],
    modals: {},
    sidebarOpen: false
  },
  
  mutations: {
    SET_THEME(state, theme) {
      state.theme = theme
      document.documentElement.setAttribute('data-theme', theme)
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    ADD_TOAST(state, toast) {
      state.toasts.push({
        id: Date.now() + Math.random(),
        ...toast
      })
    },
    REMOVE_TOAST(state, id) {
      state.toasts = state.toasts.filter(toast => toast.id !== id)
    },
    OPEN_MODAL(state, { name, props = {} }) {
      state.modals = {
        ...state.modals,
        [name]: { open: true, props }
      }
    },
    CLOSE_MODAL(state, name) {
      if (state.modals[name]) {
        state.modals[name].open = false
      }
    },
    TOGGLE_SIDEBAR(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    SET_SIDEBAR(state, open) {
      state.sidebarOpen = open
    }
  },
  
  actions: {
    setTheme({ commit }, theme) {
      commit('SET_THEME', theme)
      localStorage.setItem('auth-sdk-theme', theme)
    },
    
    initTheme({ commit }) {
      const savedTheme = localStorage.getItem('auth-sdk-theme') || 'light'
      commit('SET_THEME', savedTheme)
    },
    
    showToast({ commit }, toast) {
      const id = Date.now() + Math.random()
      commit('ADD_TOAST', { id, ...toast })
      
      // Auto remove after duration
      if (toast.duration !== 0) {
        setTimeout(() => {
          commit('REMOVE_TOAST', id)
        }, toast.duration || 3000)
      }
      
      return id
    },
    
    hideToast({ commit }, id) {
      commit('REMOVE_TOAST', id)
    },
    
    openModal({ commit }, { name, props }) {
      commit('OPEN_MODAL', { name, props })
    },
    
    closeModal({ commit }, name) {
      commit('CLOSE_MODAL', name)
    },
    
    toggleSidebar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    
    setSidebar({ commit }, open) {
      commit('SET_SIDEBAR', open)
    }
  },
  
  getters: {
    theme: (state) => state.theme,
    isDark: (state) => state.theme === 'dark',
    loading: (state) => state.loading,
    toasts: (state) => state.toasts,
    isModalOpen: (state) => (name) => state.modals[name]?.open || false,
    getModalProps: (state) => (name) => state.modals[name]?.props || {},
    sidebarOpen: (state) => state.sidebarOpen
  }
}
