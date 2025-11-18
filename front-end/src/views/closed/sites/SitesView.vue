
<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <h1 class="text-lg font-bold text-gray-800">Sites Overview</h1>
      <button @click="openAddModal" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-md transition duration-150 flex items-center space-x-1 text-sm">
        <span>Add Sites</span>
      </button>
    </div>

    <div class="bg-white overflow-hidden rounded-xl border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm divide-y divide-gray-200">
          <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th class="px-6 py-3 text-left">#</th>
              <th class="px-6 py-3 text-left">ReportField1</th>
              <th class="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-green-50 transition duration-150">
              <td class="px-6 py-4 whitespace-nowrap">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap font-semibold text-green-700">{{ item.reportField1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-center space-x-3">
                <button @click="editItem(item)" class="text-green-500 hover:text-green-700">Edit</button>
                <button @click="deleteItem(item.id)" class="text-red-500 hover:text-red-700">Delete</button>
              </td>
            </tr>
            <tr v-if="items.length === 0">
              <td colspan="3" class="text-center py-6 text-gray-400 italic">No Sites found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <addSites v-if="showModal && !editMode" :data="selectedItem" @close="showModal=false" @saved="fetchItems"/>
    <editSites v-if="showModal && editMode" :data="selectedItem" @close="showModal=false" @saved="fetchItems"/>
  </div>
</template>

<script>
import AddSites from './AddSites.vue';
import EditSites from './EditSites.vue';

export default {
  components: { AddSites, EditSites },
  data() {
    return {
      items: [],
      showModal: false,
      editMode: false,
      selectedItem: null
    };
  },
  methods: {
    async fetchItems() {
      try { this.items = (await this.$apiGet('/sites')).data || []; }
      catch(err){ console.error(err); this.items = []; }
    },
    openAddModal() { this.editMode = false; this.selectedItem = null; this.showModal = true; },
    editItem(item) { this.editMode = true; this.selectedItem = item; this.showModal = true; },
    async deleteItem(id) { 
      if(confirm('Are you sure?')) { 
        try { await this.$apiDelete(`/sites/${id}/`); this.fetchItems(); } 
        catch(err){ console.error(err); }
      }
    }
  },
  mounted() { this.fetchItems(); }
};
</script>
