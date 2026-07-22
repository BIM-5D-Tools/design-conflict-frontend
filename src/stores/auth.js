import { defineStore } from 'pinia'
import { login } from '@/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role || null,
  },
  actions: {
    async login(username, password) {
      try {
        const response = await login({ username, password })

        this.token = response.token
        this.user = response.data.user

        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        
        return response.data
      } catch (error) {
        throw error.response?.data?.message || 'Đăng nhập thất bại!'
      }
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})