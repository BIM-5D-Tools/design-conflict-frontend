import { defineStore } from 'pinia'
import { login, getInfo } from '@/api/auth'
import { DEFAULT_MENUS, APP_REGISTRY } from '@/config/menu'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isInitialized: false
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role || null,
    isSuperUser: (state) => state.user?.role === 'SUPERUSER' || state.user?.is_superuser,
    authorizedMenus: (state) => {
      if (state.user?.role === 'SUPERUSER' || state.user?.is_superuser) {
        return [...DEFAULT_MENUS, ...APP_REGISTRY]
      }

      if (!state.user || !state.user.apps) return []

      const userAppCodes = state.user?.apps?.map((a) => a.code) || []
      const dynamicApps = APP_REGISTRY.filter((registryApp) =>
        userAppCodes.includes(registryApp.code)
      )

      return [...DEFAULT_MENUS, ...dynamicApps]
    }
  },
  actions: {
    async fetchUserProfile() {
      if (!this.token) return null
      try {
        const response = await getInfo()
        this.user = response
        this.isInitialized = true
        return this.user
      } catch (error) {
        this.logout()
        throw error
      }
    },
    async login(email, password) {
      try {
        const response = await login({ email, password })

        this.token = response.token
        this.user = response.user

        localStorage.setItem('token', this.token)
        this.isInitialized = true

        return response
      } catch (error) {
        throw error.response?.data?.message || 'Đăng nhập thất bại!'
      }
    },
    logout() {
      this.token = null
      this.user = null
      this.isInitialized = false
      localStorage.removeItem('token')
    },
    hasPermission(appCode, action) {
      if (!this.user || !this.user.apps) return false

      if (this.user.role === 'SUPERUSER' || this.user.is_superuser) return true

      const app = this.user.apps.find((a) => a.code === appCode)
      if (!app || !app.permissions) return false

      if (app.permissions.includes('ALL')) return true

      return app.permissions.includes(action)
    },
    canDoAction(appCode, action) {
      if (!this.user) return false

      if (this.isSuperUser) return true

      const permissions = this.user.app_permissions || []
      const appPerm = permissions.find((p) => p.app_code === appCode || p.app === appCode)

      if (!appPerm) return false

      return (appPerm.permissions || []).includes(action)
    }
  }
})
