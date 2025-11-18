<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-sm transform transition-all duration-300 border border-gray-200">
      
      <div class="border-b pb-3 mb-4 border-green-100">
          <h2 class="text-xl font-semibold text-gray-800">Edit Promoter Buyer</h2>
      </div>

      <form @submit.prevent="updateItem" class="space-y-4">
        
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Promoter ID</label>
          <input 
            v-model="form.promoter" 
            type="number" 
            class="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" 
            required 
          />
        </div>
        
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Buyer ID</label>
          <input 
            v-model="form.buyer" 
            type="number" 
            class="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm" 
            required 
          />
        </div>
        
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150 text-sm font-medium"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition duration-150 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: ['item'],
  data() {
    return { form: { id: null, promoter: '', buyer: '' } };
  },
  watch: {
    item: { 
        immediate: true, 
        handler(val) { 
            // Ensure data types are consistent for input fields if necessary, 
            // although v-model handles it well for strings/numbers.
            if (val) this.form = { ...val }; 
        } 
    }
  },
  methods: {
    async updateItem() {
      try {
        // Using $apiPut with the original structure: endpoint, id, data
        const res = await this.$apiPut('/update_promoter_buyer', this.form.id, this.form);
        if (res) this.$root.$refs.toast.showToast("Updated successfully", "success");
        this.$emit('saved');
        this.$emit('close');
      } catch (err) {
        console.error(err);
        this.$root.$refs.toast.showToast("Update failed", "error");
      }
    },
  },
};
</script>