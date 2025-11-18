
<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <div class="bg-white rounded-xl shadow-xl p-6 max-w-md mx-auto border border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800">Sites Details</h2>
        <button @click="$router.back()" class="text-gray-400 hover:text-gray-600">&times;</button>
      </div>
      <div class="space-y-3">
        <div><span class="font-medium text-gray-600">ID:</span> <span class="font-semibold text-green-700">{{ item.id }}</span></div>
        <div><span class="font-medium text-gray-600">ReportField1:</span> <span class="font-semibold text-green-700">{{ item.reportField1 }}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() { return { item: {} }; },
  async mounted() {
    const id = this.$route.params.id;
    try { this.item = (await this.$apiGet(`/sites/${id}/`)).data || {}; }
    catch(err){ console.error(err); }
  }
};
</script>
