<template>
  <div
    class="flex h-screen w-screen overflow-hidden font-sans transition-colors duration-200 bg-slate-100 text-slate-800 dark:bg-slate-950 dark:text-slate-100"
  >
    <AppSidebar class="shrink-0" />

    <div class="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
      <AppHeader class="shrink-0 z-10" />

      <main class="flex-1 p-8 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from '~/components/common/Sidebar.vue'
import AppHeader from '~/components/common/Header.vue'
</script>
