<template>
  <div class="p-6 bg-slate-50/60 min-h-screen text-slate-700">
    <!-- HEADER TRANG -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">
          Quản Lý Tài Khoản & Phân Quyền App
        </h1>
        <p class="text-xs text-slate-500 mt-0.5">
          Quản lý người dùng, vai trò hệ thống và gán quyền thao tác chi tiết trên từng App
        </p>
      </div>
      <button
        @click="openUserModal()"
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
        <span>Thêm Tài Khoản Mới</span>
      </button>
    </div>

    <!-- FILTER BAR -->
    <div
      class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex justify-between items-center gap-4"
    >
      <div class="w-full max-w-md relative">
        <input
          v-model="searchQuery"
          @input="fetchUsers"
          type="text"
          placeholder="Tìm kiếm theo email, họ tên..."
          class="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition"
        />
      </div>
      <div class="text-xs text-slate-500">
        Tổng số: <b class="text-slate-700 font-bold">{{ users.length }}</b> người dùng
      </div>
    </div>

    <!-- BẢNG DANH SÁCH USER -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr
              class="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]"
            >
              <th class="py-3.5 px-4">Họ & Tên / Email</th>
              <th class="py-3.5 px-4">Vai Trò (Role)</th>
              <th class="py-3.5 px-4">App Được Cấp & Quyền Thao Tác</th>
              <th class="py-3.5 px-4 text-center">Trạng Thái</th>
              <th class="py-3.5 px-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-600">
            <tr v-if="loading">
              <td colspan="5" class="p-8 text-center text-slate-400">
                Đang tải danh sách tài khoản...
              </td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="5" class="p-8 text-center text-slate-400">
                Không tìm thấy tài khoản nào.
              </td>
            </tr>
            <tr v-for="u in users" :key="u.id" class="hover:bg-blue-50/30 transition-colors">
              <!-- Họ tên & Email -->
              <td class="py-3.5 px-4">
                <div class="font-bold text-slate-800">{{ u.full_name || 'Chưa cập nhật tên' }}</div>
                <div class="text-[11px] text-slate-400 font-mono mt-0.5">{{ u.email }}</div>
              </td>

              <!-- Role -->
              <td class="py-3.5 px-4">
                <span
                  :class="roleBadgeClass(u.role)"
                  class="px-2.5 py-1 text-[11px] font-semibold rounded-full"
                >
                  {{ roleText(u.role) }}
                </span>
              </td>

              <!-- Danh sách App & Permissions -->
              <td class="py-3.5 px-4">
                <div
                  v-if="u.is_superuser || u.role === 'SUPERUSER'"
                  class="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100 inline-block"
                >
                  ⭐ Toàn quyền Superadmin
                </div>
                <div
                  v-else-if="u.app_permissions && u.app_permissions.length"
                  class="flex flex-wrap gap-1.5"
                >
                  <div
                    v-for="perm in u.app_permissions"
                    :key="perm.id"
                    class="bg-slate-50 border border-slate-200/70 text-slate-700 rounded-lg px-2.5 py-1 text-[11px] flex items-center space-x-1"
                  >
                    <span class="font-bold text-slate-800">{{ perm.app_name }}</span>
                    <span
                      class="text-blue-600 font-mono text-[10px] bg-blue-50 px-1 py-0.2 rounded font-semibold"
                    >
                      [{{ (perm.permissions || []).join(', ') || 'read' }}]
                    </span>
                  </div>
                </div>
                <span v-else class="text-[11px] text-slate-300 italic">Chưa được gán App</span>
              </td>

              <!-- Trạng thái active -->
              <td class="py-3.5 px-4 text-center">
                <span
                  :class="
                    u.is_active
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : 'bg-rose-50 text-rose-600 border border-rose-100'
                  "
                  class="px-2.5 py-1 text-[11px] font-semibold rounded-full"
                >
                  {{ u.is_active ? 'Hoạt động' : 'Đã khóa' }}
                </span>
              </td>

              <!-- Thao tác -->
              <td class="py-3.5 px-4 text-right space-x-1.5">
                <button
                  @click="openPermissionModal(u)"
                  class="text-indigo-600 hover:text-indigo-800 font-semibold text-[11px] bg-indigo-50 hover:bg-indigo-100/80 px-2.5 py-1.5 rounded-lg border border-indigo-100 transition cursor-pointer"
                >
                  ⚡ Phân Quyền App
                </button>
                <button
                  @click="openUserModal(u)"
                  class="text-blue-600 hover:text-blue-800 font-semibold text-xs px-2 py-1 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                >
                  Sửa
                </button>
                <button
                  @click="handleDeleteUser(u.id)"
                  class="text-rose-500 hover:text-rose-700 font-semibold text-xs px-2 py-1 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                >
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL 1: THÊM / SỬA THÔNG TIN USER CƠ BẢN -->
    <div
      v-if="showUserModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-center items-center p-4"
    >
      <div
        class="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100"
      >
        <div
          class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"
        >
          <h3 class="text-base font-bold text-slate-800">
            {{ isEditUser ? 'Cập Nhật Tài Khoản' : 'Thêm Mới Tài Khoản' }}
          </h3>
          <button
            @click="showUserModal = false"
            class="text-slate-400 hover:text-slate-600 font-bold text-base transition"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="saveUser" class="p-6 space-y-4 text-xs">
          <div>
            <label class="block font-semibold text-slate-600 mb-1.5">Email (Đăng nhập) *</label>
            <input
              v-model="userForm.email"
              :readonly="isEditUser"
              required
              type="email"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:bg-white focus:border-blue-500 transition"
              placeholder="user@domain.com"
            />
          </div>

          <div v-if="!isEditUser">
            <label class="block font-semibold text-slate-600 mb-1.5">Mật khẩu *</label>
            <input
              v-model="userForm.password"
              required
              type="password"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:bg-white focus:border-blue-500 transition"
              placeholder="••••••••"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-slate-600 mb-1.5">Họ và Tên</label>
              <input
                v-model="userForm.full_name"
                type="text"
                class="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-blue-500 transition"
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1.5">Vai Trò System (Role)</label>
              <select
                v-model="userForm.role"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:bg-white focus:border-blue-500 transition cursor-pointer"
              >
                <option value="SUPERUSER">Superuser (Super Admin)</option>
                <option value="ADMIN">Admin Dự Án</option>
                <option value="STAFF">Staff (Kỹ Sư / NV)</option>
                <option value="CUSTOMER">Customer (Khách Hàng)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-slate-600 mb-1.5">Giới tính</label>
              <select
                v-model="userForm.gender"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:bg-white focus:border-blue-500 transition cursor-pointer"
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1.5">Ngôn ngữ</label>
              <select
                v-model="userForm.language"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:bg-white focus:border-blue-500 transition cursor-pointer"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div class="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="is_active"
              v-model="userForm.is_active"
              class="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
            />
            <label for="is_active" class="text-xs font-semibold text-slate-700 cursor-pointer"
              >Kích hoạt tài khoản này</label
            >
          </div>

          <div class="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              @click="showUserModal = false"
              class="px-4 py-2 text-xs text-slate-600 hover:bg-slate-200/60 rounded-xl transition font-semibold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-5 py-2 text-xs bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Lưu Tài Khoản
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL 2: PHÂN QUYỀN APP VÀ HÀNH ĐỘNG CHI TIẾT -->
    <div
      v-if="showPermModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-center items-center p-4"
    >
      <div
        class="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]"
      >
        <div
          class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"
        >
          <h3 class="text-base font-bold text-slate-800">
            Phân Quyền Cho: <span class="text-blue-600 font-mono">{{ editingUser.email }}</span>
          </h3>
          <button
            @click="showPermModal = false"
            class="text-slate-400 hover:text-slate-600 font-bold text-base transition"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="savePermissions" class="flex flex-col flex-1 overflow-hidden">
          <div class="p-6 overflow-y-auto space-y-3 flex-1">
            <div
              v-for="app in allApps"
              :key="app.id"
              class="rounded-2xl p-4 transition-all border"
              :class="
                selectedAppIds.includes(app.id)
                  ? 'bg-blue-50/30 border-blue-200/80 shadow-xs'
                  : 'bg-slate-50/50 border-slate-100'
              "
            >
              <!-- Chọn App -->
              <div class="flex items-center justify-between">
                <label
                  class="flex items-center space-x-2.5 cursor-pointer font-bold text-xs text-slate-800"
                >
                  <input
                    type="checkbox"
                    :value="app.id"
                    v-model="selectedAppIds"
                    class="rounded text-blue-600 focus:ring-blue-500/20 w-4 h-4 cursor-pointer"
                  />
                  <span>{{ app.name }}</span>
                  <span
                    class="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-semibold border border-blue-100/50"
                    >({{ app.code }})</span
                  >
                </label>
              </div>

              <!-- Chọn Hành Động khi App được tick -->
              <div
                v-if="selectedAppIds.includes(app.id)"
                class="mt-3 pt-3 border-t border-blue-100/60 pl-6 space-y-1.5"
              >
                <div class="text-[11px] font-semibold text-slate-500 mb-1">Hành động cho phép:</div>
                <div class="flex flex-wrap gap-3 text-xs">
                  <label
                    v-for="act in ACTION_LIST"
                    :key="act.value"
                    class="flex items-center space-x-1.5 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 hover:border-blue-300 transition"
                  >
                    <input
                      type="checkbox"
                      :value="act.value"
                      v-model="actionsMap[app.id]"
                      class="rounded text-blue-600 cursor-pointer"
                    />
                    <span class="text-slate-700 text-[11px] font-medium">{{ act.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
            <button
              type="button"
              @click="showPermModal = false"
              class="px-4 py-2 text-xs text-slate-600 hover:bg-slate-200/60 rounded-xl transition font-semibold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-5 py-2 text-xs bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Lưu Phân Quyền
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getUsers, addUser, editUser, deleteUser, updateAppUser, getApps } from '~/api/user'
import { useUIStore } from '~/stores/ui'

const uiStore = useUIStore()

// HÀNH ĐỘNG CHO PHÉP CỦA HỆ THỐNG
const ACTION_LIST = [
  { label: 'Xem (read)', value: 'read' },
  { label: 'Thêm (create)', value: 'create' },
  { label: 'Sửa (update)', value: 'update' },
  { label: 'Xóa (delete)', value: 'delete' },
  { label: 'Duyệt (approve)', value: 'approve' }
]

// STATE
const loading = ref(false)
const users = ref([])
const allApps = ref([])
const searchQuery = ref('')

// STATE MODAL USER CƠ BẢN
const showUserModal = ref(false)
const isEditUser = ref(false)
const editingUserId = ref(null)
const userForm = reactive({
  email: '',
  password: '',
  full_name: '',
  role: 'STAFF',
  gender: 'OTHER',
  language: 'vi',
  is_active: true
})

// STATE MODAL PERMISSION
const showPermModal = ref(false)
const editingUser = ref(null)
const selectedAppIds = ref([])
const actionsMap = reactive({})

// FETCH DATA
const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await getUsers({
      params: { search: searchQuery.value || undefined }
    })
    users.value = res.results || res.data || res
  } catch (err) {
    console.error('Lỗi tải danh sách users:', err)
  } finally {
    loading.value = false
  }
}

