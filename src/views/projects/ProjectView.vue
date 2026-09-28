<template>
  <div class="p-6 bg-slate-50/60 min-h-screen text-slate-700 space-y-6">
    <!-- HEADER TRANG -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-800">Quản Lý Dự Án</h1>
        <p class="text-xs text-slate-500 mt-0.5">
          Danh sách các dự án, phân khu (Zones) và chi tiết tầng (Floors)
        </p>
      </div>

      {{authStore.canDoAction('project', 'CREATE')}}
      <button
        v-if="authStore.hasPermission('project', 'CREATE')"
        @click="openModal()"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all duration-200 cursor-pointer active:scale-95"
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
        <span>Thêm Dự Án Mới</span>
      </button>
    </div>

    <!-- FILTER & SEARCH BAR -->
    <div
      class="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm"
    >
      <div class="relative w-full sm:w-80">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Tìm theo tên hoặc mã dự án..."
          class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition"
        />
        <span class="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
        <span class="text-xs text-slate-500">Hiển thị:</span>
        <select
          v-model="pageSize"
          @change="changePageSize"
          class="px-3 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition cursor-pointer"
        >
          <option :value="6">6 dự án / trang</option>
          <option :value="12">12 dự án / trang</option>
          <option :value="24">24 dự án / trang</option>
        </select>
      </div>
    </div>

    <!-- DANH SÁCH DỰ ÁN (GRID CARDS) -->
    <div v-if="projectList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="p in projectList"
        :key="p.id"
        class="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
      >
        <!-- Thumbnail Ảnh Dự án -->
        <div class="h-40 bg-slate-100 relative overflow-hidden flex items-center justify-center">
          <img
            v-if="p.image"
            :src="p.image"
            class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          <div v-else class="flex flex-col items-center justify-center text-slate-400 gap-1">
            <span class="text-2xl">🏢</span>
            <span class="text-[11px] font-medium">Chưa có ảnh dự án</span>
          </div>
          <span
            class="absolute top-3 right-3 bg-slate-900/70 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono tracking-wider shadow-xs"
          >
            {{ p.code }}
          </span>
        </div>

        <!-- Thông tin Dự án -->
        <div class="p-5 flex-1 space-y-3">
          <h3
            class="font-bold text-slate-800 text-base line-clamp-1 group-hover:text-blue-600 transition-colors"
          >
            {{ p.name }}
          </h3>
          <p class="text-xs text-slate-500 flex items-center gap-1.5 line-clamp-1">
            <span>📍</span>
            <span>{{ p.address || 'Chưa cập nhật địa chỉ' }}</span>
          </p>

          <!-- Cây Zone & Floor -->
          <div class="pt-3 border-t border-slate-100 space-y-2">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
              >Cấu trúc Phân Khu:</span
            >
            <div v-if="p.zones && p.zones.length" class="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              <div
                v-for="z in p.zones"
                :key="z.id"
                class="text-xs bg-slate-50/80 p-2.5 rounded-xl border border-slate-100"
              >
                <div class="font-semibold text-slate-700 flex items-center justify-between">
                  <span>🏢 {{ z.name }}</span>
                  <span
                    class="text-[10px] text-blue-600 font-mono bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100"
                    >{{ z.code }}</span
                  >
                </div>
                <div
                  v-if="z.floors && z.floors.length"
                  class="flex flex-wrap gap-1.5 mt-2 pl-2 border-l-2 border-slate-200"
                >
                  <span
                    v-for="f in z.floors"
                    :key="f.id"
                    class="px-2 py-0.5 bg-white border border-slate-200/60 text-slate-600 text-[10px] rounded-md font-medium shadow-2xs"
                  >
                    {{ f.name }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="text-xs text-slate-300 italic">Chưa thiết lập Zone</div>
          </div>
        </div>

        <!-- Thao tác Footer Card -->
        <div class="p-3.5 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-2">
          <button
            v-if="authStore.hasPermission('project', 'UPDATE')"
            @click="openModal(p)"
            class="px-3 py-1.5 bg-amber-50 hover:bg-amber-100/80 text-amber-600 border border-amber-100 text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Sửa
          </button>
          <button
            v-if="authStore.hasPermission('project', 'DELETE')"
            @click="handleDelete(p.id)"
            class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100/80 text-rose-600 border border-rose-100 text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
      <p class="text-xs text-slate-400">Không tìm thấy dự án nào phù hợp!</p>
    </div>

    <!-- THANH PHÂN TRANG (PAGINATION BAR) -->
    <div
      v-if="totalProjects > 0"
      class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-slate-500"
    >
      <span>
        Hiển thị trang <b class="text-slate-700">{{ currentPage }}</b> /
        <b class="text-slate-700">{{ totalPages }}</b> (Tổng
        <b class="text-slate-700">{{ totalProjects }}</b> dự án)
      </span>

      <div class="inline-flex items-center gap-1.5">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1.5 font-semibold rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
        >
          ‹ Trước
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click="changePage(page)"
          :class="[
            'px-3 py-1.5 font-semibold rounded-xl transition-all cursor-pointer',
            currentPage === page
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1.5 font-semibold rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
        >
          Sau ›
        </button>
      </div>
    </div>

    <!-- MODAL FORM THÊM / SỬA DỰ ÁN -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
    >
      <div
        class="bg-white border border-slate-100 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <!-- HEADER MODAL -->
        <div
          class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"
        >
          <h3 class="text-base font-bold text-slate-800">
            {{ isEdit ? 'Chỉnh Sửa Dự Án' : 'Thêm Dự Án Mới' }}
          </h3>
          <button
            @click="showModal = false"
            class="text-slate-400 hover:text-slate-600 font-bold text-base transition"
          >
            ✕
          </button>
        </div>

        <!-- FORM BODY -->
        <form @submit.prevent="saveProject" class="flex flex-col flex-1 overflow-hidden text-xs">
          <div class="p-6 overflow-y-auto space-y-4 flex-1">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-600 mb-1.5">Mã dự án *</label>
                <input
                  v-model="formData.code"
                  type="text"
                  required
                  placeholder="PRJ-01"
                  class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 font-mono transition"
                />
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1.5">Tên dự án *</label>
                <input
                  v-model="formData.name"
                  type="text"
                  required
                  placeholder="Tòa nhà TechBuilding"
                  class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1.5">Địa chỉ</label>
              <input
                v-model="formData.address"
                type="text"
                placeholder="Hà Nội, Việt Nam"
                class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1.5">Ảnh đại diện dự án</label>
              <input
                type="file"
                @change="handleFileChange"
                accept="image/*"
                class="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-blue-50 file:text-blue-600 font-medium file:cursor-pointer"
              />
            </div>

            <!-- CẤU TRÚC ZONES & FLOORS -->
            <div class="pt-3 border-t border-slate-100 space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-800"
                  >Cấu trúc Phân Khu (Zones) & Tầng (Floors)</span
                >
                <button
                  type="button"
                  @click="addZone"
                  class="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2.5 py-1 rounded-lg font-semibold border border-blue-100 transition cursor-pointer"
                >
                  + Thêm Zone
                </button>
              </div>

              <div
                v-for="(z, zIndex) in formData.zones"
                :key="zIndex"
                class="p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-2"
              >
                <div class="flex items-center gap-2">
                  <input
                    v-model="z.code"
                    placeholder="Mã Zone (Zone-A)"
                    required
                    class="w-1/3 px-3 py-1.5 bg-white border border-slate-200 rounded-xl outline-none text-xs font-mono"
                  />
                  <input
                    v-model="z.name"
                    placeholder="Tên Zone (Khu A)"
                    required
                    class="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl outline-none text-xs"
                  />
                  <button
                    type="button"
                    @click="removeZone(zIndex)"
                    class="text-rose-500 hover:text-rose-700 font-medium text-xs px-2 cursor-pointer"
                  >
                    Xóa
                  </button>
                </div>

                <div class="pl-4 border-l-2 border-blue-400 space-y-2 pt-1">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold text-slate-400">Tầng thuộc Zone này:</span>
                    <button
                      type="button"
                      @click="addFloor(zIndex)"
                      class="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      + Thêm Tầng
                    </button>
                  </div>
                  <div
                    v-for="(f, fIndex) in z.floors"
                    :key="fIndex"
                    class="flex items-center gap-2"
                  >
                    <input
                      v-model="f.code"
                      placeholder="Mã (L01)"
                      required
                      class="w-1/4 px-2.5 py-1 bg-white border border-slate-200 rounded-lg outline-none text-[11px] font-mono"
                    />
                    <input
                      v-model="f.name"
                      placeholder="Tên (Tầng 1)"
                      required
                      class="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg outline-none text-[11px]"
                    />
                    <button
                      type="button"
                      @click="removeFloor(zIndex, fIndex)"
                      class="text-rose-400 hover:text-rose-600 text-[11px] px-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- THÀNH VIÊN THAM GIA -->
            <div class="pt-3 border-t border-slate-100">
              <label class="block font-bold text-slate-800 mb-2"> Thành viên tham gia dự án </label>

              <div
                class="border border-slate-200/80 rounded-2xl p-3 max-h-40 overflow-y-auto space-y-1.5 bg-slate-50/50"
              >
                <div
                  v-for="user in userList"
                  :key="user.id"
                  class="flex items-center justify-between p-1.5 hover:bg-white rounded-xl transition"
                >
                  <label
                    :for="`user-${user.id}`"
                    class="flex items-center cursor-pointer space-x-2.5 text-xs w-full select-none"
                  >
                    <input
                      type="checkbox"
                      :id="`user-${user.id}`"
                      :value="user.id"
                      v-model="selectedUserIds"
                      :disabled="user.is_superuser"
                      class="rounded text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                    />
                    <span class="font-medium text-slate-700"
                      >{{ user.email }} - {{ user.full_name || 'Chưa cập nhật' }}</span
                    >
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- FOOTER ACTION -->
          <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 bg-slate-200/60 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Lưu Dự Án
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '~/stores/ui'

import { getUsers } from '@/api/user'
import { getProjects, addProject, editProject, deleteProject } from '@/api/project'

const uiStore = useUIStore()
const authStore = useAuthStore()

const projectList = ref([])

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(6)
const totalProjects = ref(0)

const showModal = ref(false)
const isEdit = ref(false)
const editingId = ref(null)

const imageFile = ref(null)

const formData = ref({
  code: '',
  name: '',
  address: '',
  zones: []
})

const selectedUserIds = ref([])
const userList = ref([])

const totalPages = computed(() => Math.ceil(totalProjects.value / pageSize.value) || 1)

const fetchProjects = async () => {
  try {
    const data = {
      page: currentPage.value,
      page_size: pageSize.value,
      search: searchQuery.value
    }

    const response = await getProjects(data)

    projectList.value = response.results || []
    totalProjects.value = response.count || 0
  } catch (err) {
    console.error('Lỗi lấy danh sách project:', err)
  }
}

let searchTimeout = null
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchProjects()
  }, 350)
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchProjects()
  }
}

