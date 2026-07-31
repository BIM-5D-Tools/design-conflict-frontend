// src/stores/loading.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false)
  const activeRequests = ref(0) // Đếm số request đang chạy để tránh tắt loading sớm khi gọi nhiều API cùng lúc

  function show() {
    activeRequests.value++
    isLoading.value = true
  }

  function hide() {
    activeRequests.value = Math.max(0, activeRequests.value - 1)
    if (activeRequests.value === 0) {
      isLoading.value = false
    }
  }

  return { isLoading, show, hide }
})
