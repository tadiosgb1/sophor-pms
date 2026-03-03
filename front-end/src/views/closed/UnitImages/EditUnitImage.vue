<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-sm">
      <div class="flex justify-between items-center mb-4 border-b pb-2">
        <h2 class="text-lg font-semibold text-gray-800">Edit Unit Image</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">&times;</button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-4" enctype="multipart/form-data">

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Unit ID</label>
          <input v-model="form.unit_id" type="text" required
                 class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Image</label>
          <input type="file" @change="handleFile" 
                 class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150" />
          
          <!-- Show previous image if exists -->
          <div v-if="form.image || preview" class="mt-2">
            <img :src="preview || form.image" alt="Preview" class="h-24 w-24 object-cover rounded-md border" />
          </div>
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Owner ID</label>
          <input v-model="form.owner_id" type="text" required
                 class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Created By</label>
          <input v-model="form.created_by" type="text" required
                 class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150" />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Updated By</label>
          <input v-model="form.updated_by" type="text" required
                 class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150" />
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 border rounded-lg">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded-lg">Save</button>
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
        unit_id: this.data?.unit_id || '',
        image: this.data?.image_url || '', // previous image URL
        owner_id: this.data?.owner_id || '',
        created_by: this.data?.created_by || '',
        updated_by: this.data?.updated_by || ''
      },
      file: null,      // for new file selection
      preview: null    // for image preview
    };
  },
  methods: {
    handleFile(event) {
      const selected = event.target.files[0];
      if (selected) {
        this.file = selected;
        this.preview = URL.createObjectURL(selected);
      } else {
        this.file = null;
        this.preview = null;
      }
    },

    async submitForm() {
      try {
        const formData = new FormData();
        formData.append("unit_id", this.form.unit_id);
        formData.append("owner_id", this.form.owner_id);
        formData.append("created_by", this.form.created_by);
        formData.append("updated_by", this.form.updated_by);

        if (this.file) {
          formData.append("image_url", this.file);
        }


        const headers ={
          "Content-Type": "multipart/form-data"
        }
        // Update existing record
        const res = await this.$apiPut(`/unitimage`, this.data.id,formData, headers);

        if (res) this.$root.$refs.toast.showToast('Updated successfully', 'success');
        this.$emit("saved");
        this.$emit("close");

      } catch (e) {
        console.error(e);
        this.$root.$refs.toast.showToast('Error uploading image', 'error');
      }
    }
  }
};
</script>