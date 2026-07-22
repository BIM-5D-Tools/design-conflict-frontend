<template>
  <div 
    v-if="loadingStore.isLoading" 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity"
  >
    <div class="bg-white p-5 rounded-2xl shadow-xl flex flex-col items-center space-y-3">
      <!-- Spinner Icon Tailwind -->
      <div class="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <span class="text-sm font-medium text-gray-700">Đang tải dữ liệu...</span>
    </div>
  </div>
</template>

<script setup>
import { useLoadingStore } from '@/stores/loading'
const loadingStore = useLoadingStore()
</script>