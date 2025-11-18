<template>
  <div>
    <Toast ref="toast"/>
    
    <div
      v-if="visible"
      class="fixed inset-0 w-full h-full z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-white max-w-md w-full rounded-lg shadow-2xl overflow-hidden relative transform transition-all duration-300">
        
        <div class="px-6 py-4 border-b border-green-500 flex justify-between items-center bg-gray-50">
          <h2 class="text-xl font-semibold text-gray-800">Edit Permission</h2>
          
          <button 
            @click="$emit('close')" 
            class="text-gray-500 hover:text-gray-700 transition duration-150 p-1 rounded-full hover:bg-gray-200"
          >
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
            <input 
              v-model="form.content_type" 
              type="number" 
              class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 transition duration-150" 
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              v-model="form.name" 
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 transition duration-150" 
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Codename</label>
            <input 
              v-model="form.codename" 
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 transition duration-150" 
            />
          </div>

          <div class="pt-4 text-right border-t border-gray-200">
            <button
              type="submit"
              class="bg-green-500 text-white font-medium px-6 py-2 rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
            >
              Update Permission
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from '../../../components/Toast.vue';

export default {
  name: "UpdatePermission",
  props: {
    visible: Boolean,
    permission: Object,
  },
  data() {
    return {
      form: {
        id: null,
        content_type: 20,
        name: '',
        codename: '',
      },
    };
  },
  watch: {
    permission: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form = { ...newVal }; // clone to avoid direct mutation
        }
      }
    }
  },
  methods: {
    async submitForm() {
      try {
        await this.$apiPut("/update_permission", this.form.id, this.form);
        this.$root.$refs.toast.showToast('Permission Updated successfully ', 'success');
       setTimeout(() => {
  this.$emit("close");
}, 3000); // 3000 milliseconds = 3 seconds
        this.$emit("refresh");
      } catch (error) {
        console.error("Error updating permission:", error);
        alert("Failed to update permission.");
      }
    }
  }
};
</script>