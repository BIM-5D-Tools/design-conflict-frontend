<template>
  <div class="p-6 bg-slate-50/60 min-h-screen text-slate-700">
    <!-- HEADER TRANG -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Quản Lý Xung Đột Thiết Kế</h1>
        <p class="text-xs text-slate-500 mt-0.5">
          Theo dõi, phát hiện và ghi nhận phương án xử lý lỗi thiết kế BIM/CAD
        </p>
      </div>
      <div class="flex flex-col md:flex-row md:items-center gap-4">
        <!-- Nút Thêm Mới: Ẩn với CUSTOMER hoặc người không có quyền Create -->
        <button
          v-if="!isCustomer && authStore.canDoAction(app, 'create')"
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
          <span>Thêm Xung Đột Mới</span>
        </button>
        <!-- DROPDOWN BUTTON XUẤT BÁO CÁO (EXCEL & PDF) -->
        <div v-if="!isCustomer" class="relative inline-block text-left" ref="dropdownRef">
          <button
            type="button"
            @click="isDropdownOpen = !isDropdownOpen"
            :disabled="exporting"
            class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-2 text-xs active:scale-95 cursor-pointer disabled:opacity-50"
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>{{ exporting ? 'Đang xuất file...' : 'Xuất Báo Cáo' }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <!-- Menu lựa chọn định dạng -->
          <div
            v-if="isDropdownOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100"
          >
            <button
              @click="triggerExport('excel')"
              class="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center space-x-2.5 transition font-semibold"
            >
              <span class="text-base">📊</span>
              <span>Xuất file Excel (.xlsx)</span>
            </button>
            <button
              @click="triggerExport('pdf')"
              class="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-rose-50 hover:text-rose-700 flex items-center space-x-2.5 transition font-semibold"
            >
              <span class="text-base">📑</span>
              <span>Xuất file PDF (.pdf)</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- BỘ LỌC (FILTER BAR CARD) -->
    <div
      class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4"
    >
      <div>
        <label class="block text-xs font-semibold text-slate-500 mb-1.5">Tìm kiếm</label>
        <input
          v-model="filters.search"
          @input="handleFilterChange"
          type="text"
          placeholder="Mã, tên, trục..."
          class="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-500 mb-1.5">Dự án</label>
        <select
          v-model="filters.project"
          @change="handleProjectFilterChange"
          class="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition cursor-pointer"
        >
          <option value="">Tất cả dự án</option>
          <option v-for="p in projectList" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-500 mb-1.5">Phân khu (Zone)</label>
        <select
          v-model="filters.zone"
          @change="handleFilterChange"
          class="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition cursor-pointer"
        >
          <option value="">Tất cả phân khu</option>
          <option v-for="z in filteredZoneList" :key="z.id" :value="z.id">{{ z.name }}</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-500 mb-1.5">Hạng mục / Bộ môn</label>
        <select
          v-model="filters.category"
          @change="handleFilterChange"
          class="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition cursor-pointer"
        >
          <option value="">Tất cả hạng mục</option>
          <option v-for="cat in CATEGORY_OPTIONS" :key="cat.code" :value="cat.code">
            {{ cat.label }} ({{ cat.code }})
          </option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-500 mb-1.5">Trạng thái</label>
        <select
          v-model="filters.status"
          @change="handleFilterChange"
          class="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition cursor-pointer"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="NEW">Mới</option>
          <option value="PENDING">Chờ xử lý</option>
          <option value="DONE">Hoàn thành</option>
        </select>
      </div>
    </div>

    <!-- BẢNG DANH SÁCH (TABLE CARD) -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr
              class="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]"
            >
              <th class="py-3.5 px-4">Mã Code</th>
              <th class="py-3.5 px-4">Tên xung đột</th>
              <th class="py-3.5 px-4">Dự án / Phân khu</th>
              <th class="py-3.5 px-4">Bộ môn / Vị trí</th>
              <th class="py-3.5 px-4">Mô tả & Phương án</th>
              <th class="py-3.5 px-4">Ý kiến phối hợp</th>
              <th class="py-3.5 px-4">Hình ảnh</th>
              <th class="py-3.5 px-4 text-center">Trạng thái</th>
              <th class="py-3.5 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-600">
            <tr v-if="loading">
              <td colspan="9" class="p-8 text-center text-slate-400">Đang tải dữ liệu...</td>
            </tr>
            <tr v-else-if="conflicts.length === 0">
              <td colspan="9" class="p-8 text-center text-slate-400">
                Không tìm thấy xung đột thiết kế nào.
              </td>
            </tr>
            <tr
              v-for="item in conflicts"
              :key="item.id"
              class="hover:bg-blue-50/30 transition-colors"
            >
              <td class="py-3.5 px-4">
                <span
                  class="font-bold text-blue-600 font-mono bg-blue-50/80 px-2.5 py-1 rounded-lg text-[11px] border border-blue-100/50"
                >
                  {{ item.code }}
                </span>
              </td>
              <td class="py-3.5 px-4 font-semibold text-slate-800 max-w-[180px]">
                {{ item.name }}
              </td>

              <td class="py-3.5 px-4">
                <div class="font-medium text-slate-800">{{ getProjectName(item.project) }}</div>
                <div class="text-[11px] text-slate-400 mt-0.5">{{ getZoneName(item.zone) }}</div>
              </td>

              <td class="py-3.5 px-4">
                <span
                  class="inline-block bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded-md border border-indigo-100/60 mb-1"
                >
                  {{ getCategoryLabel(item.category) }}
                </span>
                <div class="text-[11px] text-slate-400">Trục: {{ item.axis || '-' }}</div>
                <div class="text-[11px] text-slate-400">
                  Tầng: {{ item.floor_name || getFloorName(item.floor) || '-' }}
                </div>
              </td>

              <!-- CỘT 1: MÔ TẢ & PHƯƠNG ÁN -->
              <td class="py-3.5 px-4 max-w-[220px] space-y-1.5 text-xs">
                <!-- Lỗi Mô Tả -->
                <p
                  :title="item.description"
                  @click="toggleExpand(item.id, 'desc')"
                  :class="[
                    expandedMap[`${item.id}_desc`] ? '' : 'line-clamp-2',
                    'text-slate-700 cursor-pointer hover:text-slate-900 transition-all select-none'
                  ]"
                >
                  <span class="font-bold text-rose-500">Lỗi:</span>
                  {{ item.description || 'Không có mô tả' }}
                </p>

                <!-- Phương Án -->
                <p
                  :title="item.solution"
                  @click="toggleExpand(item.id, 'sol')"
                  :class="[
                    expandedMap[`${item.id}_sol`] ? '' : 'line-clamp-2',
                    'text-slate-500 cursor-pointer hover:text-slate-700 transition-all select-none'
                  ]"
                >
                  <span class="font-bold text-emerald-600">PA:</span>
                  {{ item.solution || 'Chưa có phương án' }}
                </p>
              </td>

              <!-- CỘT 2: Ý KIẾN PHỐI HỢP -->
              <td class="py-3.5 px-4 max-w-[200px] text-xs">
                <p
                  :title="item.comment"
                  @click="toggleExpand(item.id, 'com')"
                  :class="[
                    expandedMap[`${item.id}_com`] ? '' : 'line-clamp-2',
                    'text-slate-600 cursor-pointer hover:text-slate-800 transition-all select-none'
                  ]"
                >
                  <span class="font-bold text-blue-600">Ý kiến:</span>
                  {{ item.comment || 'Chưa có ý kiến' }}
                </p>
              </td>

              <td class="py-3.5 px-4">
                <div
                  v-if="item.images && item.images.length"
                  class="flex items-center space-x-1.5 cursor-pointer"
                  @click="openImageGallery(item.images)"
                >
                  <div
                    class="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-xs hover:scale-105 transition"
                  >
                    <img :src="item.images[0].image" class="w-full h-full object-cover" />
                  </div>
                  <span
                    v-if="item.images.length > 1"
                    class="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded-full"
                  >
                    +{{ item.images.length - 1 }}
                  </span>
                </div>
                <span v-else class="text-slate-300 italic text-[11px]">Không ảnh</span>
              </td>

              <td class="py-3.5 px-4 text-center">
                <span
                  :class="statusBadgeClass(item.status)"
                  class="px-2.5 py-1 text-[11px] font-semibold rounded-full"
                >
                  {{ statusText(item.status) }}
                </span>
              </td>

              <!-- THAO TÁC -->
              <td class="py-3.5 px-4 text-right space-x-1">
                <!-- Nút Sửa: Customer luôn có nút Sửa (nếu được vào trang), Staff/Admin thì dựa theo canDoAction update -->
                <button
                  v-if="isCustomer || authStore.canDoAction(app, 'update')"
                  @click="openModal(item)"
                  class="text-blue-600 hover:text-blue-800 font-semibold transition px-2 py-1 rounded-lg hover:bg-blue-50 cursor-pointer"
                  :title="isCustomer ? 'Ghi ý kiến phản hồi' : 'Sửa xung đột'"
                >
                  {{ isCustomer ? 'Ý kiến' : 'Sửa' }}
                </button>

                <!-- Nút Xóa: Ẩn hoàn toàn với Customer -->
                <button
                  v-if="!isCustomer && authStore.canDoAction(app, 'delete')"
                  @click="handleDelete(item.id)"
                  class="text-rose-500 hover:text-rose-700 font-semibold transition px-2 py-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                >
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div class="p-4 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
        <div>
          Hiển thị tổng số <b class="text-slate-700">{{ totalCount }}</b> bản ghi
        </div>
        <div class="flex items-center space-x-2">
          <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="px-3 py-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 shadow-xs transition cursor-pointer"
          >
            Trang trước
          </button>
          <span class="font-medium text-slate-600">Trang {{ currentPage }} / {{ totalPages }}</span>
          <button
            :disabled="currentPage === totalPages || totalPages === 0"
            @click="changePage(currentPage + 1)"
            class="px-3 py-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 shadow-xs transition cursor-pointer"
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL VIEW GALLERY ẢNH -->
    <div
      v-if="showGalleryModal"
      class="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center p-4"
    >
      <div
        class="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
      >
        <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 class="font-bold text-slate-800 text-sm">
            Danh Sách Ảnh Xung Đột ({{ galleryImages.length }} ảnh)
          </h3>
          <button
            @click="showGalleryModal = false"
            class="text-slate-400 hover:text-slate-700 font-bold text-base px-2"
          >
            ✕
          </button>
        </div>
        <div class="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-950">
          <div
            v-for="(imgObj, idx) in galleryImages"
            :key="imgObj.id || idx"
            class="flex flex-col items-center"
          >
            <div class="text-xs text-slate-400 mb-2">Ảnh #{{ idx + 1 }}</div>
            <img
              :src="imgObj.image"
              class="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-slate-800"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL THÊM / SỬA FORM -->
    <div
      v-if="showFormModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden"
      >
        <!-- HEADER MODAL -->
        <div
          class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"
        >
          <div>
            <h3 class="text-base font-bold text-slate-800">
              {{
                isEdit
                  ? isCustomer
                    ? 'Gửi Ý Kiến Phản Hồi'
                    : 'Cập Nhật Xung Đột Thiết Kế'
                  : 'Thêm Mới Xung Đột'
              }}
            </h3>
            <p v-if="isCustomer" class="text-[11px] text-amber-600 font-medium mt-0.5">
              💡 Bạn đang đăng nhập tài khoản Khách hàng/Đối tác. Bạn chỉ có quyền chỉnh sửa mục "Ý
              Kiến Phối Hợp".
            </p>
          </div>
          <button
            @click="showFormModal = false"
            class="text-slate-400 hover:text-slate-600 font-bold text-base transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <!-- FORM BODY -->
        <form
          @submit.prevent="saveForm"
          class="flex flex-col flex-1 overflow-hidden"
          @paste="handlePaste"
        >
          <div class="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
            <!-- DỰ ÁN & HẠNG MỤC -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-600 mb-1.5">Dự Án *</label>
                <select
                  v-model="form.project"
                  :disabled="isCustomer"
                  required
                  @change="onProjectOrCategoryChange"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:bg-white focus:border-blue-500 transition disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                  <option value="">-- Chọn dự án --</option>
                  <option v-for="p in projectList" :key="p.id" :value="p.id">
                    {{ p.name }} ({{ p.code }})
                  </option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-600 mb-1.5">Bộ Môn / Hạng Mục *</label>
                <select
                  v-model="form.category"
                  :disabled="isCustomer"
                  required
                  @change="onProjectOrCategoryChange"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:bg-white focus:border-blue-500 transition disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                  <option value="">-- Chọn bộ môn --</option>
                  <option v-for="cat in CATEGORY_OPTIONS" :key="cat.code" :value="cat.code">
                    {{ cat.label }} ({{ cat.code }})
                  </option>
                </select>
              </div>
            </div>

            <!-- PHÂN KHU & TẦNG -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-600 mb-1.5">Phân Khu (Zone)</label>
                <select
                  v-model="form.zone"
                  :disabled="isCustomer"
                  @change="onZoneChange"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:bg-white focus:border-blue-500 transition disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                  <option value="">-- Chọn phân khu --</option>
                  <option v-for="z in formZones" :key="z.id" :value="z.id">
                    {{ z.name }} ({{ z.code }})
                  </option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-600 mb-1.5">Tầng (Floor)</label>
                <select
                  v-model="form.floor"
                  :disabled="isCustomer || !form.zone"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:bg-white focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed transition"
                >
                  <option value="">-- Chọn tầng --</option>
                  <option v-for="f in formFloors" :key="f.id" :value="f.id">
                    {{ f.name }} ({{ f.code }})
                  </option>
                </select>
              </div>
            </div>

            <!-- MÃ CODE & TRẠNG THÁI -->
            <div
              class="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100"
            >
              <div>
                <label class="block font-semibold text-slate-600 mb-1">
                  Mã Xung Đột Tự Động *
                </label>
                <input
                  v-model="form.code"
                  required
                  type="text"
                  readonly
                  class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 font-bold text-blue-600 font-mono text-xs outline-none cursor-not-allowed text-slate-500"
                  placeholder="VD: TNT-ZONEA-STE-001"
                />
              </div>

              <div>
                <label class="block font-semibold text-slate-600 mb-1">Trạng Thái</label>
                <select
                  v-model="form.status"
                  :disabled="isCustomer"
                  class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                  <option value="NEW">Mới phát hiện</option>
                  <option value="PENDING">Chờ xử lý</option>
                  <option value="DONE">Đã giải quyết</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1.5">Tên Vấn Đề Xung Đột *</label>
              <input
                v-model="form.name"
                :readonly="isCustomer"
                required
                type="text"
                class="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-blue-500 transition read-only:bg-slate-100 read-only:text-slate-500 read-only:cursor-not-allowed"
                placeholder="Nhập tên lỗi vướng mắc..."
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1.5">Trục Tọa Độ</label>
              <input
                v-model="form.axis"
                :readonly="isCustomer"
                type="text"
                class="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-blue-500 transition read-only:bg-slate-100 read-only:text-slate-500 read-only:cursor-not-allowed"
                placeholder="VD: Trục A-B / 1-3"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1.5">Mô Tả Vấn Đề Thiết Kế</label>
              <textarea
                v-model="form.description"
                :readonly="isCustomer"
                rows="2"
                class="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-blue-500 transition read-only:bg-slate-100 read-only:text-slate-500 read-only:cursor-not-allowed"
                placeholder="Chi tiết lỗi va chạm thiết kế..."
              ></textarea>
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1.5">Phương Án Xử Lý</label>
              <textarea
                v-model="form.solution"
                :readonly="isCustomer"
                rows="2"
                class="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-blue-500 transition read-only:bg-slate-100 read-only:text-slate-500 read-only:cursor-not-allowed"
                placeholder="Giải pháp đề xuất hoặc thống nhất..."
              ></textarea>
            </div>

            <!-- 🟢 FIELD Ý KIẾN PHỐI HỢP: CUSTOMER ĐƯỢC CHỈNH SỬA DUY NHẤT FIELD NÀY -->
            <div class="bg-blue-50/50 p-3 rounded-2xl border border-blue-100">
              <label class="block font-bold text-blue-700 mb-1.5 flex items-center justify-between">
                <span>💬 Ý Kiến Phối Hợp / Phản Hồi</span>
                <span
                  v-if="isCustomer"
                  class="text-[10px] text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full font-semibold"
                  >Được phép nhập</span
                >
              </label>
              <textarea
                v-model="form.comment"
                rows="3"
                class="w-full bg-white border border-blue-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition font-medium text-slate-800"
                placeholder="Khách hàng / Đối tác nhập ý kiến phản hồi phối hợp tại đây..."
              ></textarea>
            </div>

            <!-- KHU VỰC DÁN ẢNH / UPLOAD: KHÓA NẾU LÀ CUSTOMER -->
            <div class="space-y-2 pt-1" :class="{ 'opacity-60 pointer-events-none': isCustomer }">
              <div class="flex justify-between items-center">
                <label class="block font-semibold text-slate-700"> 📸 Hình Ảnh Xung Đột </label>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  @change="handleFileSelect"
                  class="hidden"
                  ref="fileInputRef"
                />

                <button
                  v-if="!isCustomer"
                  type="button"
                  @click="triggerFileInput"
                  class="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1 cursor-pointer"
                >
                  <span>+ Chọn File Từ Máy</span>
                </button>
              </div>

              <!-- VÙNG PASTE ẢNH PASTE AREA -->
              <div
                ref="pasteAreaRef"
                tabindex="0"
                @paste="handlePaste"
                class="border-2 border-dashed border-blue-200 rounded-2xl p-4 bg-blue-50/20 outline-none transition cursor-pointer"
              >
                <div v-if="existingImages.length" class="mb-1">
                  <div class="text-[11px] font-semibold text-slate-400 mb-1.5">
                    Ảnh đính kèm hiện tại:
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <div
                      v-for="img in existingImages"
                      :key="img.id"
                      class="relative w-14 h-14 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs"
                    >
                      <img :src="img.image" class="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <div v-if="pendingFiles.length" class="flex flex-wrap gap-2 mt-1">
                  <div
                    v-for="(fileObj, idx) in pendingFiles"
                    :key="idx"
                    class="relative w-16 h-16 border border-blue-300 rounded-xl bg-white overflow-hidden shadow-xs"
                  >
                    <img :src="fileObj.previewUrl" class="w-full h-full object-cover" />
                    <button
                      v-if="!isCustomer"
                      type="button"
                      @click.stop="removePendingFile(idx)"
                      class="absolute top-1 right-1 bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow hover:bg-rose-600 transition"
                      title="Xóa ảnh"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div
                  v-if="!existingImages.length && !pendingFiles.length"
                  class="text-center py-3 text-xs text-slate-400 select-none"
                >
                  <div class="text-[11px] text-slate-400">Không có ảnh nào được tải lên</div>
                </div>
              </div>
            </div>
          </div>

          <!-- FOOTER ACTION -->
          <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
            <button
              type="button"
              @click="showFormModal = false"
              class="px-4 py-2 text-xs text-slate-600 hover:bg-slate-200/60 rounded-xl transition font-semibold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-5 py-2 text-xs bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition shadow-md shadow-blue-500/20 cursor-pointer"
            >
              {{ submitting ? 'Đang gửi...' : isCustomer ? 'Gửi Ý Kiến' : 'Lưu Xung Đột' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, onUnmounted } from 'vue'
import {
  getConflicts,
  addConflict,
  editConflict,
  deleteConflict,
  exportConflict
} from '~/api/design'
import { getProjects } from '~/api/project'
import { useAuthStore } from '~/stores/auth'
import { useUIStore } from '~/stores/ui'

const authStore = useAuthStore()
const uiStore = useUIStore()

const app = 'design_conflict'

// 🟢 TÍNH NĂNG KIỂM TRA ROLE CUSTOMER
const isCustomer = computed(() => {
  return authStore.user && authStore.user.role === 'CUSTOMER'
})

const CATEGORY_OPTIONS = [
  { label: 'Kiến trúc', code: 'ARC' },
  { label: 'Kết cấu thép', code: 'STE' },
  { label: 'Kết cấu', code: 'STR' },
  { label: 'Cơ điện', code: 'MEP' },
  { label: 'Điện', code: 'ELE' },
  { label: 'Điện nhẹ', code: 'ELV' },
  { label: 'Điều hòa', code: 'HVA' },
  { label: 'Cấp thoát nước', code: 'PLB' },
  { label: 'Nội thất', code: 'FUR' },
  { label: 'Phòng cháy chữa cháy', code: 'FPS' },
  { label: 'Hạ tầng giao thông', code: 'LAS' }
]

const loading = ref(false)
const submitting = ref(false)
const generatingCode = ref(false)
const conflicts = ref([])
const projectList = ref([])

const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const filters = reactive({
  search: '',
  project: '',
  zone: '',
  category: '',
  status: ''
})

const showGalleryModal = ref(false)
const galleryImages = ref([])

const showFormModal = ref(false)
const isEdit = ref(false)
const editingId = ref(null)

const fileInputRef = ref(null)
const pasteAreaRef = ref(null)

const form = reactive({
  code: '',
  name: '',
  project: '',
  zone: '',
  floor: '',
  category: '',
  axis: '',
  description: '',
  solution: '',
  comment: '',
  status: 'NEW'
})

const existingImages = ref([])
const pendingFiles = ref([])

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value) || 1)

