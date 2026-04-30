<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <Loading :visible="loading" message="Loading expenses..." />

    <!-- Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <div>
        <h1 class="text-xl font-bold text-gray-800">Expenses</h1>
        <p class="text-xs text-gray-400 mt-0.5">Track all property-related expenditures</p>
      </div>
      <button @click="openAddModal"
        class="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition-colors">
        <i class="fas fa-plus text-xs"></i> Add Expense
      </button>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <p class="text-xs text-gray-400">Total Expenses</p>
        <p class="text-2xl font-bold text-gray-800 mt-1">{{ count }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <p class="text-xs text-gray-400">Total Amount</p>
        <p class="text-xl font-bold text-red-500 mt-1">ETB {{ totalAmount }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <p class="text-xs text-gray-400">This Page Avg</p>
        <p class="text-xl font-bold text-orange-500 mt-1">ETB {{ avgAmount }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <p class="text-xs text-gray-400">Categories</p>
        <p class="text-2xl font-bold text-blue-500 mt-1">{{ uniqueCategories }}</p>
      </div>
    </div>

    <!-- Search + category filter + page size -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
      <div class="flex items-center gap-2 flex-1">
        <div class="relative w-full sm:max-w-xs">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          <input v-model="searchQuery" @input="fetchItems(1)" type="text"
            placeholder="Search by category, description…"
            class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <select v-model="categoryFilter" @change="fetchItems(1)"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-orange-400">
          <option value="">All Categories</option>
          <option v-for="c in categoryOptions" :key="c" :value="c">{{ c }}</option>
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
            <th class="px-5 py-3 text-left">Category</th>
            <th class="px-5 py-3 text-left">Description</th>
            <th class="px-5 py-3 text-left">Site</th>
            <th class="px-5 py-3 text-left">Date</th>
            <th class="px-5 py-3 text-right">Amount</th>
            <th class="px-5 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-orange-50 transition-colors">
            <td class="px-5 py-3 text-gray-400">{{ (currentPage-1)*pageSize + index + 1 }}</td>

            <!-- Category badge -->
            <td class="px-5 py-3">
              <div class="flex items-center gap-2">
                <div :class="categoryIconClass(item.category)"
                  class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                  <i :class="categoryIcon(item.category)" class="text-xs"></i>
                </div>
                <span :class="categoryBadgeClass(item.category)"
                  class="px-2 py-0.5 rounded-full text-xs font-medium">
                  {{ item.category }}
                </span>
              </div>
            </td>

            <!-- Description -->
            <td class="px-5 py-3 text-gray-600 max-w-xs truncate">{{ item.description || '—' }}</td>

            <!-- Site -->
            <td class="px-5 py-3 text-gray-600">{{ item.site?.name || '—' }}</td>

            <!-- Date -->
            <td class="px-5 py-3 text-gray-600">{{ formatDate(item.expense_date) }}</td>

            <!-- Amount -->
            <td class="px-5 py-3 text-right font-semibold text-red-500">
              ETB {{ Number(item.amount).toLocaleString() }}
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
            <td colspan="7" class="text-center py-10 text-gray-400 italic">No expenses found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile cards -->
    <div class="md:hidden space-y-3">
      <div v-for="item in items" :key="item.id" class="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div :class="categoryIconClass(item.category)" class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
              <i :class="categoryIcon(item.category)" class="text-xs"></i>
            </div>
            <div>
              <span :class="categoryBadgeClass(item.category)" class="px-2 py-0.5 rounded-full text-xs font-medium">{{ item.category }}</span>
              <p class="text-xs text-gray-400 mt-0.5">{{ item.site?.name || '—' }} · {{ formatDate(item.expense_date) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-bold text-red-500 text-sm">ETB {{ Number(item.amount).toLocaleString() }}</span>
            <div class="flex gap-2 text-sm">
              <button @click="viewDetails(item.id)" class="text-orange-500"><i class="fas fa-eye"></i></button>
              <button @click="editItem(item)" class="text-blue-500"><i class="fas fa-pen"></i></button>
              <button @click="openDeleteModal(item.id)" class="text-red-400"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        </div>
        <p v-if="item.description" class="text-xs text-gray-500 truncate">{{ item.description }}</p>
      </div>
      <p v-if="items.length === 0 && !loading" class="text-center text-gray-400 py-8 italic">No expenses found.</p>
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

    <add-expense v-if="showModal && !editMode" @close="showModal=false" @saved="fetchItems" />
    <edit-expense v-if="showModal && editMode" :data="selectedItem" @close="showModal=false" @saved="fetchItems" />
    <delete-confirm-modal :visible="deleteModalVisible" title="Delete Expense"
      message="Are you sure you want to delete this expense?"
      @confirm="confirmDelete" @cancel="deleteModalVisible=false" />
  </div>
</template>

<script>
import AddExpense from "./AddExpense.vue";
import EditExpense from "./EditExpense.vue";
import Loading from "@/components/Loading.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";

export default {
  components: { AddExpense, EditExpense, Loading, DeleteConfirmModal },
  data() {
    return {
      items: [], count: 0, nextPage: null, previousPage: null,
      currentPage: 1, pageSize: 10, searchQuery: "", categoryFilter: "",
      showModal: false, editMode: false, selectedItem: null,
      loading: false, deleteModalVisible: false, deleteId: null,
      categoryOptions: ['Maintenance', 'Utilities', 'Cleaning', 'Security', 'Repairs', 'Salaries', 'Insurance', 'Other'],
    };
  },
  computed: {
    totalAmount() {
      return this.items.reduce((s, i) => s + Number(i.amount || 0), 0).toLocaleString();
    },
    avgAmount() {
      if (!this.items.length) return '0';
      return Math.round(this.items.reduce((s, i) => s + Number(i.amount || 0), 0) / this.items.length).toLocaleString();
    },
    uniqueCategories() {
      return new Set(this.items.map(i => i.category)).size;
    },
  },
  methods: {
    async fetchItems(page = 1) {
      this.loading = true;
      this.currentPage = page;
      try {
        const params = { page: this.currentPage, page_size: this.pageSize, search: this.searchQuery };
        if (this.categoryFilter) params.category = this.categoryFilter;
        const res = await this.$apiGet('/expense', params);
        this.items = res.data || [];
        this.count = res.count || 0;
        this.nextPage = res.next || null;
        this.previousPage = res.previous || null;
      } catch (e) { console.error(e); }
      finally { this.loading = false; }
    },
    openAddModal() { this.editMode = false; this.selectedItem = null; this.showModal = true; },
    editItem(item) { this.editMode = true; this.selectedItem = { ...item }; this.showModal = true; },
    viewDetails(id) { this.$router.push({ name: 'Expense-detail', params: { id } }); },
    openDeleteModal(id) { this.deleteId = id; this.deleteModalVisible = true; },
    async confirmDelete() {
      try { await this.$apiDelete('/expense', this.deleteId); this.fetchItems(this.currentPage); }
      catch (e) { console.error(e); } finally { this.deleteModalVisible = false; }
    },
    categoryIconClass(c) {
      const map = { Maintenance: 'bg-yellow-100 text-yellow-600', Utilities: 'bg-blue-100 text-blue-600', Cleaning: 'bg-teal-100 text-teal-600', Security: 'bg-red-100 text-red-600', Repairs: 'bg-orange-100 text-orange-600', Salaries: 'bg-purple-100 text-purple-600', Insurance: 'bg-indigo-100 text-indigo-600' };
      return map[c] || 'bg-gray-100 text-gray-500';
    },
    categoryIcon(c) {
      const map = { Maintenance: 'fas fa-wrench', Utilities: 'fas fa-bolt', Cleaning: 'fas fa-broom', Security: 'fas fa-shield-halved', Repairs: 'fas fa-screwdriver-wrench', Salaries: 'fas fa-user-tie', Insurance: 'fas fa-file-shield' };
      return map[c] || 'fas fa-receipt';
    },
    categoryBadgeClass(c) {
      const map = { Maintenance: 'bg-yellow-100 text-yellow-700', Utilities: 'bg-blue-100 text-blue-700', Cleaning: 'bg-teal-100 text-teal-700', Security: 'bg-red-100 text-red-700', Repairs: 'bg-orange-100 text-orange-700', Salaries: 'bg-purple-100 text-purple-700', Insurance: 'bg-indigo-100 text-indigo-700' };
      return map[c] || 'bg-gray-100 text-gray-600';
    },
    formatDate(ts) {
      if (!ts) return '—';
      return new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    },
  },
  mounted() { this.fetchItems(); }
};
</script>
