import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    deleteModal: {
      isOpen: false,
      title: 'Xác Nhận Xóa',
      message: 'Bạn có chắc chắn muốn xóa bản ghi này? Hành động này không thể hoàn tác.',
      onConfirm: null,
      loading: false
    },
    toast: {
      isOpen: false,
      message: '',
      type: 'success', // 'success' | 'error' | 'warning' | 'info'
      timeoutId: null
    }
  }),

  actions: {
    confirmDelete({ title, message, onConfirm }) {
      this.deleteModal = {
        isOpen: true,
        title: title || 'Xác Nhận Xóa',
        message:
          message || 'Bạn có chắc chắn muốn xóa bản ghi này? Hành động này không thể hoàn tác.',
        onConfirm,
        loading: false
      }
    },

    closeDeleteModal() {
      this.deleteModal.isOpen = false
      this.deleteModal.loading = false
    },

    showToast(message, type = 'success') {
      if (this.toast.timeoutId) clearTimeout(this.toast.timeoutId)

      this.toast = {
        isOpen: true,
        message,
        type,
        timeoutId: setTimeout(() => {
          this.toast.isOpen = false
        }, 3500)
      }
    },

    showSuccess(msg) {
      this.showToast(msg, 'success')
    },
    showError(msg) {
      this.showToast(msg, 'error')
    },
    showWarning(msg) {
      this.showToast(msg, 'warning')
    }
  }
})
