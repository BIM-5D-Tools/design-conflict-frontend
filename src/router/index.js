import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

import MainLayout from '~/layouts/MainLayout.vue'
import LoginView from '~/views/auth/LoginView.vue'
import HomeView from '~/views/home/HomeView.vue'
import ConflictsView from '~/views/design/ConflictsView.vue'
import ProjectView from '~/views/projects/ProjectView.vue'
import UserView from '~/views/users/UserView.vue'
import AppView from '~/views/apps/AppView.vue'

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: HomeView,
        meta: { title: 'Trang chủ' }
      },
      {
        path: 'projects',
        name: 'Projects',
        component: ProjectView,
        meta: { title: 'Dự án', appCode: 'project' }
      },
      {
        path: 'design-conflicts',
        name: 'DesignConflicts',
        component: ConflictsView,
        meta: { title: 'Xung đột thiết kế', appCode: 'design_conflict' }
      },
      {
        path: 'users',
        name: 'Users',
        component: UserView,
        meta: { title: 'Quản lý tài khoản', appCode: 'user_management' }
      },
      {
        path: 'apps',
        name: 'Apps',
        component: AppView,
        meta: { title: 'Quản lý ứng dụng', appCode: 'app' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()

  if (to.path === '/login') {
    return true
  }

  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchUserProfile()
    } catch (err) {
      authStore.logout()
      return '/login'
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  }

  if (to.meta.appCode) {
    const hasAccess = authStore.authorizedMenus.some((menu) => menu.code === to.meta.appCode)
    if (!hasAccess) {
      alert('Tài khoản của bạn chưa được cấp quyền sử dụng ứng dụng này!')
      return from.path && from.path !== '/login' ? from.path : '/dashboard'
    }
  }

  return true
})

router.onError((error) => {
  console.error('❌ Lỗi load trang component:', error)
  alert('Không thể tải trang này! Vui lòng kiểm tra lại đường dẫn file Vue hoặc F5 lại trang.')
})

export default router
