<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <Loading :visible="loading" message="Loading transaction..." />

    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <div class="flex items-center gap-3">
        <button @click="$router.back()"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 shadow-sm transition-colors">
          <i class="fas fa-arrow-left text-xs"></i>
        </button>
        <div>
          <h1 class="text-lg font-bold text-gray-800">Transaction Detail</h1>
          <p class="text-xs text-gray-400">{{ formatAction(item.action) }} · {{ formatDate(item.transaction_date) }}</p>
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

      <!-- Action banner -->
      <div :class="bannerClass" class="rounded-xl p-5 mb-5 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-white bg-opacity-60 flex items-center justify-center">
            <i :class="actionIcon(item.action)" class="text-2xl"></i>
          </div>
          <div>
            <p class="font-bold text-lg">{{ formatAction(item.action) }}</p>
            <p class="text-xs opacity-75">{{ formatDate(item.transaction_date) }}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-3xl font-bold">
            {{ item.action === 'stock_in' ? '+' : item.action === 'stock_out' ? '-' : '' }}{{ item.quantity }}
          </p>
          <p class="text-xs opacity-75">units</p>
        </div>
      </div>

      <!-- Detail cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

        <!-- Transaction info -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <i class="fas fa-arrow-right-arrow-left text-orange-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Transaction Info</span>
          </div>
          <div class="p-5 space-y-3">
            <div class="detail-row">
              <span class="detail-label">Action</span>
              <span :class="actionBadgeClass(item.action)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">
                {{ formatAction(item.action) }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Quantity</span>
              <span :class="item.action === 'stock_in' ? 'text-green-600' : 'text-red-500'"
                class="detail-value font-bold text-sm">
                {{ item.action === 'stock_in' ? '+' : '-' }}{{ item.quantity }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date</span>
              <span class="detail-value">{{ formatDate(item.transaction_date) }}</span>
            </div>
            <div v-if="item.note" class="pt-2 border-t border-gray-100">
              <p class="text-xs text-gray-400 mb-1">Note</p>
              <p class="text-gray-700 text-xs leading-relaxed bg-gray-50 rounded-lg p-3">{{ item.note }}</p>
            </div>
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
                {{ item.User ? item.User.first_name + ' ' + item.User.last_name : '—' }}
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

    <edit-inventorytransaction v-if="showEditModal" :data="item" @close="showEditModal=false" @saved="reload" />
    <delete-confirm-modal :visible="deleteModalVisible" title="Delete Transaction"
      message="Are you sure you want to delete this transaction?"
      @confirm="confirmDelete" @cancel="deleteModalVisible=false" />
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
import EditInventorytransaction from "./EditInventorytransaction.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";

export default {
  components: { Loading, EditInventorytransaction, DeleteConfirmModal },
  data() {
    return { item: {}, loading: false, showEditModal: false, deleteModalVisible: false };
  },
  computed: {
    bannerClass() {
      const map = { stock_in: 'bg-green-100 text-green-700', stock_out: 'bg-red-100 text-red-600', adjustment: 'bg-blue-100 text-blue-700' };
      return map[this.item.action] || 'bg-gray-100 text-gray-600';
    },
  },
  methods: {
    async loadItem() {
      this.loading = true;
      try {
        const res = await this.$apiGetById('/inventorytransaction', this.$route.params.id);
        this.item = res || {};
      } catch (e) { console.error(e); }
      finally { this.loading = false; }
    },
    reload() { this.showEditModal = false; this.loadItem(); },
    async confirmDelete() {
      try { await this.$apiDelete('/inventorytransaction', this.item.id); this.$router.push({ name: 'Inventorytransaction-view' }); }
      catch (e) { console.error(e); } finally { this.deleteModalVisible = false; }
    },
    actionIcon(a) {
      return { stock_in: 'fas fa-arrow-down', stock_out: 'fas fa-arrow-up', adjustment: 'fas fa-sliders' }[a] || 'fas fa-circle';
    },
    actionBadgeClass(a) {
      return { stock_in: 'bg-green-100 text-green-700', stock_out: 'bg-red-100 text-red-600', adjustment: 'bg-blue-100 text-blue-600' }[a] || 'bg-gray-100 text-gray-500';
    },
    formatAction(a) {
      return { stock_in: 'Stock In', stock_out: 'Stock Out', adjustment: 'Adjustment' }[a] || (a || '—');
    },
    formatDate(ts) {
      if (!ts) return '—';
      return new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
  },
  mounted() { this.loadItem(); },
};
</script>

<style scoped>
.detail-row { @apply flex items-center justify-between gap-4; }
.detail-label { @apply text-xs text-gray-400 shrink-0 w-28; }
.detail-value { @apply text-gray-800 text-xs text-right; }
</style>
