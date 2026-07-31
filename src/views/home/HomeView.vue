<template>
  <div class="p-6 bg-slate-50/60 min-h-screen text-slate-700 space-y-6">
    <!-- HEADER TRANG -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">
          Dashboard Thống Kê & Báo Cáo
        </h1>
      </div>

      <!-- BỘ LỌC THỜI GIAN & DỰ ÁN DÙNG CHUNG -->
      <div
        class="flex flex-wrap items-center gap-3 bg-white p-2.5 rounded-2xl shadow-sm border border-slate-100"
      >
        <!-- Lọc Dự án -->
        <div class="flex items-center space-x-1.5 text-xs">
          <span class="text-slate-400 font-medium">Dự án:</span>
          <select
            v-model="selectedProject"
            @change="loadDashboardData"
            class="bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5 text-xs font-semibold outline-none focus:border-blue-500"
          >
            <option value="">Tất cả dự án</option>
            <option v-for="p in projectList" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>

        <!-- Lọc Khoảng thời gian -->
        <div class="flex items-center space-x-1.5 text-xs">
          <span class="text-slate-400 font-medium">Thời gian:</span>
          <select
            v-model="selectedTimeRange"
            @change="loadDashboardData"
            class="bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5 text-xs font-semibold outline-none focus:border-blue-500"
          >
            <option value="this_month">Tháng 7 này (Tháng hiện tại)</option>
            <option value="last_month">Tháng trước (Tháng 6)</option>
            <option value="this_quarter">Quý này (Q3/2026)</option>
            <option value="this_year">Năm 2026</option>
            <option value="all">Tất cả thời gian</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 📊 KHU VỰC 1: CÁC THẺ KPI STATS (CẢ 2 VIEW ĐỀU CÓ) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Tổng số xung đột -->
      <div
        class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
      >
        <div>
          <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Tổng Xung Đột
          </p>
          <h3 class="text-2xl font-bold text-slate-800 mt-1 font-mono">{{ stats.total }}</h3>
          <p class="text-[11px] text-slate-400 mt-1">Trong khoảng thời gian chọn</p>
        </div>
        <div
          class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl"
        >
          📌
        </div>
      </div>

      <!-- Xung đột mới -->
      <div
        class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
      >
        <div>
          <p class="text-[11px] font-semibold text-rose-500 uppercase tracking-wider">
            Mới Phát Hiện
          </p>
          <h3 class="text-2xl font-bold text-rose-600 mt-1 font-mono">{{ stats.newCount }}</h3>
          <p class="text-[11px] text-rose-400 mt-1">Cần xem xét xử lý</p>
        </div>
        <div
          class="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center text-xl"
        >
          🚨
        </div>
      </div>

      <!-- Đang xử lý -->
      <div
        class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
      >
        <div>
          <p class="text-[11px] font-semibold text-amber-500 uppercase tracking-wider">
            Đang Xử Lý / Chờ
          </p>
          <h3 class="text-2xl font-bold text-amber-600 mt-1 font-mono">{{ stats.pendingCount }}</h3>
          <p class="text-[11px] text-amber-400 mt-1">Đã có phương án</p>
        </div>
        <div
          class="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-xl"
        >
          ⏳
        </div>
      </div>

      <!-- Hoàn thành -->
      <div
        class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
      >
        <div>
          <p class="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
            Đã Hoàn Thành
          </p>
          <h3 class="text-2xl font-bold text-emerald-600 mt-1 font-mono">{{ stats.doneCount }}</h3>
          <p class="text-[11px] text-emerald-500 mt-1">
            Tỷ lệ giải quyết: <b>{{ completionRate }}%</b>
          </p>
        </div>
        <div
          class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl"
        >
          ✅
        </div>
      </div>
    </div>

    <!-- 📊 KHU VỰC 2: BIỂU ĐỒ CHÍNH (THỐNG KÊ THEO DỰ ÁN & TRẠNG THÁI) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- BIỂU ĐỒ CỘT CẢ 2 USER ĐỀU XEM (CHIẾM 2 CỘT) -->
      <div
        class="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between"
      >
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-base font-bold text-slate-800">Thống Kê Xung Đột Theo Dự Án</h3>
            <p class="text-xs text-slate-400 mt-0.5">
              Phân rã trạng thái Mới / Chờ / Hoàn thành từng dự án
            </p>
          </div>
          <div class="flex items-center space-x-3 text-[11px] font-medium">
            <span class="flex items-center"
              ><span class="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block mr-1"></span>Mới</span
            >
            <span class="flex items-center"
              ><span class="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block mr-1"></span
              >Chờ</span
            >
            <span class="flex items-center"
              ><span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block mr-1"></span
              >Xong</span
            >
          </div>
        </div>

        <!-- Render Biểu đồ Cột Stacked Bar Chart -->
        <div class="h-72 relative">
          <Bar v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
          <div v-else class="h-full flex items-center justify-center text-xs text-slate-400">
            Đang tải dữ liệu biểu đồ...
          </div>
        </div>
      </div>

      <!-- 🟢 KHU VỰC PHÂN TÁCH GÓC NHÌN CUSTOMER VS STAFF (CỘT THỨ 3) -->

      <!-- GÓC NHÌN A: CUSTOMER VIEW (Tóm Tắt & Tỷ Lệ Giải Quyết) -->
      <div
        v-if="isCustomer"
        class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4"
      >
        <div>
          <h3 class="text-base font-bold text-slate-800">Tóm Tắt Tiến Độ Tiến Hành</h3>
          <p class="text-xs text-slate-400 mt-0.5">
            Đánh giá mức độ phản hồi xử lý va chạm thiết kế
          </p>
        </div>

        <!-- Vòng Tiến Độ Tỷ Lệ Hoàn Thành -->
        <div class="flex flex-col items-center justify-center py-4">
          <div
            class="relative w-36 h-36 flex items-center justify-center rounded-full bg-slate-50 border-8 border-emerald-500/20"
          >
            <div class="text-center">
              <span class="text-3xl font-extrabold text-slate-800 font-mono"
                >{{ completionRate }}%</span
              >
              <span class="block text-[10px] text-slate-400 uppercase font-semibold">Đã xử lý</span>
            </div>
          </div>
        </div>

        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-500">Dự án theo dõi:</span>
            <span class="font-bold text-slate-700">{{ projectList.length }} dự án</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Cần bạn cho ý kiến:</span>
            <span class="font-bold text-blue-600">{{ stats.pendingCount }} xung đột</span>
          </div>
        </div>
      </div>

      <!-- 🟢 GÓC NHÌN B: STAFF / ADMIN VIEW (BIỂU ĐỒ TRÒN THEO BỘ MÔN + BÁO CÁO NÓNG) -->
      <div
        v-else
        class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between"
      >
        <div>
          <h3 class="text-base font-bold text-slate-800">Phân Loại Theo Bộ Môn</h3>
          <p class="text-xs text-slate-400 mt-0.5">
            Tỷ lệ lỗi thuộc các khối Kết cấu, Cơ điện, Kiến trúc
          </p>
        </div>

        <!-- Render Biểu đồ Tròn Donut Chart -->
        <div class="h-56 relative my-2">
          <Doughnut
            v-if="categoryChartData.labels.length"
            :data="categoryChartData"
            :options="donutOptions"
          />
        </div>

        <div class="text-[11px] text-slate-400 text-center">
          Bộ môn va chạm nhiều nhất: <b class="text-rose-600 font-bold">KẾT CẤU THÉP (STE)</b>
        </div>
      </div>
    </div>

    <!-- 📊 KHU VỰC 3: DÀNH RIÊNG CHO STAFF / ADMIN (DANH SÁCH SỰ CỐ CẦN XỬ LÝ GẤP) -->
    <div
      v-if="!isCustomer"
      class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
    >
      <div class="p-5 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 class="text-base font-bold text-slate-800">
            🔥 Xung Đột Cần Ưu Tiên Xử Lý Gấp (Mới / Chờ)
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">
            Danh sách các va chạm thiết kế vừa phát sinh gần đây
          </p>
        </div>
        <router-link
          to="/design-conflicts"
          class="text-xs text-blue-600 font-semibold hover:underline"
        >
          Xem tất cả →
        </router-link>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr
              class="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]"
            >
              <th class="py-3 px-4">Mã Code</th>
              <th class="py-3 px-4">Tên Vấn Đề</th>
              <th class="py-3 px-4">Dự Án</th>
              <th class="py-3 px-4">Bộ Môn</th>
              <th class="py-3 px-4 text-center">Trạng Thái</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-600">
            <tr
              v-for="item in recentUrgentConflicts"
              :key="item.id"
              class="hover:bg-blue-50/30 transition"
            >
              <td class="py-3 px-4 font-bold text-blue-600 font-mono">{{ item.code }}</td>
              <td class="py-3 px-4 font-semibold text-slate-800">{{ item.name }}</td>
              <td class="py-3 px-4">{{ item.project_name }}</td>
              <td class="py-3 px-4">
                <span class="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold">{{
                  item.category
                }}</span>
              </td>
              <td class="py-3 px-4 text-center">
                <span
                  :class="
                    item.status === 'NEW'
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-amber-50 text-amber-600'
                  "
                  class="px-2.5 py-0.5 rounded-full font-semibold"
                >
                  {{ item.status === 'NEW' ? 'Mới' : 'Chờ xử lý' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { getProjects } from '~/api/project'
import { getConflicts } from '~/api/design'

// Import thư viện Chart.js cho Vue 3
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js'
import { Bar, Doughnut } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const authStore = useAuthStore()

// Phân biệt Role
const isCustomer = computed(() => authStore.user && authStore.user.role === 'CUSTOMER')

// State Bộ Lọc
const projectList = ref([])
const selectedProject = ref('')
const selectedTimeRange = ref('this_month')

// State Thống Kê
const stats = reactive({
  total: 0,
  newCount: 0,
  pendingCount: 0,
  doneCount: 0
})

const recentUrgentConflicts = ref([])

// Tỷ lệ hoàn thành %
const completionRate = computed(() => {
  if (!stats.total) return 0
  return Math.round((stats.doneCount / stats.total) * 100)
})

// 🟢 DỮ LIỆU BIỂU ĐỒ CỘT (STACKED BAR CHART)
const chartData = reactive({
  labels: [],
  datasets: []
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: { stacked: true, grid: { display: false } },
    y: { stacked: true, grid: { color: '#f1f5f9' } }
  }
}

// 🟢 DỮ LIỆU BIỂU ĐỒ TRÒN (DONUT CHART CHO STAFF)
const categoryChartData = reactive({
  labels: ['Kết cấu thép (STE)', 'Kiến trúc (ARC)', 'Cơ điện (MEP)', 'Cấp thoát nước (PLB)'],
  datasets: [
    {
      backgroundColor: ['#f43f5e', '#3b82f6', '#f59e0b', '#10b981'],
      data: [12, 8, 5, 3]
    }
  ]
})

const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
  }
}