const fetchApps = async () => {
  try {
    const res = await getApps()
    allApps.value = res.results || res.data || res
  } catch (err) {
    console.error('Lỗi tải danh sách apps:', err)
  }
}

// XỬ LÝ CRUD USER CƠ BẢN
const openUserModal = (user = null) => {
  if (user) {
    isEditUser.value = true
    editingUserId.value = user.id
    Object.assign(userForm, {
      email: user.email,
      password: '',
      full_name: user.full_name || '',
      role: user.role || 'STAFF',
      gender: user.gender || 'OTHER',
      language: user.language || 'vi',
      is_active: user.is_active ?? true
    })
  } else {
    isEditUser.value = false
    editingUserId.value = null
    Object.assign(userForm, {
      email: '',
      password: '',
      full_name: '',
      role: 'STAFF',
      gender: 'OTHER',
      language: 'vi',
      is_active: true
    })
  }
  showUserModal.value = true
}

const saveUser = async () => {
  try {
    if (isEditUser.value) {
      const payload = { ...userForm }
      delete payload.password // Khi sửa không gửi đè mật khẩu rỗng
      await editUser(editingUserId.value, payload)
      uiStore.showSuccess('Lưu tài khoản thành công!')
    } else {
      await addUser(userForm)
      uiStore.showSuccess('Thêm tài khoản thành công!')
    }
    showUserModal.value = false
    fetchUsers()
  } catch (err) {
    uiStore.showError(err.response?.data?.message || 'Không thể lưu dữ liệu!')
  }
}

