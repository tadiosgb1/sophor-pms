<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <Loading :visible="loading" message="Loading inventory item..." />

    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <div class="flex items-center gap-3">
        <button @click="$router.back()"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 shadow-sm transition-colors">
          <i class="fas fa-arrow-left text-xs"></i>
        </button>
        <div>
          <h1 class="text-lg font-bold text-gray-800">Inventory Item Detail</h1>
          <p class="text-xs text-gray-400">{{ item.description || '' }}</p>
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

      <!-- Stock status banner -->
      <div :class="stockBannerClass" class="rounded-xl p-4 mb-5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white bg-opacity-60 flex items-center justify-center">
            <i class="fas fa-box text-lg"></i>
          </div>
          <div>
            <p class="font-bold text-base">{{ item.description }}</p>
            <p class="text-xs opacity-75">{{ item.unit }} · {{ item.Site?.name || 'No site' }}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-2xl font-bold">{{ item.quantity }}</p>
          <p class="text-xs opacity-75">units in stock</p>
        </div>
      </div>

      <!-- Info grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

        <!-- Stock details -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <i class="fas fa-cubes text-orange-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Stock Details</span>
          </div>
          <div class="p-5 space-y-3">
            <div class="detail-row">
              <span class="detail-label">Description</span>
              <span class="detail-value font-medium">{{ item.description }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Quantity</span>
              <span class="detail-value font-bold text-gray-900">{{ item.quantity }} {{ item.unit }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Unit</span>
              <span class="detail-value">{{ item.unit || '—' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Price / Unit</span>
              <span class="detail-value">ETB {{ item.price_per_unit || '—' }}</span>
            </div>
            <div class="detail-row border-t border-gray-100 pt-3">
              <span class="detail-label font-semibold text-gray-600">Total Value</span>
              <span class="detail-value font-bold text-green-600 text-sm">
                ETB {{ ((item.quantity || 0) * (item.price_per_unit || 0)).toLocaleString() }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Stock Status</span>
              <span :class="stockClass(item.quantity)" class="px-2 py-0.5 rounded-full text-xs font-medium">
                {{ stockLabel(item.quantity) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Site & record info -->
        <div class="space-y-5">

          <!-- Site -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <i class="fas fa-map-pin text-green-400 text-xs"></i>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Site</span>
            </div>
            <div class="p-5">
              <template v-if="item.Site">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                    <i class="fas fa-map-pin text-xs"></i>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800">{{ item.Site.name }}</p>
                    <p class="text-xs text-gray-400">{{ item.Site.city || '—' }}</p>
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
                <span class="detail-label">Created</span>
                <span class="detail-value">{{ formatDate(item.createdAt) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Updated</span>
                <span class="detail-value">{{ formatDate(item.updatedAt) }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </template>

    <edit-inventoryitem v-if="showEditModal" :data="item" @close="showEditModal=false" @saved="reload" />
    <delete-confirm-modal :visible="deleteModalVisible" title="Delete Item"
      message="Are you sure you want to delete this inventory item?"
      @confirm="confirmDelete" @cancel="deleteModalVisible=false" />
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
import EditInventoryitem from "./EditInventoryitem.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";

export default {
  components: { Loading, EditInventoryitem, DeleteConfirmModal },
  data() {
    return { item: {}, loading: false, showEditModal: false, deleteModalVisible: false };
  },
  computed: {
    stockBannerClass() {
      const qty = this.item.quantity;
      if (!qty || qty <= 0) return 'bg-red-100 text-red-700';
      if (qty <= 10) return 'bg-yellow-100 text-yellow-700';
      return 'bg-green-100 text-green-700';
    },
  },
  methods: {
    async loadItem() {
      this.loading = true;
      try {
        const res = await this.$apiGetById('/inventoryitem', this.$route.params.id);
        this.item = res || {};
      } catch (e) { console.error(e); }
      finally { this.loading = false; }
    },
    reload() { this.showEditModal = false; this.loadItem(); },
    async confirmDelete() {
      try { await this.$apiDelete('/inventoryitem', this.item.id); this.$router.push({ name: 'Inventoryitem-view' }); }
      catch (e) { console.error(e); } finally { this.deleteModalVisible = false; }
    },
    stockClass(qty) {
      if (!qty || qty <= 0) return 'bg-red-100 text-red-600';
      if (qty <= 10) return 'bg-yellow-100 text-yellow-700';
      return 'bg-green-100 text-green-700';
    },
    stockLabel(qty) {
      if (!qty || qty <= 0) return 'Out of Stock';
      if (qty <= 10) return 'Low Stock';
      return 'In Stock';
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
