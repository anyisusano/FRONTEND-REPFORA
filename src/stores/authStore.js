import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref('')
  const user = ref(null)
  const isAuthenticated = ref(false)

  function setToken(tokenValue) {
    token.value = tokenValue
    isAuthenticated.value = !!tokenValue
  }

  function setUser(userData) {
    user.value = userData
  }

  function setAuth(tokenValue, userData) {
    setToken(tokenValue)
    setUser(userData)
  }

  function clearAuth() {
    token.value = ''
    user.value = null
    isAuthenticated.value = false
  }

  return {
    token,
    user,
    isAuthenticated,
    setToken,
    setUser,
    setAuth,
    clearAuth
  }
}, {
  persist: true
})