const expandedMap = reactive({})

const toggleExpand = (itemId, type) => {
  const key = `${itemId}_${type}`
  expandedMap[key] = !expandedMap[key]
}

const filteredZoneList = computed(() => {
  if (!filters.project) return []
  const proj = projectList.value.find((p) => p.id === filters.project)
  return proj ? proj.zones || [] : []
})

const formZones = computed(() => {
  if (!form.project) return []
  const proj = projectList.value.find((p) => p.id === form.project)
  return proj ? proj.zones || [] : []
})

const formFloors = computed(() => {
  if (!form.zone) return []
  const currentZone = formZones.value.find((z) => z.id === form.zone)
  return currentZone ? currentZone.floors || [] : []
})

const onProjectOrCategoryChange = async () => {
  if (isEdit.value || isCustomer.value) return

  if (form.project && form.category) {
    generatingCode.value = true
    try {
      const selectedProject = projectList.value.find((p) => p.id === form.project)
      const projectCode = selectedProject ? selectedProject.code || 'PRJ' : 'PRJ'

      let zoneCode = 'ALL'
      if (form.zone) {
        const selectedZone = formZones.value.find((z) => z.id === form.zone)
        if (selectedZone && selectedZone.code) {
          zoneCode = selectedZone.code
        }
      }

      const res = await getConflicts({
        project: form.project,
        zone: form.zone || undefined,
        category: form.category,
        page_size: 1000
      })

      const existingCount =
        res.count !== undefined ? res.count : Array.isArray(res) ? res.length : 0
      const nextIndex = String(existingCount + 1).padStart(3, '0')

      form.code = `${projectCode}-${zoneCode}-${form.category}-${nextIndex}`
    } catch (err) {
      console.error('Lỗi khi tạo mã tự động:', err)
    } finally {
      generatingCode.value = false
    }
  } else {
    form.code = ''
  }
}

