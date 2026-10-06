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
        const res = await getInfo()
        this.user = res.data?.data || res.data || res
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

      return app.permissions.includes(action.toLowerCase())
    },
    canDoAction(appCode, action) {
      if (!this.user) return false

      if (this.isSuperUser) return true

      const permissions = this.user.apps || []
      const appPerm = permissions.find((p) => p.code === appCode || p.app === appCode)

      if (!appPerm || !Array.isArray(appPerm.permissions)) return false

      const userPerms = appPerm.permissions.map((p) => String(p).toUpperCase())

      if (userPerms.includes('ALL')) {
        return true
      }

      return userPerms.includes(String(action).toUpperCase())
    }
  }
})
