
<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <!-- Loading -->
    <Loading :visible="loading" message="Loading Company..." />

    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <h1 class="text-lg font-bold text-gray-800">Company Detail</h1>
    </div>

    <!-- Detail Card -->
    <div class="bg-white overflow-hidden rounded-md border border-gray-200 p-4 hidden md:block space-y-2">
    
      <div><strong>Name:</strong> {{ item.name }}</div><div><strong>Address:</strong> {{ item.address }}</div><div><strong>Latitude:</strong> {{ item.latitude }}</div><div><strong>Longitude:</strong> {{ item.longitude }}</div><div><strong>Phone:</strong> {{ item.phone }}</div><div><strong>Official_email:</strong> {{ item.official_email }}</div><div><strong>Website:</strong> {{ item.website }}</div><div><strong>Logo:</strong> {{ item.logo }}</div><div><strong>Facebook:</strong> {{ item.facebook }}</div><div><strong>Instagram:</strong> {{ item.instagram }}</div><div><strong>Linkedin:</strong> {{ item.linkedin }}</div><div><strong>Twitter:</strong> {{ item.twitter }}</div><div><strong>Telegram:</strong> {{ item.telegram }}</div><div><strong>Description:</strong> {{ item.description }}</div>
    </div>

    <!-- Mobile View -->
    <div class="md:hidden bg-white rounded-md border border-gray-200 p-4 space-y-2">
      
      <div><strong>Name:</strong> {{ item.name }}</div><div><strong>Address:</strong> {{ item.address }}</div><div><strong>Latitude:</strong> {{ item.latitude }}</div><div><strong>Longitude:</strong> {{ item.longitude }}</div><div><strong>Phone:</strong> {{ item.phone }}</div><div><strong>Official_email:</strong> {{ item.official_email }}</div><div><strong>Website:</strong> {{ item.website }}</div><div><strong>Logo:</strong> {{ item.logo }}</div><div><strong>Facebook:</strong> {{ item.facebook }}</div><div><strong>Instagram:</strong> {{ item.instagram }}</div><div><strong>Linkedin:</strong> {{ item.linkedin }}</div><div><strong>Twitter:</strong> {{ item.twitter }}</div><div><strong>Telegram:</strong> {{ item.telegram }}</div><div><strong>Description:</strong> {{ item.description }}</div>
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
      const response = await this.$apiGetById('/company', id);
      this.item = response || {};
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  },
};
</script>
