<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-sm">
      <div class="flex justify-between items-center mb-4 border-b pb-2">
        <h2 class="text-lg font-semibold text-gray-800">Edit SiteImage</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">&times;</button>
      </div>

      <form @submit.prevent="submitForm" enctype="multipart/form-data" class="space-y-4">

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Site_id</label>
          <input v-model="form.site_id" type="text" required class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Current Image</label>
          <img :src="data.image_url" class="w-28 h-28 rounded object-cover border mb-2" v-if="data.image_url" />

          <label class="block mb-1 text-sm font-medium text-gray-700">Change Image</label>
          <input @change="handleFileUpload" type="file" accept="image/*" class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Owner_id</label>
          <input v-model="form.owner_id" type="text" required class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Created_by</label>
          <input v-model="form.created_by" type="text" required class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Updated_by</label>
          <input v-model="form.updated_by" type="text" required class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150" />
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 border rounded-lg">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded-lg">Edit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: { data: Object },
  data() {
    return {
      form: {
        site_id: this.data?.site_id || '',
        owner_id: this.data?.owner_id || '',
        created_by: this.data?.created_by || '',
        updated_by: this.data?.updated_by || ''
      },
      file: null,
    };
  },
  methods: {
    handleFileUpload(e) {
      this.file = e.target.files[0];
    },
    async submitForm() {
      try {
        const formData = new FormData();
        formData.append('site_id', this.form.site_id);
        formData.append('owner_id', this.form.owner_id);
        formData.append('created_by', this.form.created_by);
        formData.append('updated_by', this.form.updated_by);

        if (this.file) formData.append('image_url', this.file);
        else formData.append('image_url', this.data.image);


        const headers={ 
          'Content-Type': 'multipart/form-data'
         }

        const res = await this.$apiPut('/siteimage', this.data.id, formData, 
          headers);

        if (res) {
          this.$root.$refs.toast.showToast('Edited successfully', 'success');
        }

        this.$emit('saved');
        this.$emit('close');
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>