const onZoneChange = () => {
  form.floor = ''
  onProjectOrCategoryChange()
}

const fetchConflictData = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
      search: filters.search || '',
      project: filters.project || '',
      zone: filters.zone || '',
      category: filters.category || '',
      status: filters.status || ''
    }
    const res = await getConflicts(params)

    if (res.results) {
      conflicts.value = res.results
      totalCount.value = res.count
    } else {
      conflicts.value = Array.isArray(res) ? res : res.data
      totalCount.value = conflicts.value.length
    }
  } catch (err) {
    console.error('Lỗi khi tải dữ liệu xung đột:', err)
  } finally {
    loading.value = false
  }
}

const fetchInitialProjects = async () => {
  try {
    const res = await getProjects()
    projectList.value = res.results || res.data || res
  } catch (err) {
    console.error('Lỗi tải danh sách dự án:', err)
  }
}

const handleFilterChange = () => {
  currentPage.value = 1
  fetchConflictData()
}

const handleProjectFilterChange = () => {
  filters.zone = ''
  handleFilterChange()
}

const changePage = (page) => {
  currentPage.value = page
  fetchConflictData()
}

const getProjectName = (projId) => {
  const p = projectList.value.find((item) => item.id === projId)
  return p ? p.name : '-'
}

const getZoneName = (zoneId) => {
  if (!zoneId) return '-'
  for (const p of projectList.value) {
    const z = (p.zones || []).find((item) => item.id === zoneId)
    if (z) return z.name
  }
  return '-'
}

