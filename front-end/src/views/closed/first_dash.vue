<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div
        v-for="(value, key) in stats"
        :key="key"
        class="bg-white shadow-md rounded-2xl p-5 flex flex-col justify-between border border-gray-100 hover:shadow-lg transition-all relative"
      >
        <!-- Image on top-right -->
        <img
          src=""
          alt="icon"
          class="absolute top-4 right-4 w-10 h-10 object-contain"
        />
        <div>
          <h2 class="text-gray-500 text-sm capitalize">{{ key.replace('total', '').trim() }}</h2>
          <p class="text-3xl font-bold text-gray-800 mt-2">{{ value }}</p>
        </div>
        <div class="mt-2 border-t pt-2">
          <span class="text-xs text-gray-400">Updated just now</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stats: {
        totalDownlines: 120,      // New stat
        walletBalance: "ETB 12,450.00", // New stat
        totalEarnings: "ETB 45,800.00",
        totalPayout: "ETB 45,800.00",
      },
    };
  },
};
</script>

<style scoped>
.bg-white:hover {
  transform: translateY(-2px);
  transition: all 0.2s ease;
}
</style>
