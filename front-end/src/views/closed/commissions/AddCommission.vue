<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-sm transform transition-all duration-300">
      <h2 class="text-lg font-semibold mb-4 border-b pb-2 text-gray-800">Add New Commission</h2>
      
      <form @submit.prevent="saveCommission" class="space-y-4">
        
        <div class="mb-2">
          <label class="block mb-1 text-sm font-medium text-gray-700">Amount (e.g., 100.00)</label>
          <input 
            type="text" 
            v-model="form.amount" 
            class="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150" 
            required
          />
        </div>
        
        <div class="mb-3">
          <label class="block mb-1 text-sm font-medium text-gray-700">Sale ID (Related Sale)</label>
          <input 
            type="number" 
            v-model="form.sale" 
            class="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150" 
            required
          />
        </div>
        
        <div class="flex justify-end gap-3 pt-2">
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
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data(){ 
    return { 
        form:{ amount:'', sale:null } 
    }; 
},
  methods:{
    async saveCommission(){
      try{ 
        await this.$apiPost('/post_commission', this.form); 
        this.$emit('saved'); 
        this.$emit('close'); 
      }
      catch(err){ 
        console.error(err); 
      }
    }
  }
};
</script>