const changePageSize = () => {
  currentPage.value = 1
  fetchProjects()
}

const handleFileChange = (e) => {
  imageFile.value = e.target.files[0]
}

const addZone = () => {
  formData.value.zones.push({ code: '', name: '', floors: [] })
}

const removeZone = (index) => {
  formData.value.zones.splice(index, 1)
}

const addFloor = (zoneIndex) => {
  formData.value.zones[zoneIndex].floors.push({ code: '', name: '' })
}

const removeFloor = (zoneIndex, floorIndex) => {
  formData.value.zones[zoneIndex].floors.splice(floorIndex, 1)
}

const fetchUsers = async () => {
  try {
    const res = await getUsers()
    userList.value = res.results || res.data || res
  } catch (err) {
    console.error('Lỗi lấy danh sách user:', err)
  }
}

const openModal = async (project = null) => {
  imageFile.value = null
  await fetchUsers()

  const superuserIds = userList.value.filter((u) => u.is_superuser).map((u) => u.id)

  if (project) {
    isEdit.value = true
    editingId.value = project.id
    formData.value = JSON.parse(JSON.stringify(project))
    const existingUserIds = project.users || []
    selectedUserIds.value = Array.from(new Set([...existingUserIds, ...superuserIds]))
  } else {
    isEdit.value = false
    editingId.value = null
    formData.value = { code: '', name: '', address: '', zones: [] }
    selectedUserIds.value = [...superuserIds]
  }
  showModal.value = true
}

