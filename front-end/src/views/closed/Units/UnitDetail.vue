
<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <!-- Loading -->
    <Loading :visible="loading" message="Loading Unit..." />

    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <h1 class="text-lg font-bold text-gray-800">Unit Detail</h1>
    </div>

    <!-- Detail Card -->
    <div class="bg-white overflow-hidden rounded-md border border-gray-200 p-4 hidden md:block space-y-2">
      <div><strong>ID:</strong> {{ item.id }}</div>
      <div><strong>Name:</strong> {{ item.name }}</div><div><strong>Description:</strong> {{ item.description }}</div><div><strong>Type_id:</strong> {{ item.type_id }}</div><div><strong>Floor:</strong> {{ item.floor }}</div><div><strong>House_number:</strong> {{ item.house_number }}</div><div><strong>Block_number:</strong> {{ item.block_number }}</div><div><strong>Bedrooms:</strong> {{ item.bedrooms }}</div><div><strong>Bathrooms:</strong> {{ item.bathrooms }}</div><div><strong>Size:</strong> {{ item.size }}</div><div><strong>Price:</strong> {{ item.price }}</div><div><strong>Status:</strong> {{ item.status }}</div><div><strong>Site_id:</strong> {{ item.site_id }}</div><div><strong>Owner_id:</strong> {{ item.owner_id }}</div><div><strong>Manager_id:</strong> {{ item.manager_id }}</div><div><strong>Staff_id:</strong> {{ item.staff_id }}</div><div><strong>Created_by:</strong> {{ item.created_by }}</div><div><strong>Updated_by:</strong> {{ item.updated_by }}</div>
    </div>

    <!-- Mobile View -->
    <div class="md:hidden bg-white rounded-md border border-gray-200 p-4 space-y-2">
      <div><strong>ID:</strong> {{ item.id }}</div>
      <div><strong>Name:</strong> {{ item.name }}</div><div><strong>Description:</strong> {{ item.description }}</div><div><strong>Type_id:</strong> {{ item.type_id }}</div><div><strong>Floor:</strong> {{ item.floor }}</div><div><strong>House_number:</strong> {{ item.house_number }}</div><div><strong>Block_number:</strong> {{ item.block_number }}</div><div><strong>Bedrooms:</strong> {{ item.bedrooms }}</div><div><strong>Bathrooms:</strong> {{ item.bathrooms }}</div><div><strong>Size:</strong> {{ item.size }}</div><div><strong>Price:</strong> {{ item.price }}</div><div><strong>Status:</strong> {{ item.status }}</div><div><strong>Site_id:</strong> {{ item.site_id }}</div><div><strong>Owner_id:</strong> {{ item.owner_id }}</div><div><strong>Manager_id:</strong> {{ item.manager_id }}</div><div><strong>Staff_id:</strong> {{ item.staff_id }}</div><div><strong>Created_by:</strong> {{ item.created_by }}</div><div><strong>Updated_by:</strong> {{ item.updated_by }}</div>
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
      const response = await this.$apiGetById('/unit', id);
      this.item = response || {};
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  },
};
</script>
