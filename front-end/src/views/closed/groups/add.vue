<template>
  <div>
    <Toast ref="toast"/>
    
    <div
      v-if="visible"
      class="fixed inset-0 w-full h-full z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto transform transition-opacity duration-300"
    >
      <div class="bg-white max-w-lg w-full rounded-xl shadow-2xl overflow-hidden relative transform transition-all duration-300 border border-gray-200">
        
        <div class="px-6 py-4 border-b border-green-200 flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-800">Add New Group</h2>
          
          <button 
            @click="$emit('close')" 
            class="text-gray-500 hover:text-red-500 transition duration-150 p-1 rounded-full hover:bg-gray-100"
            title="Close"
          >
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="p-6 grid grid-cols-1 gap-6 max-h-[70vh] overflow-y-auto">
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="e.g., Managers, Editors"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 text-sm" 
              required 
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Select Permissions ({{ form.permissions.length }} selected)</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-gray-300 bg-gray-50 rounded-lg p-4 shadow-inner">
              <label 
                v-for="perm in availablePermissions" 
                :key="perm.codename" 
                class="flex items-center space-x-3 cursor-pointer select-none hover:bg-white p-2 rounded-lg transition duration-150 border border-transparent hover:border-green-200"
              >
                <input
                  type="checkbox"
                  :value="perm.codename"
                  v-model="form.permissions"
                  class="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span class="text-sm text-gray-800">{{ perm.name }}</span>
              </label>
              <div v-if="availablePermissions.length === 0" class="sm:col-span-2 text-center text-gray-500 py-3 italic">
                  Loading permissions...
              </div>
            </div>
          </div>

          <div class="pt-4 text-right border-t border-gray-100">
            <button
              type="submit"
              :disabled="!form.name"
              class="bg-green-500 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Save Group
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
 name: "AddGroup",
  components:{Toast},
  props: {
    visible: Boolean,
  },
  data() {
    return {
      form: {
        name: '',
        permissions: []
      },
      availablePermissions: []
    };
  },
  mounted() {
    this.fetchPermissions();
  },
  methods: {
    async fetchPermissions() {
        const params={
            page_size:1000
        }

        try {
            const response = await this.$apiGet("/get_permissions",params);
            this.availablePermissions = response.data || [];
        
        } catch (err) {
            console.error("Failed to fetch permissions:", err);
            this.$root.$refs.toast.showToast('Failed to load permissions.', 'error');
            this.availablePermissions = [];
        }
    },
    async submitForm() {
      if (!this.form.name) return; // Basic validation
      
      try {
        const payload = {
          name: this.form.name,
          permissions: this.form.permissions 
        };
        
        const response = await this.$apiPost("/post_group", payload);
        this.$root.$refs.toast.showToast('Group saved successfully', 'success');
        this.$emit("saved"); // Notify parent component of successful save
        this.$emit("close");
      } catch (err) {
        console.error("Failed to create group:", err);
        this.$root.$refs.toast.showToast('Failed to save group.', 'error');
      } finally {
        // Reset form state
        this.form.name = '';
        this.form.permissions = [];
      }
    }
  }
};
</script>