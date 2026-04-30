<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md text-sm overflow-hidden">

      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-500">
            <i class="fas fa-file-contract text-sm"></i>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800">Add Sale Document</h2>
            <p class="text-xs text-gray-400">Upload a document for this sale</p>
          </div>
        </div>
        <button @click="$emit('close')"
          class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 text-lg leading-none">&times;</button>
      </div>

      <form @submit.prevent="submitForm" class="px-6 py-5 space-y-4">

        <div>
          <label class="form-label">Document Name <span class="text-red-400">*</span></label>
          <input v-model="form.document_name" type="text" required
            placeholder="e.g. Sale Agreement, Title Deed" class="form-input" />
        </div>

        <div>
          <label class="form-label">Document File <span class="text-red-400">*</span></label>
          <div class="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-orange-400 transition-colors cursor-pointer"
            @click="$refs.fileInput.click()">
            <div v-if="!file">
              <i class="fas fa-cloud-arrow-up text-2xl text-gray-300 mb-2 block"></i>
              <p class="text-xs text-gray-400">Click to upload PDF, DOC, or image</p>
            </div>
            <div v-else class="flex items-center justify-center gap-2 text-green-600">
              <i class="fas fa-file-check"></i>
              <span class="text-xs font-medium">{{ file.name }}</span>
            </div>
          </div>
          <input ref="fileInput" type="file" class="hidden" @change="handleFile" />
        </div>

      </form>

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
      form: {
        sale_id:    this.data?.sale_id    || '',
        document_name: '',
        owner_id:   parseInt(localStorage.getItem('userId')) || null,
        created_by: parseInt(localStorage.getItem('userId')) || null,
      },
      file: null,
      submitting: false,
    };
  },
  methods: {
    handleFile(e) { this.file = e.target.files[0] || null; },
    async submitForm() {
      if (!this.file) return;
      this.submitting = true;
      try {
        const fd = new FormData();
        fd.append('sale_id',       this.form.sale_id);
        fd.append('document_name', this.form.document_name);
        fd.append('owner_id',      this.form.owner_id);
        fd.append('created_by',    this.form.created_by);
        fd.append('document_url',  this.file);
        await this.$apiPost('/saledocument', fd, { 'Content-Type': 'multipart/form-data' });
        this.$emit('saved');
        this.$emit('close');
      } catch (e) { console.error(e); }
      finally { this.submitting = false; }
    },
  },
};
</script>

<style scoped>
.form-label { @apply block text-xs font-medium text-gray-600 mb-1.5; }
.form-input { @apply w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors bg-white; }
</style>
