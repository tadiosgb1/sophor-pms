<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <Loading :visible="loading" message="Loading expense..." />

    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <div class="flex items-center gap-3">
        <button @click="$router.back()"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 shadow-sm transition-colors">
          <i class="fas fa-arrow-left text-xs"></i>
        </button>
        <div>
          <h1 class="text-lg font-bold text-gray-800">Expense Detail</h1>
          <p class="text-xs text-gray-400">{{ item.category }} · {{ formatDate(item.expense_date) }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button @click="showEditModal = true"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
          <i class="fas fa-pen text-[10px]"></i> Edit
        </button>
        <button @click="deleteModalVisible = true"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
          <i class="fas fa-trash text-[10px]"></i> Delete
        </button>
      </div>
    </div>

    <template v-if="!loading && item.id">

      <!-- Amount banner -->
      <div :class="categoryBannerClass(item.category)"
        class="rounded-xl p-5 mb-5 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-white bg-opacity-60 flex items-center justify-center">
            <i :class="categoryIcon(item.category)" class="text-2xl"></i>
          </div>
          <div>
            <p class="font-bold text-lg">{{ item.category }}</p>
            <p class="text-xs opacity-75">{{ formatDate(item.expense_date) }}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-3xl font-bold">ETB {{ Number(item.amount).toLocaleString() }}</p>
          <p class="text-xs opacity-75">Total amount</p>
        </div>
      </div>

      <!-- Detail grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

        <!-- Expense info -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <i class="fas fa-receipt text-orange-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Expense Info</span>
          </div>
          <div class="p-5 space-y-3">
            <div class="detail-row">
              <span class="detail-label">Category</span>
              <span :class="categoryBadgeClass(item.category)" class="px-2 py-0.5 rounded-full text-xs font-medium">
                {{ item.category }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Amount</span>
              <span class="font-bold text-red-500 text-sm">ETB {{ Number(item.amount).toLocaleString() }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date</span>
              <span class="detail-value">{{ formatDate(item.expense_date) }}</span>
            </div>
            <div v-if="item.description" class="pt-2 border-t border-gray-100">
              <p class="text-xs text-gray-400 mb-1">Description</p>
              <p class="text-gray-700 text-xs leading-relaxed bg-gray-50 rounded-lg p-3">{{ item.description }}</p>
            </div>
          </div>
        </div>

        <!-- Site -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <i class="fas fa-map-pin text-green-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Site</span>
          </div>
          <div class="p-5">
            <template v-if="item.site">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <i class="fas fa-map-pin text-sm"></i>
                </div>
                <div>
                  <p class="font-semibold text-gray-800">{{ item.site.name }}</p>
                  <p class="text-xs text-gray-400">{{ item.site.city || '—' }}</p>
                </div>
              </div>
            </template>
            <p v-else class="text-gray-400 text-xs">Site ID: {{ item.site_id || '—' }}</p>
          </div>
        </div>

        <!-- Record info -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <i class="fas fa-clock text-gray-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Record Info</span>
          </div>
          <div class="p-5 space-y-3">
            <div class="detail-row">
              <span class="detail-label">Created by</span>
              <span class="detail-value">
                {{ item.creator ? item.creator.first_name + ' ' + item.creator.last_name : '—' }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Updated by</span>
              <span class="detail-value">
                {{ item.updater ? item.updater.first_name + ' ' + item.updater.last_name : '—' }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Created at</span>
              <span class="detail-value">{{ formatDate(item.createdAt) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Updated at</span>
              <span class="detail-value">{{ formatDate(item.updatedAt) }}</span>
            </div>
          </div>
        </div>

      </div>
    </template>

    <edit-expense v-if="showEditModal" :data="item" @close="showEditModal=false" @saved="reload" />
    <delete-confirm-modal :visible="deleteModalVisible" title="Delete Expense"
      message="Are you sure you want to delete this expense?"
      @confirm="confirmDelete" @cancel="deleteModalVisible=false" />
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
import EditExpense from "./EditExpense.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";

export default {
  components: { Loading, EditExpense, DeleteConfirmModal },
  data() {
    return { item: {}, loading: false, showEditModal: false, deleteModalVisible: false };
  },
  methods: {
    async loadItem() {
      this.loading = true;
      try {
        const res = await this.$apiGetById('/expense', this.$route.params.id);
        this.item = res || {};
      } catch (e) { console.error(e); }
      finally { this.loading = false; }
    },
    reload() { this.showEditModal = false; this.loadItem(); },
    async confirmDelete() {
      try { await this.$apiDelete('/expense', this.item.id); this.$router.push({ name: 'Expense-view' }); }
      catch (e) { console.error(e); } finally { this.deleteModalVisible = false; }
    },
    categoryBannerClass(c) {
      const map = { Maintenance: 'bg-yellow-100 text-yellow-700', Utilities: 'bg-blue-100 text-blue-700', Cleaning: 'bg-teal-100 text-teal-700', Security: 'bg-red-100 text-red-700', Repairs: 'bg-orange-100 text-orange-700', Salaries: 'bg-purple-100 text-purple-700', Insurance: 'bg-indigo-100 text-indigo-700' };
      return map[c] || 'bg-gray-100 text-gray-700';
    },
    categoryBadgeClass(c) {
      const map = { Maintenance: 'bg-yellow-100 text-yellow-700', Utilities: 'bg-blue-100 text-blue-700', Cleaning: 'bg-teal-100 text-teal-700', Security: 'bg-red-100 text-red-700', Repairs: 'bg-orange-100 text-orange-700', Salaries: 'bg-purple-100 text-purple-700', Insurance: 'bg-indigo-100 text-indigo-700' };
      return map[c] || 'bg-gray-100 text-gray-600';
    },
    categoryIcon(c) {
      const map = { Maintenance: 'fas fa-wrench', Utilities: 'fas fa-bolt', Cleaning: 'fas fa-broom', Security: 'fas fa-shield-halved', Repairs: 'fas fa-screwdriver-wrench', Salaries: 'fas fa-user-tie', Insurance: 'fas fa-file-shield' };
      return map[c] || 'fas fa-receipt';
    },
    formatDate(ts) {
      if (!ts) return '—';
      return new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    },
  },
  mounted() { this.loadItem(); },
};
</script>

<style scoped>
.detail-row { @apply flex items-center justify-between gap-4; }
.detail-label { @apply text-xs text-gray-400 shrink-0 w-24; }
.detail-value { @apply text-gray-800 text-xs text-right; }
</style>
