<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <!-- Loading -->
    <Loading :visible="loading" message="Loading Unit..." />

    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <h1 class="text-lg font-bold text-gray-800">Unit Detail</h1>
      <button @click="$router.back()" class="text-blue-600 hover:underline">Back</button>
    </div>

    <!-- Unit Info -->
    <div class="bg-white overflow-hidden rounded-md border border-gray-200 p-4 hidden md:block space-y-2">
      <div><strong>ID:</strong> {{ item.id }}</div>
      <div><strong>Name:</strong> {{ item.name }}</div>
      <div><strong>Description:</strong> {{ item.description }}</div>
      <div><strong>Floor:</strong> {{ item.floor }}</div>
      <div><strong>Bedrooms:</strong> {{ item.bedrooms }}</div>
      <div><strong>Price:</strong> {{ item.price }}</div>
      <!-- add other fields as needed -->
    </div>

    <!-- Images Section -->
    <div class="mt-6">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-md font-semibold">Unit Images</h2>
        <button @click="showAddImage = true" class="px-3 py-1 bg-green-500 text-white rounded-lg">Add Image</button>
      </div>

      <div v-if="unitImages.length" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="image in unitImages" :key="image.id" class="bg-white rounded-md shadow p-2 flex flex-col items-center">
          <img :src="image.image" alt="Unit Image" class="w-full h-32 object-cover rounded-md mb-2" />
          <div class="flex gap-2">
            <button @click="editImage(image)" class="px-2 py-1 bg-blue-500 text-white rounded text-xs">Edit</button>
            <button @click="deleteImage(image.id)" class="px-2 py-1 bg-red-500 text-white rounded text-xs">Delete</button>
          </div>
        </div>
      </div>
      <div v-else class="text-gray-500">No images added yet.</div>
    </div>

    <!-- Add/Edit Modals -->
    <AddUnitImage v-if="showAddImage" @close="showAddImage = false" @saved="fetchImages" :data="{ unit_id: item.id }"/>
    <EditUnitImage v-if="editingImage" :data="editingImage" @close="editingImage=null" @saved="fetchImages" />
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
import AddUnitImage from "../UnitImages/AddUnitImage.vue";
import EditUnitImage from "../UnitImages/EditUnitImage.vue";

export default {
  components: { Loading, AddUnitImage, EditUnitImage },
  data() {
    return {
      item: {},
      loading: false,
      unitImages: [],
      showAddImage: false,
      editingImage: null,
    };
  },
  async mounted() {
    await this.fetchUnit();
    await this.fetchImages();
  },
  methods: {
    async fetchUnit() {
      this.loading = true;
      const id = this.$route.params.id;
      try {
        const response = await this.$apiGetById('/unit', id);
        this.item = response || {};
      } catch (e) { console.error(e); }
      finally { this.loading = false; }
    },
    async fetchImages() {
      try {
        const res = await this.$apiGet('/unitimage', { unit_id: this.item.id });
        this.unitImages = res || [];
      } catch (e) { console.error(e); }
    },
    editImage(image) {
      this.editingImage = image;
    },
    async deleteImage(id) {
      if (!confirm('Are you sure you want to delete this image?')) return;
      try {
        await this.$apiDelete(`/unitimage/${id}`);
        this.$root.$refs.toast.showToast('Deleted successfully', 'success');
        await this.fetchImages();
      } catch (e) { console.error(e); }
    },
  }
};
</script>
