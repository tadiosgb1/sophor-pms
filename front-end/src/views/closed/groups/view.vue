<template>
  <div>
    <Toast ref="toast" />
    
    <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
      <div class="max-w-7xl mx-auto">
        
        <div class="flex justify-between items-center border-b pb-4 mb-6 border-gray-200">
          <h1 class="text-lg font-bold text-gray-800">Role Management</h1>
          
          <button
            @click="visible = true"
            class="bg-green-500 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-150 ease-in-out flex items-center space-x-1 text-sm"
          >
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Group</span>
          </button>
        </div>
        
        <div class="bg-white  overflow-hidden rounded-xl border border-gray-200 p-6">
          
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search groups by name or permission..."
            class="w-full max-w-md px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150 text-sm"
          />

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  <th 
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition duration-150" 
                    @click="sortBy('name')"
                  >
                    Name
                    <SortIcon :field="'name'" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="group in filteredAndSortedGroups"
                  :key="group.id"
                  class="hover:bg-green-50 transition duration-150"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ group.name }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    <div class="flex flex-wrap gap-2">
                      <span 
                        v-for="perm in group.permissions" 
                        :key="perm" 
                        class="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium border border-green-300"
                      >
                        {{ perm }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm space-x-4">
                    <button @click="editGroup(group)" class="text-green-600 hover:text-green-800 transition duration-150" title="Edit">
                      <svg class="h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="deleteGroup(group)" class="text-red-600 hover:text-red-800 transition duration-150" title="Delete">
                      <svg class="h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredAndSortedGroups.length === 0">
                  <td colspan="3" class="text-center py-10 text-gray-500 italic">No groups found matching your criteria.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <AddGroup v-if="visible" :visible="visible" @close="visible = false" @saved="fetchGroups" />
    <UpdateGroup
      v-if="updateVisible"
      :visible="updateVisible"
      :groupData="selectedGroup"
      @close="updateVisible = false"
      @updated="fetchGroups"
    />
  </div>
</template>

<script>
import Toast from '../../../components/Toast.vue';
import AddGroup from './add.vue';
import UpdateGroup from './update.vue';

// The SortIcon component template is retained and styles updated
const SortIcon = {
props: ['field', 'sortKey', 'sortAsc'],
  template: `
    <span class="inline-block ml-1 text-gray-400">
      <svg v-if="sortKey !== field" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
      </svg>
      <svg v-else-if="sortAsc" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 13l4 4 4-4m0-6l-4-4-4 4"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
      </svg>
    </span>
  `
};

export default {
  name: 'GroupsView',
  components: { SortIcon, AddGroup, UpdateGroup ,Toast},
  data() {
    return {
      searchTerm: '',
      visible: false,
      updateVisible: false,
      selectedGroup: null,
      sortKey: 'name',
      sortAsc: true,
      groups: []
    };
  },
  computed: {
    filteredAndSortedGroups() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.groups.filter(g =>
        g.name.toLowerCase().includes(term) ||
        // Ensure g.permissions exists and is an array before calling .some()
        (Array.isArray(g.permissions) && g.permissions.some(p => p.toLowerCase().includes(term)))
      );
      
      // Sorting Logic
      filtered.sort((a, b) => {
        let res = 0;
        if (a[this.sortKey] < b[this.sortKey]) res = -1;
        if (a[this.sortKey] > b[this.sortKey]) res = 1;
        return this.sortAsc ? res : -res;
      });
      return filtered;
    }
  },
  mounted() {
    this.fetchGroups();
  },
  methods: {
    async fetchGroups() {
      try {
        const response = await this.$apiGet('/get_groups', { page_size: 1000 });
        // Assuming response.data is the array of groups
        this.groups = response.data || []; 
      } catch (error) {
        console.error('Failed to fetch groups:', error);
        // Using Toast for consistency
        this.$root.$refs.toast.showToast('Failed to load groups. Please try again later.', 'error');
        this.groups = [];
      }
    },
    sortBy(key) {
      this.sortKey === key ? (this.sortAsc = !this.sortAsc) : ((this.sortKey = key), (this.sortAsc = true));
    },
    editGroup(group) {
      this.selectedGroup = { ...group };
      this.updateVisible = true;
    },
    async deleteGroup(group) {
      if (confirm(`Are you sure you want to delete "${group.name}"? This action cannot be undone.`)) {
        try {
            // Note: Your original API call assumes the ID is part of the URL path for DELETE
            await this.$apiDelete(`/delete_group/${group.id}`);
            this.$root.$refs.toast.showToast('Group deleted successfully', 'success');
            // Optimistically update the UI by removing the item
            this.groups = this.groups.filter(g => g.id !== group.id); 
            // A full fetch ensures data integrity
            this.fetchGroups();
        } catch (err) {
          console.error(err);
          this.$root.$refs.toast.showToast('Failed to delete group.', 'error');
        }
      }
    }
  }
};
</script>