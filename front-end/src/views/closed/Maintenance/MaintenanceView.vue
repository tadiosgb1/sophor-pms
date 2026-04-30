<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <Loading :visible="loading" message="Loading maintenance requests..." />

    <!-- Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <div>
        <h1 class="text-xl font-bold text-gray-800">Maintenance Requests</h1>
        <p class="text-xs text-gray-400 mt-0.5">Track and manage all property maintenance</p>
      </div>
      <button @click="openAddModal"
        class="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition-colors">
        <i class="fas fa-plus text-xs"></i> New Request
      </button>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
      <div v-for="s in summaryStats" :key="s.label"
        class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-3 cursor-pointer hover:border-orange-300 transition-colors"
        :class="{ 'border-orange-400 ring-1 ring-orange-300': statusFilter === s.filter }"
        @click="setStatusFilter(s.filter)">
        <div :class="s.iconBg" class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0">
          <i :class="[s.icon, s.iconColor, 'text-sm']"></i>
        </div>
        <div>
          <p class="text-xs text-gray-400">{{ s.label }}</p>
          <p :class="s.valueColor" class="text-xl font-bold">{{ s.value }}</p>
        </div>
      </div>
    </div>

    <!-- Filters row -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">

        <!-- Search -->
        <div class="relative lg:col-span-2">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          <input v-model="searchQuery" @input="fetchItems(1)" type="text"
            placeholder="Search title, category…"
            class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>

        <!-- Priority filter -->
        <select v-model="priorityFilter" @change="fetchItems(1)"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-orange-400">
          <option value="">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <!-- Category filter -->
        <select v-model="categoryFilter" @change="fetchItems(1)"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-orange-400">
          <option value="">All Categories</option>
          <option v-for="c in categoryOptions" :key="c" :value="c">{{ c }}</option>
        </select>

        <!-- Page size -->
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <span>Show</span>
          <select v-model="pageSize" @change="fetchItems(1)"
            class="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white flex-1">
            <option v-for="s in [5,10,20,50]" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
      </div>

      <!-- Date range filters -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-100">
        <!-- Requested date range -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500 shrink-0 w-20">Requested:</span>
          <input v-model="requestedFrom" @change="fetchItems(1)" type="date"
            class="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <span class="text-xs text-gray-400">to</span>
          <input v-model="requestedTo" @change="fetchItems(1)" type="date"
            class="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400" />
          <button v-if="requestedFrom || requestedTo" @click="requestedFrom=''; requestedTo=''; fetchItems(1)"
            class="text-gray-400 hover:text-red-400 text-xs"><i class="fas fa-times"></i></button>
        </div>

        <!-- Resolved date range -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500 shrink-0 w-20">Resolved:</span>
          <input v-model="resolvedFrom" @change="fetchItems(1)" type="date"
            class="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-400" />
          <span class="text-xs text-gray-400">to</span>
          <input v-model="resolvedTo" @change="fetchItems(1)" type="date"
            class="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-400" />
          <button v-if="resolvedFrom || resolvedTo" @click="resolvedFrom=''; resolvedTo=''; fetchItems(1)"
            class="text-gray-400 hover:text-red-400 text-xs"><i class="fas fa-times"></i></button>
        </div>
      </div>

      <!-- Active filters chips -->
      <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
        <span class="text-xs text-gray-400">Active filters:</span>
        <span v-if="statusFilter" @click="setStatusFilter('')"
          class="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs cursor-pointer hover:bg-orange-200">
          Status: {{ statusFilter }} <i class="fas fa-times text-[10px]"></i>
        </span>
        <span v-if="priorityFilter" @click="priorityFilter=''; fetchItems(1)"
          class="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs cursor-pointer hover:bg-orange-200">
          Priority: {{ priorityFilter }} <i class="fas fa-times text-[10px]"></i>
        </span>
        <span v-if="categoryFilter" @click="categoryFilter=''; fetchItems(1)"
          class="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs cursor-pointer hover:bg-orange-200">
          Category: {{ categoryFilter }} <i class="fas fa-times text-[10px]"></i>
        </span>
        <button @click="clearAllFilters" class="text-xs text-red-400 hover:text-red-600 ml-auto">Clear all</button>
      </div>
    </div>

    <!-- Table (desktop) -->
    <div class="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <table class="min-w-full text-sm divide-y divide-gray-100">
        <thead class="bg-gray-50 text-xs uppercase text-gray-500 font-semibold tracking-wide">
          <tr>
            <th class="px-5 py-3 text-left">#</th>
            <th class="px-5 py-3 text-left">Request</th>
            <th class="px-5 py-3 text-left">Location</th>
            <th class="px-5 py-3 text-left">Requester</th>
            <th class="px-5 py-3 text-left">Assigned To</th>
            <th class="px-5 py-3 text-left">Priority</th>
            <th class="px-5 py-3 text-left">Status</th>
            <th class="px-5 py-3 text-left">Date</th>
            <th class="px-5 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-orange-50 transition-colors">
            <td class="px-5 py-3 text-gray-400">{{ (currentPage-1)*pageSize + index + 1 }}</td>

            <!-- Request title + category -->
            <td class="px-5 py-3">
              <div class="flex items-center gap-2">
                <div :class="categoryIconBg(item.category)"
                  class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                  <i :class="categoryIcon(item.category)" class="text-xs"></i>
                </div>
                <div>
                  <p class="font-medium text-gray-800 max-w-[180px] truncate">{{ item.title }}</p>
                  <p class="text-xs text-gray-400">{{ item.category }}</p>
                </div>
              </div>
            </td>

            <!-- Location -->
            <td class="px-5 py-3">
              <p class="text-gray-700">{{ item.site?.name || '—' }}</p>
              <p class="text-xs text-gray-400">{{ item.unit?.name || 'Site-level' }}</p>
            </td>

            <!-- Requester -->
            <td class="px-5 py-3">
              <div v-if="item.requester" class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold shrink-0">
                  {{ item.requester.first_name?.[0] }}
                </div>
                <span class="text-gray-700 text-xs">{{ item.requester.first_name }} {{ item.requester.last_name }}</span>
              </div>
              <span v-else class="text-gray-400">—</span>
            </td>

            <!-- Assigned to -->
            <td class="px-5 py-3">
              <div v-if="item.assignee" class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0">
                  {{ item.assignee.first_name?.[0] }}
                </div>
                <span class="text-gray-700 text-xs">{{ item.assignee.first_name }} {{ item.assignee.last_name }}</span>
              </div>
              <span v-else class="text-xs text-gray-400 italic">Unassigned</span>
            </td>

            <!-- Priority -->
            <td class="px-5 py-3">
              <div class="flex items-center gap-1.5">
                <span :class="priorityDot(item.priority)" class="w-2 h-2 rounded-full shrink-0"></span>
                <span :class="priorityBadge(item.priority)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">
                  {{ item.priority }}
                </span>
              </div>
            </td>

            <!-- Status -->
            <td class="px-5 py-3">
              <span :class="statusBadge(item.status)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">
                {{ item.status.replace('_', ' ') }}
              </span>
            </td>

            <!-- Date -->
            <td class="px-5 py-3 text-gray-500 text-xs">
              <p>{{ formatDate(item.createdAt) }}</p>
              <p v-if="item.resolved_at" class="text-green-600">✓ {{ formatDate(item.resolved_at) }}</p>
            </td>

            <!-- Actions -->
            <td class="px-5 py-3 text-center">
              <div class="flex items-center justify-center gap-2">
                <button @click="viewDetails(item.id)" class="text-orange-500 hover:text-orange-700"><i class="fas fa-eye"></i></button>
                <button @click="editItem(item)" class="text-blue-500 hover:text-blue-700"><i class="fas fa-pen"></i></button>
                <button @click="quickAssign(item)" title="Assign" class="text-purple-500 hover:text-purple-700"><i class="fas fa-user-plus"></i></button>
                <button @click="openDeleteModal(item.id)" class="text-red-400 hover:text-red-600"><i class="fas fa-trash"></i></button>
              </div>
            </td>
          </tr>
          <tr v-if="items.length === 0 && !loading">
            <td colspan="9" class="text-center py-12 text-gray-400">
              <i class="fas fa-wrench text-3xl mb-2 block text-gray-300"></i>
              No maintenance requests found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile cards -->
    <div class="md:hidden space-y-3">
      <div v-for="item in items" :key="item.id"
        class="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center gap-2 flex-1 min-w-0">
            <div :class="categoryIconBg(item.category)" class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
              <i :class="categoryIcon(item.category)" class="text-xs"></i>
            </div>
            <div class="min-w-0">
              <p class="font-semibold text-gray-800 truncate">{{ item.title }}</p>
              <p class="text-xs text-gray-400">{{ item.site?.name }} · {{ item.unit?.name || 'Site-level' }}</p>
            </div>
          </div>
          <div class="flex gap-2 text-sm shrink-0 ml-2">
            <button @click="viewDetails(item.id)" class="text-orange-500"><i class="fas fa-eye"></i></button>
            <button @click="editItem(item)" class="text-blue-500"><i class="fas fa-pen"></i></button>
            <button @click="openDeleteModal(item.id)" class="text-red-400"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <div class="flex items-center justify-between mt-2">
          <div class="flex items-center gap-2">
            <span :class="priorityBadge(item.priority)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">{{ item.priority }}</span>
            <span :class="statusBadge(item.status)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">{{ item.status.replace('_',' ') }}</span>
          </div>
          <span class="text-xs text-gray-400">{{ formatDate(item.createdAt) }}</span>
        </div>
        <div v-if="item.requester" class="mt-2 text-xs text-gray-500">
          <i class="fas fa-user mr-1 text-gray-400"></i>{{ item.requester.first_name }} {{ item.requester.last_name }}
        </div>
      </div>
      <p v-if="items.length === 0 && !loading" class="text-center text-gray-400 py-8 italic">No requests found.</p>
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

    <!-- Modals -->
    <add-maintenance v-if="showAddModal" @close="showAddModal=false" @saved="fetchItems" />
    <edit-maintenance v-if="showEditModal" :data="selectedItem" @close="showEditModal=false" @saved="fetchItems" />
    <quick-assign-modal v-if="showAssignModal" :data="selectedItem" @close="showAssignModal=false" @saved="fetchItems" />
    <delete-confirm-modal :visible="deleteModalVisible" title="Delete Request"
      message="Are you sure you want to delete this maintenance request?"
      @confirm="confirmDelete" @cancel="deleteModalVisible=false" />
  </div>
