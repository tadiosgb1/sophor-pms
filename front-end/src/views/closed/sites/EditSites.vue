
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-sm transform transition-all duration-300">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800">Edit Sites</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">&times;</button>
      </div>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div class="mb-2">
          <label class="block mb-1 text-sm font-medium text-gray-700">ReportField1</label>
          <input 
            v-model="form.reportField1" 
            type="text" 
            required
            class="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150"
          />
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150 text-sm font-medium">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition duration-150 text-sm font-medium">Edit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: { data: Object },
  data() {
    return { form: { reportField1: this.data?.reportField1 || '' } };
  },
  methods: {
    async submitForm() {
      try {
        if ('Edit' === 'Add') {
          await this.$apiPost('/sites', this.form);
        } else {
          await this.$apiPatch(`/sites/${this.data.id}/`, this.form);
        }
        this.$emit('saved');
        this.$emit('close');
      } catch (err) { console.error(err); }
    }
  }
};
</script>
