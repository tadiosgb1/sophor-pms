<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md text-sm overflow-hidden">

      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-500">
            <i class="fas fa-image text-sm"></i>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800">Add Unit Image</h2>
            <p class="text-xs text-gray-400">Upload a photo for this unit</p>
          </div>
        </div>
        <button @click="$emit('close')"
          class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 text-lg leading-none">&times;</button>
      </div>

      <div class="px-6 py-5 space-y-4">

        <!-- Drop zone -->
        <div class="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-orange-400 transition-colors cursor-pointer"
          @click="$refs.fileInput.click()">
          <div v-if="!preview" class="p-8 text-center">
            <i class="fas fa-cloud-arrow-up text-3xl text-gray-300 mb-2 block"></i>
            <p class="text-xs text-gray-400">Click to select an image</p>
            <p class="text-[10px] text-gray-300 mt-1">JPG, PNG, WEBP supported</p>
          </div>
          <img v-else :src="preview" class="w-full h-48 object-cover" alt="Preview" />
        </div>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFile" />

        <p v-if="file" class="text-xs text-green-600 flex items-center gap-1">
          <i class="fas fa-check-circle"></i> {{ file.name }}
        </p>

      </div>

      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
        <button type="button" @click="$emit('close')"
          class="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
        <button @click="submitForm" :disabled="submitting || !file"
          class="px-5 py-2 text-sm bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg font-medium flex items-center gap-2">
          <i v-if="submitting" class="fas fa-spinner fa-spin text-xs"></i>
          <i v-else class="fas fa-upload text-xs"></i>
          Upload
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { data: Object },
  data() {
    return {
      file: null,
      preview: null,
      submitting: false,
    };
  },
  methods: {
    handleFile(e) {
      const f = e.target.files[0];
      if (!f) return;
      this.file = f;
      this.preview = URL.createObjectURL(f);
    },
    async submitForm() {
      if (!this.file) return;
      this.submitting = true;
      try {
        const fd = new FormData();
        fd.append('unit_id',    this.data?.unit_id || '');
        fd.append('owner_id',   parseInt(localStorage.getItem('userId')) || '');
        fd.append('created_by', parseInt(localStorage.getItem('userId')) || '');
        fd.append('image_url',  this.file);
        await this.$apiPost('/unitimage', fd, { 'Content-Type': 'multipart/form-data' });
        this.$emit('saved');
        this.$emit('close');
      } catch (e) { console.error(e); }
      finally { this.submitting = false; }
    },
  },
};
</script>
