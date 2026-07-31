<template>
  <div class="p-6 bg-slate-50/60 min-h-screen text-slate-700">
    <!-- HEADER TRANG -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Khai Báo Danh Mục App</h1>
        <p class="text-xs text-slate-500 mt-0.5">
          Quản lý các ứng dụng, phân hệ và module chức năng trong hệ thống
        </p>
      </div>
      <button
        @click="openModal()"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-md shadow-blue-500/20 transition-all flex items-center space-x-2 text-xs active:scale-95 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>Khai Báo App Mới</span>
      </button>
    </div>

    <!-- BẢNG DANH SÁCH APP (TABLE CARD) -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr
              class="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]"
            >
              <th class="py-3.5 px-4">Mã App (Code)</th>
              <th class="py-3.5 px-4">Tên Ứng Dụng (Name)</th>
              <th class="py-3.5 px-4">Mô Tả Chức Năng</th>
              <th class="py-3.5 px-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-600">
            <tr v-if="apps.length === 0">
              <td colspan="4" class="p-8 text-center text-slate-400">
                Chưa có ứng dụng nào được khai báo.
              </td>
            </tr>
            <tr v-for="app in apps" :key="app.id" class="hover:bg-blue-50/30 transition-colors">
              <td class="py-3.5 px-4">
                <span
                  class="font-bold text-blue-600 font-mono bg-blue-50/80 px-2.5 py-1 rounded-lg text-[11px] border border-blue-100/50"
                >
                  {{ app.code }}
                </span>
              </td>
              <td class="py-3.5 px-4 font-semibold text-slate-800">
                {{ app.name }}
              </td>
              <td class="py-3.5 px-4 text-slate-500 max-w-md">
                {{ app.description || 'Chưa có mô tả' }}
              </td>
              <td class="py-3.5 px-4 text-right space-x-1.5">
                <button
                  @click="openModal(app)"
                  class="text-blue-600 hover:text-blue-800 font-semibold transition px-2.5 py-1 rounded-lg hover:bg-blue-50 cursor-pointer"
                >
                  Sửa
                </button>
                <button
                  @click="handleDelete(app.id)"
                  class="text-rose-500 hover:text-rose-700 font-semibold transition px-2.5 py-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                >
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL TẠO / SỬA APP -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-center items-center p-4"
    >
      <div
        class="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100"
      >
        <!-- HEADER MODAL -->
        <div
          class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"
        >
          <h3 class="text-base font-bold text-slate-800">
            {{ isEdit ? 'Cập Nhật Khai Báo App' : 'Khai Báo App Mới' }}
          </h3>
          <button
            @click="showModal = false"
            class="text-slate-400 hover:text-slate-600 font-bold text-base transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <!-- FORM BODY -->
        <form @submit.prevent="saveApp" class="p-6 space-y-4 text-xs">
          <div>
            <label class="block font-semibold text-slate-600 mb-1.5">Mã App (Code) *</label>
            <input
              v-model="form.code"
              :readonly="isEdit"
              required
              type="text"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono outline-none focus:bg-white focus:border-blue-500 transition read-only:bg-slate-100/70 read-only:text-slate-500 read-only:cursor-not-allowed"
              placeholder="VD: DESIGN_CONFLICT"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-600 mb-1.5">Tên App (Name) *</label>
            <input
              v-model="form.name"
              required
              type="text"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:bg-white focus:border-blue-500 transition"
              placeholder="VD: Quản Lý Xung Đột Thiết Kế"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-600 mb-1.5">Mô Tả Chức Năng</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:bg-white focus:border-blue-500 transition"
              placeholder="Nhập mô tả tóm tắt về chức năng của ứng dụng này..."
            ></textarea>
          </div>

          <!-- FOOTER ACTION -->
          <div class="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 text-xs text-slate-600 hover:bg-slate-200/60 rounded-xl transition font-semibold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-5 py-2 text-xs bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Lưu App
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getApps, addApp, editApp, deleteApp } from '~/api/user'
import { useUIStore } from '~/stores/ui'

const uiStore = useUIStore()

const apps = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const editingId = ref(null)

const form = reactive({ code: '', name: '', description: '' })

const fetchApps = async () => {
  try {
    const res = await getApps()
    apps.value = res.results || res.data || res
  } catch (err) {
    console.error('Lỗi khi lấy danh sách App:', err)
  }
}

const openModal = (item = null) => {
  if (item) {
    isEdit.value = true
    editingId.value = item.id
    Object.assign(form, {
      code: item.code,
      name: item.name,
      description: item.description || ''
    })
  } else {
    isEdit.value = false
    editingId.value = null
    Object.assign(form, { code: '', name: '', description: '' })
  }
  showModal.value = true
}

const saveApp = async () => {
  try {
    if (isEdit.value) {
      await editApp(editingId.value, form)
      uiStore.showSuccess('Lưu ứng dụng thành công!')
    } else {
      await addApp(form)
      uiStore.showSuccess('Thêm ứng dụng thành công!')
    }
    showModal.value = false
    fetchApps()
  } catch (err) {
    console.error('Lỗi khi lưu App:', err)
    uiStore.showError(err.response?.data?.message || 'Không thể lưu dữ liệu!')
  }
}

const handleDelete = async (id) => {
  uiStore.confirmDelete({
    title: 'Xóa ứng dụng',
    message: 'Bạn có chắc chắn muốn xóa khai báo App này?',
    onConfirm: async () => {
      try {
        await deleteApp(id)
        uiStore.showSuccess('Xóa ứng dụng thành công!')
        fetchProjects()
      } catch (err) {
        uiStore.showError('Có lỗi xảy ra khi xóa ứng dụng!')
      }
    }
  })
}

onMounted(() => fetchApps())
</script>
