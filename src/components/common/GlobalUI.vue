<template>
  <Teleport to="body">
    <div
      v-if="uiStore.deleteModal.isOpen"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150"
      >
        <div class="p-6 text-center">
          <div
            class="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>

          <h3 class="text-base font-bold text-slate-800 mb-1">
            {{ uiStore.deleteModal.title }}
          </h3>
          <p class="text-xs text-slate-500 leading-relaxed">
            {{ uiStore.deleteModal.message }}
          </p>
        </div>

        <!-- Footer Action -->
        <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
          <button
            type="button"
            @click="uiStore.closeDeleteModal()"
            :disabled="uiStore.deleteModal.loading"
            class="px-4 py-2 text-xs text-slate-600 hover:bg-slate-200/60 rounded-xl transition font-semibold cursor-pointer disabled:opacity-50"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            @click="handleConfirmDelete"
            :disabled="uiStore.deleteModal.loading"
            class="px-4 py-2 text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition shadow-md shadow-rose-500/20 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <span v-if="uiStore.deleteModal.loading">Đang xóa...</span>
            <span v-else>Đồng Ý Xóa</span>
          </button>
        </div>
      </div>
    </div>

    <Transition name="toast">
      <div
        v-if="uiStore.toast.isOpen"
        class="fixed top-5 right-5 z-50 flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold max-w-md"
        :class="toastStyle"
      >
        <span>{{ toastIcon }}</span>
        <span class="flex-1">{{ uiStore.toast.message }}</span>
        <button
          @click="uiStore.toast.isOpen = false"
          class="opacity-60 hover:opacity-100 font-bold ml-2"
        >
          ✕
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useUIStore } from '~/stores/ui'

const uiStore = useUIStore()

const handleConfirmDelete = async () => {
  if (typeof uiStore.deleteModal.onConfirm === 'function') {
    uiStore.deleteModal.loading = true
    try {
      await uiStore.deleteModal.onConfirm()
    } finally {
      uiStore.closeDeleteModal()
    }
  } else {
    uiStore.closeDeleteModal()
  }
}

// Cấu hình Icon & Màu sắc cho Toast Notification
const toastIcon = computed(() => {
  switch (uiStore.toast.type) {
    case 'success':
      return '✅'
    case 'error':
      return '❌'
    case 'warning':
      return '⚠️'
    default:
      return 'ℹ️'
  }
})

const toastStyle = computed(() => {
  switch (uiStore.toast.type) {
    case 'success':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200'
    case 'error':
      return 'bg-rose-50 text-rose-800 border-rose-200'
    case 'warning':
      return 'bg-amber-50 text-amber-800 border-amber-200'
    default:
      return 'bg-blue-50 text-blue-800 border-blue-200'
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease-out;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