</template>

<script>
import AddMaintenance from "./AddMaintenance.vue";
import EditMaintenance from "./EditMaintenance.vue";
import QuickAssignModal from "./QuickAssignModal.vue";
import Loading from "@/components/Loading.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";

export default {
  components: { AddMaintenance, EditMaintenance, QuickAssignModal, Loading, DeleteConfirmModal },
  data() {
    return {
      items: [], count: 0, nextPage: null, previousPage: null,
      currentPage: 1, pageSize: 10,
      searchQuery: "", statusFilter: "", priorityFilter: "", categoryFilter: "",
      requestedFrom: "", requestedTo: "", resolvedFrom: "", resolvedTo: "",
      showAddModal: false, showEditModal: false, showAssignModal: false,
      selectedItem: null, loading: false, deleteModalVisible: false, deleteId: null,
      allItems: [], // for summary counts
      categoryOptions: ['Plumbing', 'Electrical', 'HVAC', 'Structural', 'Cosmetic', 'Appliance', 'Security', 'Other'],
    };
  },
  computed: {
    summaryStats() {
      return [
        { label: 'Total',       filter: '',            value: this.count,                                                    icon: 'fas fa-list',         iconBg: 'bg-gray-100',   iconColor: 'text-gray-500',   valueColor: 'text-gray-800' },
        { label: 'Pending',     filter: 'pending',     value: this.allItems.filter(i => i.status === 'pending').length,     icon: 'fas fa-clock',        iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', valueColor: 'text-yellow-600' },
        { label: 'In Progress', filter: 'in_progress', value: this.allItems.filter(i => i.status === 'in_progress').length, icon: 'fas fa-spinner',      iconBg: 'bg-blue-100',   iconColor: 'text-blue-600',   valueColor: 'text-blue-600' },
        { label: 'Resolved',    filter: 'resolved',    value: this.allItems.filter(i => i.status === 'resolved').length,    icon: 'fas fa-circle-check', iconBg: 'bg-green-100',  iconColor: 'text-green-600',  valueColor: 'text-green-600' },
      ];
    },
    hasActiveFilters() {
      return this.statusFilter || this.priorityFilter || this.categoryFilter ||
             this.requestedFrom || this.requestedTo || this.resolvedFrom || this.resolvedTo;
    },
  },
  methods: {
    async fetchItems(page = 1) {
      this.loading = true;
      this.currentPage = page;
      try {
        const params = { page: this.currentPage, page_size: this.pageSize, search: this.searchQuery };
        if (this.statusFilter)   params.status   = this.statusFilter;
        if (this.priorityFilter) params.priority = this.priorityFilter;
        if (this.categoryFilter) params.category = this.categoryFilter;
        if (this.requestedFrom)  params.requested_from = this.requestedFrom;
        if (this.requestedTo)    params.requested_to   = this.requestedTo;
        if (this.resolvedFrom)   params.resolved_from  = this.resolvedFrom;
        if (this.resolvedTo)     params.resolved_to    = this.resolvedTo;

        const res = await this.$apiGet('/maintenance', params);
        this.items = res.data || [];
        this.count = res.count || 0;
        this.nextPage = res.next || null;
        this.previousPage = res.previous || null;

        // Fetch all for summary counts (no filters)
        const all = await this.$apiGet('/maintenance', { page_size: 1000 });
        this.allItems = all.data || [];
      } catch (e) { console.error(e); }
      finally { this.loading = false; }
    },
    setStatusFilter(f) { this.statusFilter = this.statusFilter === f ? '' : f; this.fetchItems(1); },
    clearAllFilters() {
      this.statusFilter = ''; this.priorityFilter = ''; this.categoryFilter = '';
      this.requestedFrom = ''; this.requestedTo = ''; this.resolvedFrom = ''; this.resolvedTo = '';
      this.searchQuery = '';
      this.fetchItems(1);
    },
    openAddModal() { this.showAddModal = true; },
    editItem(item) { this.selectedItem = { ...item }; this.showEditModal = true; },
    quickAssign(item) { this.selectedItem = { ...item }; this.showAssignModal = true; },
    viewDetails(id) { this.$router.push({ name: 'Maintenance-detail', params: { id } }); },
    openDeleteModal(id) { this.deleteId = id; this.deleteModalVisible = true; },
    async confirmDelete() {
      try { await this.$apiDelete('/maintenance', this.deleteId); this.fetchItems(this.currentPage); }
      catch (e) { console.error(e); } finally { this.deleteModalVisible = false; }
    },
    priorityDot(p) { return { urgent: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-400', low: 'bg-gray-400' }[p] || 'bg-gray-400'; },
    priorityBadge(p) { return { urgent: 'bg-red-100 text-red-700', high: 'bg-orange-100 text-orange-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-gray-100 text-gray-600' }[p] || 'bg-gray-100 text-gray-500'; },
    statusBadge(s) { return { pending: 'bg-yellow-100 text-yellow-700', in_progress: 'bg-blue-100 text-blue-700', resolved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-600' }[s] || 'bg-gray-100 text-gray-500'; },
    categoryIconBg(c) { return { Plumbing: 'bg-blue-100 text-blue-600', Electrical: 'bg-yellow-100 text-yellow-600', HVAC: 'bg-teal-100 text-teal-600', Structural: 'bg-orange-100 text-orange-600', Cosmetic: 'bg-pink-100 text-pink-600', Appliance: 'bg-purple-100 text-purple-600', Security: 'bg-red-100 text-red-600' }[c] || 'bg-gray-100 text-gray-500'; },
    categoryIcon(c) { return { Plumbing: 'fas fa-faucet', Electrical: 'fas fa-bolt', HVAC: 'fas fa-wind', Structural: 'fas fa-building', Cosmetic: 'fas fa-paint-roller', Appliance: 'fas fa-blender', Security: 'fas fa-shield-halved' }[c] || 'fas fa-wrench'; },
    formatDate(ts) { if (!ts) return '—'; return new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); },
  },
  mounted() { this.fetchItems(); },
};
</script>
