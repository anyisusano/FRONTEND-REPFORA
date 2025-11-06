import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref('')
  const user = ref(null)
  const isAuthenticated = ref(false)

  const roles = computed(() => {
    const roleValue = user.value?.role
    if (!roleValue) return []

    if (Array.isArray(roleValue)) {
      return roleValue
        .map(formatRole)
        .flat()
        .filter(Boolean)
    }

    return formatRole(roleValue)
  })

  function formatRole(roleValue) {
    if (!roleValue) return []

    const normalized = String(roleValue).trim().toUpperCase()
    if (!normalized) return []

    if (normalized === 'INSTRUCTOR OWNER') {
      return [normalized, 'INSTRUCTOR']
    }

    return [normalized]
  }

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

  function hasRole(requiredRoles = []) {
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return true
    }

    const normalizedRequiredRoles = requiredRoles
      .map((role) => String(role).trim().toUpperCase())
      .filter(Boolean)

    if (normalizedRequiredRoles.length === 0) {
      return true
    }

    return roles.value.some((role) => normalizedRequiredRoles.includes(role))
  }

  return {
    token,
    user,
    isAuthenticated,
    roles,
    setToken,
    setUser,
    setAuth,
    clearAuth,
    hasRole
  }
}, {
  persist: true
})