import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

import LoginView from '~/views/auth/LoginView.vue'
const AdminDashboard = { template: '<div class="p-8"><h1 class="text-2xl font-bold">Admin/Superadmin Dashboard</h1></div>' }
const StaffDashboard = { template: '<div class="p-8"><h1 class="text-2xl font-bold">Staff Dashboard</h1></div>' }
const CustomerDashboard = { template: '<div class="p-8"><h1 class="text-2xl font-bold">Customer Dashboard</h1></div>' }

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  { 
    path: '/admin', 
    name: 'Admin', 
    component: AdminDashboard, 
    meta: { requiresAuth: true, roles: ['SUPERUSER', 'ADMIN'] } 
  },
  { 
    path: '/staff', 
    name: 'Staff', 
    component: StaffDashboard, 
    meta: { requiresAuth: true, roles: ['STAFF', 'ADMIN', 'SUPERUSER'] } 
  },
  { 
    path: '/customer', 
    name: 'Customer', 
    component: CustomerDashboard, 
    meta: { requiresAuth: true, roles: ['CUSTOMER', 'STAFF', 'ADMIN', 'SUPERUSER'] } 
  },
  { path: '/', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return '/login'
    }
    
    const userRole = authStore.userRole
    if (to.meta.roles && !to.meta.roles.includes(userRole)) {
      alert('Bạn không có quyền truy cập trang này!')
      return from.path || '/login'
    }
  }

  return true
})

export default router