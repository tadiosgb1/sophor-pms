<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <Loading :visible="loading" message="Loading sales..." />

    <!-- Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <div>
        <h1 class="text-xl font-bold text-gray-800">Sales</h1>
        <p class="text-xs text-gray-400 mt-0.5">All property sale transactions</p>
      </div>
      <button @click="openAddModal"
        class="flex items-center gap-2 bg-primary hover:bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition-colors">
        <i class="fas fa-plus text-xs"></i> New Sale
      </button>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <p class="text-xs text-gray-400">Total Sales</p>
        <p class="text-2xl font-bold text-gray-800 mt-1">{{ count }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <p class="text-xs text-gray-400">Completed</p>
        <p class="text-2xl font-bold text-green-600 mt-1">{{ items.filter(i=>i.status==='completed').length }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <p class="text-xs text-gray-400">Pending</p>
        <p class="text-2xl font-bold text-yellow-500 mt-1">{{ items.filter(i=>i.status==='pending').length }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <p class="text-xs text-gray-400">Total Revenue</p>
        <p class="text-lg font-bold text-orange-500 mt-1">ETB {{ totalRevenue }}</p>
      </div>
    </div>

    <!-- Search + status filter + page size -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
      <div class="flex items-center gap-2 flex-1">
        <div class="relative w-full sm:max-w-xs">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          <input v-model="searchQuery" @input="fetchItems(1)" type="text"
            placeholder="Search by status, notes…"
            class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <select v-model="statusFilter" @change="fetchItems(1)"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-orange-400">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <span>Show</span>
        <select v-model="pageSize" @change="fetchItems(1)"
          class="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white">
          <option v-for="s in [5,10,20,50]" :key="s" :value="s">{{ s }}</option>
        </select>
        <span>entries</span>
      </div>
    </div>

    <!-- Table (desktop) -->
    <div class="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <table class="min-w-full text-sm divide-y divide-gray-100">
        <thead class="bg-gray-50 text-xs uppercase text-gray-500 font-semibold tracking-wide">
          <tr>
            <th class="px-5 py-3 text-left">#</th>
            <th class="px-5 py-3 text-left">Unit</th>
            <th class="px-5 py-3 text-left">Site</th>
            <th class="px-5 py-3 text-left">Buyer</th>
            <th class="px-5 py-3 text-right">Sale Price</th>
            <th class="px-5 py-3 text-left">Sale Date</th>
            <th class="px-5 py-3 text-left">Status</th>
            <th class="px-5 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-orange-50 transition-colors">
            <td class="px-5 py-3 text-gray-400">{{ (currentPage-1)*pageSize + index + 1 }}</td>

            <!-- Unit -->
            <td class="px-5 py-3">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                  <i class="fas fa-door-open text-xs"></i>
                </div>
                <div>
                  <p class="font-medium text-gray-800">{{ item.Unit?.name || '—' }}</p>
                  <p class="text-xs text-gray-400">{{ item.Unit?.house_number ? '#' + item.Unit.house_number : '' }}</p>
                </div>
              </div>
            </td>

            <!-- Site -->
            <td class="px-5 py-3 text-gray-600">{{ item.Site?.name || '—' }}</td>

            <!-- Buyer -->
            <td class="px-5 py-3">
              <div v-if="item.buyer" class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold shrink-0">
                  {{ item.buyer.first_name?.[0] }}
                </div>
                <span class="text-gray-700 text-xs">{{ item.buyer.first_name }} {{ item.buyer.last_name }}</span>
              </div>
              <span v-else class="text-gray-400">—</span>
            </td>

            <!-- Price -->
            <td class="px-5 py-3 text-right font-semibold text-gray-800">
              ETB {{ Number(item.sale_price).toLocaleString() }}
            </td>

            <!-- Date -->
            <td class="px-5 py-3 text-gray-600">{{ formatDate(item.sale_date) }}</td>

            <!-- Status -->
            <td class="px-5 py-3">
              <span :class="statusBadge(item.status)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">
                {{ item.status }}
              </span>
            </td>

            <!-- Actions -->
            <td class="px-5 py-3 text-center">
              <div class="flex items-center justify-center gap-3">
                <button @click="viewDetails(item.id)" class="text-orange-500 hover:text-orange-700"><i class="fas fa-eye"></i></button>
                <button @click="editItem(item)" class="text-blue-500 hover:text-blue-700"><i class="fas fa-pen"></i></button>
                <button @click="openDeleteModal(item.id)" class="text-red-400 hover:text-red-600"><i class="fas fa-trash"></i></button>
              </div>
            </td>
          </tr>
          <tr v-if="items.length === 0 && !loading">
            <td colspan="8" class="text-center py-10 text-gray-400 italic">No sales found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile cards -->
    <div class="md:hidden space-y-3">
      <div v-for="item in items" :key="item.id" class="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div class="flex items-center justify-between mb-2">
          <div>
            <p class="font-semibold text-gray-800">{{ item.Unit?.name || 'Unit —' }}</p>
            <p class="text-xs text-gray-400">{{ item.Site?.name || '—' }}</p>
          </div>
          <div class="flex gap-3 text-sm">
            <button @click="viewDetails(item.id)" class="text-orange-500"><i class="fas fa-eye"></i></button>
            <button @click="editItem(item)" class="text-blue-500"><i class="fas fa-pen"></i></button>
            <button @click="openDeleteModal(item.id)" class="text-red-400"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <div class="flex items-center justify-between text-xs text-gray-500">
          <span>{{ item.buyer?.first_name }} {{ item.buyer?.last_name }}</span>
          <span class="font-semibold text-gray-800">ETB {{ Number(item.sale_price).toLocaleString() }}</span>
          <span :class="statusBadge(item.status)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">{{ item.status }}</span>
        </div>
      </div>
      <p v-if="items.length === 0 && !loading" class="text-center text-gray-400 py-8 italic">No sales found.</p>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between mt-5 text-xs text-gray-500">
      <span>Showing {{ items.length ? (currentPage-1)*pageSize+1 : 0 }}–{{ Math.min(currentPage*pageSize, count) }} of {{ count }}</span>
      <div class="flex items-center gap-2">
        <button @click="fetchItems(currentPage-1)" :disabled="!previousPage"
          class="px-3 py-1.5 border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">← Prev</button>
        <span class="px-3 py-1.5 bg-orange-500 text-white rounded-lg font-semibold">{{ currentPage }}</span>
        <button @click="fetchItems(currentPage+1)" :disabled="!nextPage"
          class="px-3 py-1.5 border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">Next →</button>
      </div>
    </div>

    <add-sale v-if="showModal && !editMode" @close="showModal=false" @saved="fetchItems" />
    <edit-sale v-if="showModal && editMode" :data="selectedItem" @close="showModal=false" @saved="fetchItems" />
    <delete-confirm-modal :visible="deleteModalVisible" title="Delete Sale"
      message="Are you sure you want to delete this sale?"
      @confirm="confirmDelete" @cancel="deleteModalVisible=false" />
  </div>
</template>

<script>
import AddSale from "./AddSale.vue";
import EditSale from "./EditSale.vue";
import Loading from "@/components/Loading.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";

export default {
  components: { AddSale, EditSale, Loading, DeleteConfirmModal },
  data() {
    return {
      items: [], count: 0, nextPage: null, previousPage: null,
      currentPage: 1, pageSize: 10, searchQuery: "", statusFilter: "",
      showModal: false, editMode: false, selectedItem: null,
      loading: false, deleteModalVisible: false, deleteId: null,
    };
  },
  computed: {
    totalRevenue() {
      return this.items.filter(i => i.status === 'completed')
        .reduce((s, i) => s + Number(i.sale_price || 0), 0).toLocaleString();
    },
  },
  methods: {
    async fetchItems(page = 1) {
      this.loading = true;
      this.currentPage = page;
      try {
        const params = { page: this.currentPage, page_size: this.pageSize, search: this.searchQuery };
        if (this.statusFilter) params.status = this.statusFilter;
        const res = await this.$apiGet('/sale', params);
        this.items = res.data || [];
        this.count = res.count || 0;
        this.nextPage = res.next || null;
        this.previousPage = res.previous || null;
      } catch (e) { console.error(e); }
      finally { this.loading = false; }
    },
    openAddModal() { this.editMode = false; this.selectedItem = null; this.showModal = true; },
    editItem(item) { this.editMode = true; this.selectedItem = { ...item }; this.showModal = true; },
    viewDetails(id) { this.$router.push({ name: 'Sale-detail', params: { id } }); },
    openDeleteModal(id) { this.deleteId = id; this.deleteModalVisible = true; },
    async confirmDelete() {
      try { await this.$apiDelete('/sale', this.deleteId); this.fetchItems(this.currentPage); }
      catch (e) { console.error(e); } finally { this.deleteModalVisible = false; }
    },
    statusBadge(s) {
      return { completed: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', cancelled: 'bg-red-100 text-red-600' }[s] || 'bg-gray-100 text-gray-500';
    },
    formatDate(ts) {
      if (!ts) return '—';
      return new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    },
  },
  mounted() { this.fetchItems(); }
};
</script>
