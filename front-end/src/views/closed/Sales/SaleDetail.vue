
<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <!-- Loading -->
    <Loading :visible="loading" message="Loading Sale..." />

    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <h1 class="text-lg font-bold text-gray-800">Sale Detail</h1>
    </div>

    <!-- Detail Card -->
    <div class="bg-white overflow-hidden rounded-md border border-gray-200 p-4 hidden md:block space-y-2">
      <div><strong>ID:</strong> {{ item.id }}</div>
      <div><strong>Unit_id:</strong> {{ item.unit_id }}</div><div><strong>Site_id:</strong> {{ item.site_id }}</div><div><strong>Buyer_id:</strong> {{ item.buyer_id }}</div><div><strong>Sale_price:</strong> {{ item.sale_price }}</div><div><strong>Sale_date:</strong> {{ item.sale_date }}</div><div><strong>Status:</strong> {{ item.status }}</div><div><strong>Notes:</strong> {{ item.notes }}</div><div><strong>Owner_id:</strong> {{ item.owner_id }}</div><div><strong>Created_by:</strong> {{ item.created_by }}</div><div><strong>Updated_by:</strong> {{ item.updated_by }}</div>
    </div>

    <!-- Mobile View -->
    <div class="md:hidden bg-white rounded-md border border-gray-200 p-4 space-y-2">
      <div><strong>ID:</strong> {{ item.id }}</div>
      <div><strong>Unit_id:</strong> {{ item.unit_id }}</div><div><strong>Site_id:</strong> {{ item.site_id }}</div><div><strong>Buyer_id:</strong> {{ item.buyer_id }}</div><div><strong>Sale_price:</strong> {{ item.sale_price }}</div><div><strong>Sale_date:</strong> {{ item.sale_date }}</div><div><strong>Status:</strong> {{ item.status }}</div><div><strong>Notes:</strong> {{ item.notes }}</div><div><strong>Owner_id:</strong> {{ item.owner_id }}</div><div><strong>Created_by:</strong> {{ item.created_by }}</div><div><strong>Updated_by:</strong> {{ item.updated_by }}</div>
    </div>

    <button @click="$router.back()" class="mt-4 text-blue-600 hover:underline">Back</button>
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";

export default {
  components: { Loading },
  data() {
    return {
      item: {},
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
    const id = this.$route.params.id;
    try {
      const response = await this.$apiGetById('/sale', id);
      this.item = response || {};
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  },
};
</script>