// FETCH DATA
const loadDashboardData = async () => {
  try {
    // 1. Tải danh sách dự án
    const projRes = await getProjects()
    projectList.value = projRes.results || projRes.data || projRes

    // 2. Tải danh sách xung đột để tính toán thống kê
    const conflictRes = await getConflicts({
      project: selectedProject.value || undefined,
      page_size: 1000
    })

    const list = conflictRes.results || conflictRes.data || conflictRes || []

    // 3. Tính toán các chỉ số KPI
    stats.total = list.length
    stats.newCount = list.filter((i) => i.status === 'NEW').length
    stats.pendingCount = list.filter((i) => i.status === 'PENDING').length
    stats.doneCount = list.filter((i) => i.status === 'DONE').length

    // Lọc sự cố gấp cho Staff
    recentUrgentConflicts.value = list
      .filter((i) => i.status === 'NEW' || i.status === 'PENDING')
      .slice(0, 5)
      .map((i) => ({
        ...i,
        project_name: projectList.value.find((p) => p.id === i.project)?.name || 'Dự án'
      }))

    // 4. Render dữ liệu cho Biểu đồ Cột theo từng Dự Án
    const labels = projectList.value.map((p) => p.name)
    const newSeries = []
    const pendingSeries = []
    const doneSeries = []

    projectList.value.forEach((p) => {
      const pConflicts = list.filter((i) => i.project === p.id)
      newSeries.push(pConflicts.filter((i) => i.status === 'NEW').length)
      pendingSeries.push(pConflicts.filter((i) => i.status === 'PENDING').length)
      doneSeries.push(pConflicts.filter((i) => i.status === 'DONE').length)
    })

    chartData.labels = labels
    chartData.datasets = [
      { label: 'Mới', backgroundColor: '#f43f5e', data: newSeries, borderRadius: 4 },
      { label: 'Chờ xử lý', backgroundColor: '#f59e0b', data: pendingSeries, borderRadius: 4 },
      { label: 'Hoàn thành', backgroundColor: '#10b981', data: doneSeries, borderRadius: 4 }
    ]
  } catch (err) {
    console.error('Lỗi tải dữ liệu Dashboard:', err)
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>
