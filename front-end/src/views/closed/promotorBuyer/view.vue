<template>
  <div class="text-sm text-gray-800 ">
    <div class="flex items-center justify-between border-b pb-4 mb-4 border-gray-200">
      <h1 class="text-xl font-semibold text-gray-800">Promoter Buyers</h1>
      <button 
        @click="showAdd = true" 
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition duration-150 flex items-center"
      >
        + Add Promoter Buyer
      </button>
    </div>

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
      <input
        v-model="searchQuery"
        @input="fetchData(1)"
        type="text"
        placeholder="Search by promoter or buyer..."
        class="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
      />
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <label>Show</label>
        <select 
          v-model="pageSize" 
          @change="fetchData(1)" 
          class="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-green-500"
        >
          <option v-for="size in [5,10,20,50]" :key="size" :value="size">{{ size }}</option>
        </select>
        <span>entries</span>
      </div>
    </div>

    <div class="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
      <table class="min-w-full text-sm hidden sm:table divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Promoter</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Buyer</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr 
            v-for="(item, index) in list" 
            :key="item.id" 
            class="hover:bg-gray-50 transition duration-150"
          >
            <td class="px-6 py-3 whitespace-nowrap">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td class="px-6 py-3 whitespace-nowrap font-medium text-green-700">{{ item.promoter }}</td>
            <td class="px-6 py-3 whitespace-nowrap">{{ item.buyer }}</td>
            <td class="px-6 py-3 whitespace-nowrap text-gray-500">{{ formatDate(item.created_at) }}</td>
            <td class="px-6 py-3 whitespace-nowrap flex gap-3">
              <button 
                class="text-green-500 hover:text-green-700 transition duration-150" 
                @click="openEdit(item)"
                title="Edit"
              >
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button 
                class="text-red-500 hover:text-red-700 transition duration-150" 
                @click="deleteItem(item.id)"
                title="Delete"
              >
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="list.length === 0">
            <td colspan="5" class="text-center py-8 text-gray-400 italic">No records found.</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="flex items-center justify-between mt-6 text-sm">
      <span class="text-gray-600"
        >Showing Page **{{ currentPage }}** of **{{ totalPages }}** ({{ count }} total entries)</span
      >
      <div class="flex items-center gap-2">
        <button 
          @click="fetchData(currentPage - 1)" 
          :disabled="!previousPage"
          class="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition duration-150"
        >
          &larr; Prev
        </button>
        <button 
          @click="fetchData(currentPage + 1)" 
          :disabled="!nextPage"
          class="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition duration-150"
        >
          Next &rarr;
        </button>
      </div>
    </div>

    <AddPromoterBuyer v-if="showAdd" @close="showAdd=false" @saved="fetchData" />
    <EditPromoterBuyer v-if="showEdit" :item="selectedItem" @close="showEdit=false" @saved="fetchData" />
  </div>
</template>

<script>
import AddPromoterBuyer from './AddPromoterBuyer.vue';
import EditPromoterBuyer from './EditPromoterBuyer.vue';

export default {
  components: { AddPromoterBuyer, EditPromoterBuyer },
  data() {
    return {
      list: [],
      count: 0,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10,
      nextPage: null,
      previousPage: null,
      searchQuery: '',
      showAdd: false,
      showEdit: false,
      selectedItem: null,
    };
  },
  methods: {
    async fetchData(page = 1) {
      try {
        const params = { page, page_size: this.pageSize, search: this.searchQuery || undefined };
        const res = await this.$apiGet('/get_promoter_buyers', params);
        this.list = res.data || [];
        this.count = res.count;
        this.totalPages = res.total_pages;
        this.currentPage = res.current_page;
        this.nextPage = res.next;
        this.previousPage = res.previous;
      } catch (err) { console.error(err); }
    },
    openEdit(item) {
      this.selectedItem = item;
      this.showEdit = true;
    },
    async deleteItem(id) {
      if (!confirm('Are you sure?')) return;
      try {
        const res = await this.$apiDelete(`/delete_promoter_buyer`, id);
        if (res) this.$root.$refs.toast.showToast("Deleted successfully", "success");
        this.fetchData(this.currentPage);
      } catch (err) {
        console.error(err);
        this.$root.$refs.toast.showToast("Delete failed", "error");
      }
    },
    formatDate(dateStr) { 
        // Defensive check for dateStr
        if (!dateStr) return '-';
        try {
            return new Date(dateStr).toLocaleDateString();
        } catch (e) {
            return dateStr; // Return original if parsing fails
        }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>