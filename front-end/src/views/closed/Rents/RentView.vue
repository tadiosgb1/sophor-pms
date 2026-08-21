<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <Loading :visible="loading" message="Loading rentals..." />

    <!-- Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <div>
        <h1 class="text-xl font-bold text-gray-800">Rentals</h1>
        <p class="text-xs text-gray-400 mt-0.5">All active and past rental agreements</p>
      </div>
      <button @click="openAddModal"
        class="flex items-center gap-2 bg-primary hover:bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition-colors">
        <i class="fas fa-plus text-xs"></i> New Rental
      </button>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <p class="text-xs text-gray-400">Total Rentals</p>
        <p class="text-2xl font-bold text-gray-800 mt-1">{{ count }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <p class="text-xs text-gray-400">Active</p>
        <p class="text-2xl font-bold text-green-600 mt-1">{{ items.filter(i=>i.status==='active').length }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <p class="text-xs text-gray-400">Overdue</p>
        <p class="text-2xl font-bold text-red-500 mt-1">{{ overdueCount }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <p class="text-xs text-gray-400">Monthly Revenue</p>
        <p class="text-lg font-bold text-orange-500 mt-1">ETB {{ monthlyRevenue }}</p>
      </div>
    </div>

    <!-- Search + status filter + page size -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
      <div class="flex items-center gap-2 flex-1">
        <div class="relative w-full sm:max-w-xs">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          <input v-model="searchQuery" @input="fetchItems(1)" type="text"
            placeholder="Search by period, status…"
            class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <select v-model="statusFilter" @change="fetchItems(1)"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-orange-400">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="terminated">Terminated</option>
          <option value="pending">Pending</option>
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
            <th class="px-5 py-3 text-left">Renter</th>
            <th class="px-5 py-3 text-right">Rent Amount</th>
            <th class="px-5 py-3 text-left">Period</th>
            <th class="px-5 py-3 text-left">Next Due</th>
            <th class="px-5 py-3 text-left">Status</th>
            <th class="px-5 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(item, index) in items" :key="item.id"
            class="hover:bg-orange-50 transition-colors"
            :class="{ 'bg-red-50': isOverdue(item) }">
            <td class="px-5 py-3 text-gray-400">{{ (currentPage-1)*pageSize + index + 1 }}</td>

            <!-- Unit -->
            <td class="px-5 py-3">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                  <i class="fas fa-house-user text-xs"></i>
                </div>
                <div>
                  <p class="font-medium text-gray-800">{{ item.Unit?.name || '—' }}</p>
                  <p class="text-xs text-gray-400">{{ item.Unit?.house_number ? '#' + item.Unit.house_number : '' }}</p>
                </div>
              </div>
            </td>

            <!-- Site -->
            <td class="px-5 py-3 text-gray-600">{{ item.Site?.name || '—' }}</td>

            <!-- Renter -->
            <td class="px-5 py-3">
              <div v-if="item.renter" class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold shrink-0">
                  {{ item.renter.first_name?.[0] }}
                </div>
                <span class="text-gray-700 text-xs">{{ item.renter.first_name }} {{ item.renter.last_name }}</span>
              </div>
              <span v-else class="text-gray-400">—</span>
            </td>

            <!-- Rent amount -->
            <td class="px-5 py-3 text-right font-semibold text-gray-800">
              ETB {{ Number(item.rent_amount).toLocaleString() }}
            </td>

            <!-- Period -->
            <td class="px-5 py-3 text-gray-600 capitalize">{{ item.rent_period }}</td>

            <!-- Next due -->
            <td class="px-5 py-3">
              <span :class="isOverdue(item) ? 'text-red-600 font-semibold' : 'text-gray-600'">
                {{ formatDate(item.next_due_date) }}
              </span>
              <span v-if="isOverdue(item)" class="ml-1 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Overdue</span>
            </td>

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
            <td colspan="9" class="text-center py-10 text-gray-400 italic">No rentals found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile cards -->
    <div class="md:hidden space-y-3">
      <div v-for="item in items" :key="item.id"
        class="bg-white border border-gray-200 rounded-xl shadow-sm p-4"
        :class="{ 'border-red-200 bg-red-50': isOverdue(item) }">
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
          <span>{{ item.renter?.first_name }} {{ item.renter?.last_name }}</span>
          <span class="font-semibold text-gray-800">ETB {{ Number(item.rent_amount).toLocaleString() }}</span>
          <span :class="statusBadge(item.status)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">{{ item.status }}</span>
        </div>
      </div>
      <p v-if="items.length === 0 && !loading" class="text-center text-gray-400 py-8 italic">No rentals found.</p>
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

    <add-rent v-if="showModal && !editMode" @close="showModal=false" @saved="fetchItems" />
    <edit-rent v-if="showModal && editMode" :data="selectedItem" @close="showModal=false" @saved="fetchItems" />
    <delete-confirm-modal :visible="deleteModalVisible" title="Delete Rental"
      message="Are you sure you want to delete this rental?"
      @confirm="confirmDelete" @cancel="deleteModalVisible=false" />
  </div>
</template>

<script>
import AddRent from "./AddRent.vue";
import EditRent from "./EditRent.vue";
import Loading from "@/components/Loading.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";

export default {
  components: { AddRent, EditRent, Loading, DeleteConfirmModal },
  data() {
    return {
      items: [], count: 0, nextPage: null, previousPage: null,
      currentPage: 1, pageSize: 10, searchQuery: "", statusFilter: "",
      showModal: false, editMode: false, selectedItem: null,
      loading: false, deleteModalVisible: false, deleteId: null,
    };
  },
  computed: {
    overdueCount() {
      const today = new Date();
      return this.items.filter(i => i.status === 'active' && i.next_due_date && new Date(i.next_due_date) < today).length;
    },
    monthlyRevenue() {
      return this.items.filter(i => i.status === 'active')
        .reduce((s, i) => s + Number(i.rent_amount || 0), 0).toLocaleString();
    },
  },
  methods: {
    async fetchItems(page = 1) {
      this.loading = true;
      this.currentPage = page;
      try {
        const params = { page: this.currentPage, page_size: this.pageSize, search: this.searchQuery };
        if (this.statusFilter) params.status = this.statusFilter;
        const res = await this.$apiGet('/rent', params);
        this.items = res.data || [];
        this.count = res.count || 0;
        this.nextPage = res.next || null;
        this.previousPage = res.previous || null;
      } catch (e) { console.error(e); }
      finally { this.loading = false; }
    },
    openAddModal() { this.editMode = false; this.selectedItem = null; this.showModal = true; },
    editItem(item) { this.editMode = true; this.selectedItem = { ...item }; this.showModal = true; },
    viewDetails(id) { this.$router.push({ name: 'Rent-detail', params: { id } }); },
    openDeleteModal(id) { this.deleteId = id; this.deleteModalVisible = true; },
    async confirmDelete() {
      try { await this.$apiDelete('/rent', this.deleteId); this.fetchItems(this.currentPage); }
      catch (e) { console.error(e); } finally { this.deleteModalVisible = false; }
    },
    isOverdue(item) {
      return item.status === 'active' && item.next_due_date && new Date(item.next_due_date) < new Date();
    },
    statusBadge(s) {
      return { active: 'bg-green-100 text-green-700', expired: 'bg-gray-100 text-gray-500', terminated: 'bg-red-100 text-red-600', pending: 'bg-yellow-100 text-yellow-700' }[s] || 'bg-gray-100 text-gray-500';
    },
    formatDate(ts) {
      if (!ts) return '—';
      return new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    },
  },
  mounted() { this.fetchItems(); }
};
</script>
