
<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <!-- Loading -->
    <Loading :visible="loading" message="Loading Rent..." />

    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <h1 class="text-lg font-bold text-gray-800">Rent Detail</h1>
    </div>

    <!-- Detail Card -->
    <div class="bg-white overflow-hidden rounded-md border border-gray-200 p-4 hidden md:block space-y-2">
      <div><strong>ID:</strong> {{ item.id }}</div>
      <div><strong>Unit_id:</strong> {{ item.unit_id }}</div><div><strong>Site_id:</strong> {{ item.site_id }}</div><div><strong>Renter_id:</strong> {{ item.renter_id }}</div><div><strong>Rent_amount:</strong> {{ item.rent_amount }}</div><div><strong>Deposit_amount:</strong> {{ item.deposit_amount }}</div><div><strong>Rent_period:</strong> {{ item.rent_period }}</div><div><strong>Start_date:</strong> {{ item.start_date }}</div><div><strong>Next_due_date:</strong> {{ item.next_due_date }}</div><div><strong>Status:</strong> {{ item.status }}</div><div><strong>Notes:</strong> {{ item.notes }}</div><div><strong>Owner_id:</strong> {{ item.owner_id }}</div><div><strong>Created_by:</strong> {{ item.created_by }}</div><div><strong>Updated_by:</strong> {{ item.updated_by }}</div>
    </div>

    <!-- Mobile View -->
    <div class="md:hidden bg-white rounded-md border border-gray-200 p-4 space-y-2">
      <div><strong>ID:</strong> {{ item.id }}</div>
      <div><strong>Unit_id:</strong> {{ item.unit_id }}</div><div><strong>Site_id:</strong> {{ item.site_id }}</div><div><strong>Renter_id:</strong> {{ item.renter_id }}</div><div><strong>Rent_amount:</strong> {{ item.rent_amount }}</div><div><strong>Deposit_amount:</strong> {{ item.deposit_amount }}</div><div><strong>Rent_period:</strong> {{ item.rent_period }}</div><div><strong>Start_date:</strong> {{ item.start_date }}</div><div><strong>Next_due_date:</strong> {{ item.next_due_date }}</div><div><strong>Status:</strong> {{ item.status }}</div><div><strong>Notes:</strong> {{ item.notes }}</div><div><strong>Owner_id:</strong> {{ item.owner_id }}</div><div><strong>Created_by:</strong> {{ item.created_by }}</div><div><strong>Updated_by:</strong> {{ item.updated_by }}</div>
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
      const response = await this.$apiGetById('/rent', id);
      this.item = response || {};
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  },
};
</script>
