<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <h1 class="text-lg font-bold text-gray-800">Commissions Overview</h1>
      <button
        @click="openAddModal"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-md transition duration-150 flex items-center space-x-1 text-sm"
      >
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Add Commission</span>
      </button>
    </div>

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
      <input
        v-model="searchQuery"
        @input="fetchCommissions(1)"
        type="text"
        placeholder="Search by seller/buyer email..."
        class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150"
      />
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <label>Show</label>
        <select
          v-model="pageSize"
          @change="fetchCommissions(1)"
          class="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white focus:ring-green-500 focus:border-green-500"
        >
          <option v-for="size in [5,10,20,50,100]" :key="size" :value="size">{{ size }}</option>
        </select>
        <span>entries</span>
      </div>
    </div>

    <div class="bg-white overflow-hidden rounded-xl border border-gray-200 hidden md:block">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm divide-y divide-gray-200">
          <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th class="px-6 py-3 text-left">#</th>
              <th class="px-6 py-3 text-left">Amount</th>
              <th class="px-6 py-3 text-left">Sale ID</th>
              <th class="px-6 py-3 text-left">Seller</th>
              <th class="px-6 py-3 text-left">Buyer</th>
              <th class="px-6 py-3 text-left">Created</th>
              <th class="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(commission, index) in commissionsArray"
              :key="commission.id"
              class="hover:bg-green-50 transition duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap font-semibold text-green-700">
                {{ parseFloat(commission.amount || 0).toFixed(2) }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <span>{{ commission.sale?.id || '-' }}</span>
                  <button
                    v-if="commission.sale?.id"
                    @click="goToSaleDetail(commission.sale.id)"
                    class="text-blue-600 hover:text-blue-800"
                    title="View Sale Detail"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <span>{{ commission.sale?.seller?.email || '-' }}</span>
                  <button
                    v-if="commission.sale?.seller?.id"
                    @click="goToUserDetail(commission.sale.seller.id)"
                    class="text-green-600 hover:text-green-800"
                    title="View Seller Detail"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  </button>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <span>{{ commission.sale?.buyer?.email || '-' }}</span>
                  <button
                    v-if="commission.sale?.buyer?.id"
                    @click="goToUserDetail(commission.sale.buyer.id)"
                    class="text-purple-600 hover:text-purple-800"
                    title="View Buyer Detail"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  </button>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                {{ new Date(commission.created_at).toLocaleDateString() }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-center space-x-3">
                <button @click="editCommission(commission)" class="text-green-500 hover:text-green-700 transition duration-150" title="Edit">
                  <svg class="h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button @click="deleteCommission(commission.id)" class="text-red-500 hover:text-red-700 transition duration-150" title="Delete">
                  <svg class="h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </td>
            </tr>

            <tr v-if="commissionsArray.length === 0">
              <td colspan="7" class="text-center py-6 text-gray-400 italic">
                No commissions found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="md:hidden space-y-4">
      <div
        v-for="(commission, index) in commissionsArray"
        :key="commission.id"
        class="bg-white border border-gray-200 rounded-xl shadow-md p-4"
      >
        <div class="flex justify-between items-start mb-3 border-b pb-2">
          <h2 class="font-bold text-gray-800">Commission #{{ (currentPage - 1) * pageSize + index + 1 }}</h2>
          <div class="flex gap-3 text-sm">
            <button @click="editCommission(commission)" class="text-green-500 hover:text-green-700" title="Edit">
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
            <button @click="deleteCommission(commission.id)" class="text-red-500 hover:text-red-700" title="Delete">
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
          <div><span class="font-medium text-gray-600">Amount:</span> <span class="font-semibold text-green-700">{{ parseFloat(commission.amount || 0).toFixed(2) }}</span></div>
          <div><span class="font-medium text-gray-600">Created:</span> {{ new Date(commission.created_at).toLocaleDateString() }}</div>
          
          <div class="col-span-2"><span class="font-medium text-gray-600">Sale ID:</span> {{ commission.sale?.id || '-' }}</div>
          <div class="col-span-2"><span class="font-medium text-gray-600">Seller:</span> {{ commission.sale?.seller?.email || '-' }}</div>
          <div class="col-span-2"><span class="font-medium text-gray-600">Buyer:</span> {{ commission.sale?.buyer?.email || '-' }}</div>
        </div>

        <div class="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-3 text-xs">
          <button
            v-if="commission.sale?.id"
            @click="goToSaleDetail(commission.sale.id)"
            class="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            Sale
          </button>
          <button
            v-if="commission.sale?.seller?.id"
            @click="goToUserDetail(commission.sale.seller.id)"
            class="text-green-600 hover:text-green-800 flex items-center gap-1"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Seller
          </button>
          <button
            v-if="commission.sale?.buyer?.id"
            @click="goToUserDetail(commission.sale.buyer.id)"
            class="text-purple-600 hover:text-purple-800 flex items-center gap-1"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Buyer
          </button>
        </div>
      </div>

      <p v-if="commissionsArray.length === 0" class="text-center text-gray-400 py-6 italic">
        No commissions found.
      </p>
    </div>

    <div class="flex items-center justify-between mt-6 text-sm text-gray-600">
      <span>Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, count) }} of {{ count }} total entries</span>
      <div class="flex items-center gap-2">
        <button
          @click="fetchCommissions(currentPage - 1)"
          :disabled="!previousPage"
          class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
        >
          &larr; Previous
        </button>
        <span class="px-3 py-1 bg-green-600 text-white rounded-lg font-medium">{{ currentPage }}</span>
        <button
          @click="fetchCommissions(currentPage + 1)"
          :disabled="!nextPage"
          class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
        >
          Next &rarr;
        </button>
      </div>
    </div>

    <div
      v-if="showAddEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-sm transform transition-all duration-300">
        <h2 class="text-lg font-semibold mb-4 border-b pb-2 text-gray-800">
          {{ editMode ? 'Edit Commission' : 'Add New Commission' }}
        </h2>
        <form @submit.prevent="saveCommission" class="space-y-4">
          <div class="mb-2">
            <label class="block mb-1 text-sm font-medium text-gray-700">Amount (e.g., 100.00)</label>
            <input
              v-model="form.amount"
              type="text"
              class="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              required
            />
          </div>
          <div class="mb-2">
            <label class="block mb-1 text-sm font-medium text-gray-700">Sale ID (Related Sale)</label>
            <input
              v-model="form.sale"
              type="number"
              class="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              required
            />
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              @click="showAddEditModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition duration-150 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {{ editMode ? 'Update' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-sm">
        <h2 class="text-lg font-semibold mb-3 text-red-600">Confirm Deletion</h2>
        <p class="text-gray-700">Are you sure you want to delete this commission?</p>
        <div class="flex justify-end gap-3 mt-4">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition duration-150 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      commissionsArray: [],
      count: 0,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10,
      nextPage: null,
      previousPage: null,
      searchQuery: "",

      // Add/Edit modal
      showAddEditModal: false,
      editMode: false,
      form: { amount: "", sale: null },

      // Delete modal
      showDeleteModal: false,
      commissionToDelete: null,
    };
  },
  methods: {
    async fetchCommissions(page = 1) {
      try {
        const params = { page, page_size: this.pageSize, search: this.searchQuery || undefined };
        const res = await this.$apiGet("/get_commissions", params);
        const data = res.data || {};
        
        // REVERTED LOGIC: Keeping original data assignment for commissions array
        this.commissionsArray = data.results || data || []; 
        // Note: Using data.results || data for robust compatibility, 
        // but reverting to original *data || []* structure for direct compliance.
        // Let's stick to the structure that assumes 'data' is the array if it's not a full pagination object:
        
        // This is the simplest compliant structure to your original working logic:
        this.commissionsArray = Array.isArray(data) ? data : (data.results || []);

        this.count = data.count || (Array.isArray(data) ? data.length : 0);
        this.totalPages = data.total_pages || 1;
        this.currentPage = data.current_page || page;
        this.nextPage = !!data.next;
        this.previousPage = !!data.previous;
      } catch (err) {
        console.error(err);
        this.commissionsArray = [];
      }
    },
    openAddModal() {
      this.editMode = false;
      this.form = { amount: "", sale: null };
      this.showAddEditModal = true;
    },
    editCommission(commission) {
      this.editMode = true;
      // Added 'id' to form for update logic
      this.form = { id: commission.id, amount: commission.amount, sale: commission.sale?.id };
      this.showAddEditModal = true;
    },
    async saveCommission() {
      try {
        const payload = { amount: this.form.amount, sale: this.form.sale };

        if (this.editMode) {
          // Using commission ID (this.form.id) for update, falling back to sale ID for compliance if ID is missing.
          await this.$apiPatch(`/update_commission/${this.form.id || this.form.sale}/`, payload);
        } else {
          await this.$apiPost("/post_commission", payload);
        }
        this.showAddEditModal = false;
        this.fetchCommissions(this.currentPage);
      } catch (err) {
        console.error(err);
      }
    },
    deleteCommission(id) {
      this.commissionToDelete = id;
      this.showDeleteModal = true;
    },
    async confirmDelete() {
      try {
        await this.$apiDelete(`/delete_commission/${this.commissionToDelete}/`);
        this.showDeleteModal = false;
        this.fetchCommissions(this.currentPage);
      } catch (err) {
        console.error(err);
      }
    },
    goToSaleDetail(id) {
      this.$router.push(`/sale_detail/${id}`);
    },
    goToUserDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },
  },
  mounted() {
    this.fetchCommissions();
  },
};
</script>

<style scoped>
/* Standardizing table layout */
.overflow-x-auto table th, .overflow-x-auto table td { white-space: nowrap; }
</style>