const saveProject = async () => {
  try {
    const payload = new FormData()
    payload.append('code', formData.value.code)
    payload.append('name', formData.value.name)
    payload.append('address', formData.value.address || '')
    payload.append('zones', JSON.stringify(formData.value.zones || []))
    payload.append('users', JSON.stringify(selectedUserIds.value || []))

    if (imageFile.value instanceof File) {
      payload.append('image', imageFile.value)
    }

    if (isEdit.value) {
      await editProject(editingId.value, payload)
      uiStore.showSuccess('Lưu dự án thành công!')
    } else {
      await addProject(payload)
      uiStore.showSuccess('Thêm dự án thành công!')
    }

    showModal.value = false
    fetchProjects()
  } catch (err) {
    uiStore.showError(err.response?.data?.message || 'Không thể lưu dữ liệu!')
  }
}

const handleDelete = async (id) => {
  uiStore.confirmDelete({
    title: 'Xóa Dự Án',
    message: 'Xóa dự án này sẽ ảnh hưởng tới các Phân khu (Zone) và Tầng liên quan!',
    onConfirm: async () => {
      try {
        await deleteProject(id)
        uiStore.showSuccess('Xóa dự án thành công!')
        fetchProjects()
      } catch (err) {
        uiStore.showError('Có lỗi xảy ra khi xóa dự án!')
      }
    }
  })
}

onMounted(() => {
  fetchProjects()
})
</script>
