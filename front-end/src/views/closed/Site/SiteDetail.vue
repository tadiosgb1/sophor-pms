<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <!-- Loading -->
    <Loading :visible="loading" message="Loading Site..." />

    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <h1 class="text-lg font-bold text-gray-800">Site Detail</h1>
      <button @click="$router.back()" class="text-blue-600 hover:underline">Back</button>
    </div>

    <!-- Site Info -->
    <div class="bg-white overflow-hidden rounded-md border border-gray-200 p-4 hidden md:block space-y-2">
      <div><strong>ID:</strong> {{ item.id }}</div>
      <div><strong>Name:</strong> {{ item.name }}</div>
      <div><strong>Description:</strong> {{ item.description }}</div>
      <div><strong>Site_type:</strong> {{ item.site_type }}</div>
      <div><strong>Status:</strong> {{ item.status }}</div>
      <div><strong>Latitude:</strong> {{ item.latitude }}</div>
      <div><strong>Longitude:</strong> {{ item.longitude }}</div>
      <div><strong>Country:</strong> {{ item.country }}</div>
      <div><strong>State:</strong> {{ item.state }}</div>
      <div><strong>City:</strong> {{ item.city }}</div>
      <div><strong>Sub_city:</strong> {{ item.sub_city }}</div>
      <div><strong>Street:</strong> {{ item.street }}</div>
      <div><strong>Owner_id:</strong> {{ item.owner_id }}</div>
      <div><strong>Created_by:</strong> {{ item.created_by }}</div>
      <div><strong>Updated_by:</strong> {{ item.updated_by }}</div>
    </div>

    <!-- Images Section -->
    <div class="mt-6">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-md font-semibold">Site Images</h2>
        <button @click="showAddImage = true" class="px-3 py-1 bg-green-500 text-white rounded-lg">Add Image</button>
      </div>

      <div v-if="siteImages.length" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="image in siteImages" :key="image.id" class="bg-white rounded-md shadow p-2 flex flex-col items-center">
          <img :src="image.image" alt="Site Image" class="w-full h-32 object-cover rounded-md mb-2" />
          <div class="flex gap-2">
            <button @click="editImage(image)" class="px-2 py-1 bg-blue-500 text-white rounded text-xs">Edit</button>
            <button @click="deleteImage(image.id)" class="px-2 py-1 bg-red-500 text-white rounded text-xs">Delete</button>
          </div>
        </div>
      </div>
      <div v-else class="text-gray-500">No images added yet.</div>
    </div>

    <!-- Add/Edit Modals -->
    <AddSiteImage v-if="showAddImage" @close="showAddImage = false" @saved="fetchImages" :data="{ site_id: item.id }"/>
    <EditSiteImage v-if="editingImage" :data="editingImage" @close="editingImage=null" @saved="fetchImages"/>
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
import AddSiteImage from "../SiteImages/AddSiteImage.vue";
import EditSiteImage from "../SiteImages/EditSiteImage.vue";

export default {
  components: { Loading, AddSiteImage, EditSiteImage },
  data() {
    return {
      item: {},
      loading: false,
      siteImages: [],
      showAddImage: false,
      editingImage: null,
    };
  },
  async mounted() {
    await this.fetchSite();
    await this.fetchImages();
  },
  methods: {
    async fetchSite() {
      this.loading = true;
      const id = this.$route.params.id;
      try {
        const response = await this.$apiGetById('/site', id);
        this.item = response || {};
      } catch (e) { console.error(e); }
      finally { this.loading = false; }
    },
    async fetchImages() {
      try {
        const res = await this.$apiGet('/siteimage', { site_id: this.item.id });
        this.siteImages = res || [];
      } catch (e) { console.error(e); }
    },
    editImage(image) {
      this.editingImage = image;
    },
    async deleteImage(id) {
      if (!confirm('Are you sure you want to delete this image?')) return;
      try {
        await this.$apiDelete(`/siteimage/${id}`);
        this.$root.$refs.toast.showToast('Deleted successfully', 'success');
        await this.fetchImages();
      } catch (e) { console.error(e); }
    },
  }
};
</script>