const getFloorName = (floorId) => {
  if (!floorId) return ''
  for (const p of projectList.value) {
    for (const z of p.zones || []) {
      const f = (z.floors || []).find((item) => item.id === floorId)
      if (f) return f.name
    }
  }
  return ''
}

const getCategoryLabel = (catCode) => {
  const cat = CATEGORY_OPTIONS.find((item) => item.code === catCode)
  return cat ? `${cat.label}` : catCode || 'Khác'
}

const statusBadgeClass = (status) => {
  switch (status) {
    case 'NEW':
      return 'bg-rose-50 text-rose-600 border border-rose-100'
    case 'PENDING':
      return 'bg-amber-50 text-amber-600 border border-amber-100'
    case 'DONE':
      return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
    default:
      return 'bg-slate-50 text-slate-600 border border-slate-100'
  }
}

const statusText = (status) => {
  switch (status) {
    case 'NEW':
      return 'Mới'
    case 'PENDING':
      return 'Chờ xử lý'
    case 'DONE':
      return 'Hoàn thành'
    default:
      return status
  }
}

const openImageGallery = (images) => {
  galleryImages.value = images
  showGalleryModal.value = true
}

const openModal = async (item = null) => {
  pendingFiles.value = []

  if (item) {
    isEdit.value = true
    editingId.value = item.id
    Object.assign(form, {
      code: item.code,
      name: item.name,
      project: item.project,
      zone: item.zone || '',
      floor: item.floor || '',
      category: item.category || '',
      axis: item.axis || '',
      description: item.description || '',
      solution: item.solution || '',
      comment: item.comment || '',
      status: item.status || 'NEW'
    })
    existingImages.value = item.images || []
  } else {
    if (isCustomer.value) return // Khách hàng không được mở Modal Thêm Mới
    isEdit.value = false
    editingId.value = null
    Object.assign(form, {
      code: '',
      name: '',
      project: '',
      zone: '',
      floor: '',
      category: '',
      axis: '',
      description: '',
      solution: '',
      comment: '',
      status: 'NEW'
    })
    existingImages.value = []
  }
  showFormModal.value = true

  await nextTick()
  if (pasteAreaRef.value && !isCustomer.value) {
    pasteAreaRef.value.focus()
  }
}