const handleDeleteUser = async (id) => {
  uiStore.confirmDelete({
    title: 'Xóa tài khoản',
    message: 'Bạn có chắc chắn muốn xóa tài khoản này?',
    onConfirm: async () => {
      try {
        await deleteUser(id)
        uiStore.showSuccess('Xóa tài khoản thành công!')
        fetchProjects()
      } catch (err) {
        uiStore.showError('Có lỗi xảy ra khi xóa tài khoản!')
      }
    }
  })
}

// XỬ LÝ PHÂN QUYỀN APP & HÀNH ĐỘNG
const openPermissionModal = (user) => {
  editingUser.value = user

  // 1. Lấy mảng App IDs
  selectedAppIds.value = (user.apps || []).map((a) => (typeof a === 'object' ? a.id : a))

  // 2. Điền lại permissions cũ
  allApps.value.forEach((app) => {
    const existingPerm = (user.app_permissions || []).find((p) => p.app === app.id)
    actionsMap[app.id] = existingPerm ? [...existingPerm.permissions] : ['read']
  })

  showPermModal.value = true
}

const savePermissions = async () => {
  try {
    const permissionsPayload = selectedAppIds.value.map((appId) => ({
      app_id: appId,
      actions: actionsMap[appId] || ['read']
    }))

    await updateAppUser(editingUser.value.id, {
      apps: selectedAppIds.value,
      permissions: permissionsPayload
    })

    alert('Cập nhật thông tin phân quyền thành công!')
    showPermModal.value = false
    fetchUsers()
  } catch (err) {
    alert('Có lỗi khi lưu phân quyền!')
  }
}

// HELPERS UI BADGES
const roleBadgeClass = (role) => {
  switch (role) {
    case 'SUPERUSER':
      return 'bg-purple-50 text-purple-700 border border-purple-100'
    case 'ADMIN':
      return 'bg-blue-50 text-blue-700 border border-blue-100'
    case 'STAFF':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-100'
    default:
      return 'bg-slate-50 text-slate-600 border border-slate-100'
  }
}

const roleText = (role) => {
  switch (role) {
    case 'SUPERUSER':
      return 'Super Admin'
    case 'ADMIN':
      return 'Admin Dự Án'
    case 'STAFF':
      return 'Staff'
    case 'CUSTOMER':
      return 'Customer'
    default:
      return role
  }
}

onMounted(() => {
  fetchApps()
  fetchUsers()
})
</script>
