<!-- src/views/LoginView.vue -->
<template>
  <div
    class="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white"
  >
    <!-- Ambient Glow / Blur Background Effect -->
    <div
      class="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/25 rounded-full blur-[128px] pointer-events-none animate-pulse"
    ></div>
    <div
      class="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-600/25 rounded-full blur-[128px] pointer-events-none animate-pulse"
      style="animation-delay: 1s"
    ></div>

    <!-- Geometric Grid Background Pattern (Trang trí kiểu Tech/Architecture) -->
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
    ></div>

    <!-- Main Glassmorphism Card -->
    <div
      class="relative z-10 w-full max-w-md p-8 sm:p-10 mx-4 bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl shadow-[0_0_50px_-12px_rgba(79,70,229,0.25)] transition-all duration-300"
    >
      <!-- Company Logo & Brand Header -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 shadow-inner group transition-transform duration-300 hover:scale-105"
        >
          <!-- Hiển thị Logo từ assets/images/logo -->
          <img
            :src="companyLogo"
            alt="Company Logo"
            class="h-12 w-auto object-contain max-w-[180px]"
            @error="handleImageError"
          />
        </div>

        <h1 class="text-2xl font-bold text-white tracking-tight">Design DB Platform</h1>
        <p class="text-xs text-slate-400 mt-1.5">Đăng nhập hệ thống quản lý thiết kế & xung đột</p>
      </div>

      <!-- Alert Message (Hiện khi gặp lỗi Đăng nhập) -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-2 opacity-0"
      >
        <div
          v-if="errorMessage"
          class="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 shrink-0 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span class="font-medium leading-relaxed">{{ errorMessage }}</span>
        </div>
      </Transition>

      <!-- Form Login -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Field email -->
        <div>
          <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
            >Tên tài khoản</label
          >
          <div class="relative group">
            <!-- Icon User -->
            <div
              class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors"
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
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>

            <input
              v-model="email"
              type="email"
              required
              placeholder="Nhập email..."
              class="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 shadow-inner"
            />
          </div>
        </div>

        <!-- Field Password -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
              >Mật khẩu</label
            >
          </div>

          <div class="relative group">
            <!-- Icon Lock -->
            <div
              class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors"
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
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>

            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="••••••••"
              class="w-full pl-10 pr-11 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 shadow-inner"
            />

            <!-- Toggle Eye Icon -->
            <button
              type="button"
              @click="showPassword = !showPassword"
              tabindex="-1"
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
            >
              <svg
                v-if="!showPassword"
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
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
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
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full mt-2 py-3 px-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
        >
          <span
            v-if="loading"
            class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0"
          ></span>
          <span>{{ loading ? 'Đang xác thực...' : 'Đăng Nhập' }}</span>
        </button>
      </form>

      <!-- Footer Info -->
      <div
        class="mt-8 pt-6 border-t border-slate-800/60 text-center text-[11px] text-slate-500 flex items-center justify-between"
      >
        <span>Design DB System v1.0</span>
        <span>&copy; 2026 Enterprise</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

import defaultLogo from '~/assets/images/banner.jpeg'

const companyLogo = ref(defaultLogo)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const loading = ref(false)

const authStore = useAuthStore()
const router = useRouter()

// Fallback nếu người dùng chưa bỏ ảnh logo.png vào thư mục assets
const handleImageError = () => {
  console.warn('Chưa tìm thấy file logo tại assets/images/logo.png')
}

const handleLogin = async () => {
  if (!email.value || !password.value) return

  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.login(email.value, password.value)

    router.push('/dashboard')
  } catch (err) {
    errorMessage.value =
      typeof err === 'string' ? err : 'Tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại!'
  } finally {
    loading.value = false
  }
}
</script>