const triggerFileInput = () => {
  if (fileInputRef.value && !isCustomer.value) {
    fileInputRef.value.click()
  }
}

const handlePaste = (e) => {
  if (isCustomer.value) return // Khóa Paste ảnh nếu là Customer
  const clipboardData = e.clipboardData || window.clipboardData
  if (!clipboardData) return

  const items = clipboardData.items
  if (!items) return

  const pastedFiles = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.type.indexOf('image') !== -1) {
      const file = item.getAsFile()
      if (file) {
        const ext = file.type.split('/')[1] || 'png'
        const renamedFile = new File([file], `paste_${Date.now()}_${i}.${ext}`, { type: file.type })
        pastedFiles.push(renamedFile)
      }
    }
  }

  if (pastedFiles.length > 0) {
    addFilesToPending(pastedFiles)
  }
}

const handleFileSelect = (e) => {
  if (isCustomer.value) return
  const files = Array.from(e.target.files || [])
  addFilesToPending(files)
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const addFilesToPending = (files) => {
  files.forEach((file) => {
    pendingFiles.value.push({
      file: file,
      previewUrl: URL.createObjectURL(file)
    })
  })
}

const removePendingFile = (index) => {
  if (pendingFiles.value[index]?.previewUrl) {
    URL.revokeObjectURL(pendingFiles.value[index].previewUrl)
  }
  pendingFiles.value.splice(index, 1)
}

const saveForm = async () => {
  submitting.value = true
  try {
    const payload = new FormData()

    // Nếu là Customer -> chỉ gửi comment
    if (isCustomer.value) {
      payload.append('comment', form.comment || '')
    } else {
      payload.append('code', form.code)
      payload.append('name', form.name)
      payload.append('project', form.project)
      if (form.zone) payload.append('zone', form.zone)
      if (form.floor) payload.append('floor', form.floor)
      payload.append('category', form.category)
      payload.append('axis', form.axis || '')
      payload.append('description', form.description || '')
      payload.append('solution', form.solution || '')
      payload.append('comment', form.comment || '')
      payload.append('status', form.status)

      pendingFiles.value.forEach((item) => {
        payload.append('images', item.file)
      })
    }

    if (isEdit.value) {
      await editConflict(editingId.value, payload)
      uiStore.showSuccess(
        isCustomer.value ? 'Gửi ý kiến phản hồi thành công!' : 'Cập nhật xung đột thành công!'
      )
    } else {
      await addConflict(payload)
      uiStore.showSuccess('Tạo mới xung đột thiết kế thành công!')
    }

    showFormModal.value = false
    fetchConflictData()
  } catch (err) {
    console.error('Lỗi khi lưu xung đột:', err.response?.data || err)
    uiStore.showError('Không thể lưu thông tin!')
  } finally {
    submitting.value = false
  }
}

const handleDelete = (id) => {
  uiStore.confirmDelete({
    title: 'Xóa Xung Đột Thiết Kế',
    message: 'Bạn có chắc chắn muốn xóa bản ghi xung đột này không? Dữ liệu sẽ bị xóa vĩnh viễn.',
    onConfirm: async () => {
      try {
        await deleteConflict(id)
        uiStore.showSuccess('Xóa xung đột thiết kế thành công!')
        fetchConflictData()
      } catch (err) {
        uiStore.showError('Không thể xóa bản ghi này!')
      }
    }
  })
}

const exporting = ref(false)
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isDropdownOpen.value = false
  }
}

const triggerExport = async (typeExport) => {
  isDropdownOpen.value = false
  exporting.value = true
  try {
    const params = {
      type: typeExport, // 'excel' hoặc 'pdf'
      search: filters.search || '',
      project: filters.project || '',
      zone: filters.zone || '',
      category: filters.category || '',
      status: filters.status || ''
    }

    const response = await exportConflict(params)
    console.log('🚀 ~ triggerExport ~ response:', response)

    const ext = typeExport === 'pdf' ? 'pdf' : 'xlsx'
    const blob = new Blob([response.data || response], {
      type:
        typeExport === 'pdf'
          ? 'application/pdf'
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Bao_Cao_Xung_Dot_${Date.now()}.${ext}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    uiStore.showSuccess(`Xuất báo cáo ${typeExport.toUpperCase()} thành công!`)
  } catch (err) {
    console.error('Lỗi xuất báo cáo:', err)
    uiStore.showError('Không thể xuất file báo cáo!')
  } finally {
    exporting.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

onMounted(() => {
  fetchInitialProjects()
  fetchConflictData()
})
</script>
