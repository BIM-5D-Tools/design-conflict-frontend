<!-- src/components/AppHeader.vue -->
<template>
  <header
    class="h-16 px-6 border-b flex items-center justify-between transition-colors duration-200 bg-white border-slate-200 text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
  >
    <!-- Title / Breadcrumb trang -->
    <div class="flex items-center gap-3">
      <h1 class="text-base font-semibold tracking-tight">
        {{ $route.meta.title || 'Hệ Thống Quản Lý' }}
      </h1>
    </div>

    <!-- Right Controls: Toggle Theme + User Info + Logout -->
    <div class="flex items-center gap-4">
      <!-- Nút Chuyển Chế Độ Sáng / Tối -->
      <button
        @click="themeStore.toggleTheme"
        type="button"
        title="Chuyển chế độ giao diện"
        class="p-2 rounded-xl transition-all duration-200 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-amber-400"
      >
        <!-- Icon Mặt Trời (Light Mode Active) -->
        <svg
          v-if="themeStore.isDark"
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 3v2.25m0 13.5V21m8.966-8.966h-2.25m-13.5 0h-2.25m15.356-6.857l-1.591 1.591M6.759 17.243l-1.59 1.59m12.728 0l-1.591-1.59M6.759 6.759L5.169 5.169M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z"
          />
        </svg>
        <!-- Icon Mặt Trăng (Dark Mode Active) -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>
      </button>

      <div class="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

      <!-- Profile User & Role -->
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400"
        >
          {{ authStore.user?.username?.[0]?.toUpperCase() || 'U' }}
        </div>
        <div class="hidden sm:block text-left">
          <p class="text-xs font-semibold leading-none text-slate-900 dark:text-white">
            {{ authStore.user?.username }}
          </p>
          <span
            class="inline-block text-[10px] font-bold uppercase tracking-wider mt-1 px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
          >
            {{ authStore.userRole }}
          </span>
        </div>
      </div>

      <!-- Nút Đăng Xuất -->
      <button
        @click="handleLogout"
        title="Đăng xuất"
        class="p-2 rounded-xl text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25"
          />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const router = useRouter()

const handleLogout = () => {
  if (confirm('Bạn có muốn đăng xuất khỏi hệ thống?')) {
    authStore.logout()
    router.push('/login')
  }
}
</script>
