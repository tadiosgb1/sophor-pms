<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md text-sm overflow-hidden">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-500">
            <i class="fas fa-tags text-sm"></i>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800">Change Unit Type</h2>
            <p class="text-xs text-gray-400">Select a type for this unit</p>
          </div>
        </div>
        <button @click="$emit('close')"
          class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 text-lg leading-none">&times;</button>
      </div>

      <!-- Body -->
      <div class="px-6 py-5 max-h-[60vh] overflow-y-auto">
        <div v-if="loadingTypes" class="text-center py-6 text-gray-400 text-xs">
          <i class="fas fa-spinner fa-spin mr-2"></i> Loading types…
        </div>
        <div v-else class="grid grid-cols-2 gap-2">
          <button v-for="type in types" :key="type.id"
            type="button"
            @click="selectedTypeId = type.id"
            :class="[
              'flex flex-col items-start gap-1 px-4 py-3 rounded-xl border-2 transition-all text-left',
              selectedTypeId === type.id
                ? 'border-teal-400 bg-teal-50 text-teal-700'
                : 'border-gray-200 text-gray-600 hover:border-teal-300'
            ]">
            <div class="flex items-center gap-2 w-full">
              <div :class="selectedTypeId === type.id ? 'bg-teal-400' : 'bg-gray-200'"
                class="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors">
                <i v-if="selectedTypeId === type.id" class="fas fa-check text-white text-[8px]"></i>
              </div>
              <span class="font-medium text-xs">{{ type.name }}</span>
            </div>
            <span v-if="type.category" class="text-[10px] text-gray-400 ml-6">{{ type.category }}</span>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
        <button type="button" @click="$emit('close')"
          class="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
        <button @click="submitChange" :disabled="submitting || !selectedTypeId"
          class="px-5 py-2 text-sm bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white rounded-lg font-medium flex items-center gap-2">
          <i v-if="submitting" class="fas fa-spinner fa-spin text-xs"></i>
          <i v-else class="fas fa-check text-xs"></i>
          Apply
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    unit: { type: Object, required: true },
  },
  data() {
    return {
      types: [],
      selectedTypeId: this.unit?.type_id || null,
      loadingTypes: false,
      submitting: false,
    };
  },
  methods: {
    async fetchTypes() {
      this.loadingTypes = true;
      try {
        const res = await this.$apiGet('/type', { page_size: 200 });
        this.types = res.data || [];
      } catch (e) { console.error(e); }
      finally { this.loadingTypes = false; }
    },
    async submitChange() {
      if (!this.selectedTypeId) return;
      this.submitting = true;
      try {
        await this.$apiPut('/unit', this.unit.id, {
          type_id:    this.selectedTypeId,
          updated_by: parseInt(localStorage.getItem('userId')) || null,
        });
        this.$emit('saved');
        this.$emit('close');
      } catch (e) { console.error(e); }
      finally { this.submitting = false; }
    },
  },
  mounted() { this.fetchTypes(); },
};
</script>
