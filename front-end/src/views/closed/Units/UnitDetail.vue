<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <Loading :visible="loading" message="Loading unit..." />

    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <div class="flex items-center gap-3">
        <button @click="$router.back()"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 shadow-sm transition-colors">
          <i class="fas fa-arrow-left text-xs"></i>
        </button>
        <div>
          <h1 class="text-lg font-bold text-gray-800">Unit Detail</h1>
          <p class="text-xs text-gray-400">{{ item.name || '' }}</p>
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

      <!-- Tabs -->
      <div class="flex gap-1 mb-5 border-b border-gray-200">
        <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
          class="px-4 py-2 text-xs font-medium rounded-t-lg transition-colors"
          :class="activeTab === tab.key ? 'bg-white border border-b-white border-gray-200 text-orange-600 -mb-px' : 'text-gray-500 hover:text-gray-700'">
          <i :class="tab.icon" class="mr-1.5"></i>{{ tab.label }}
          <span v-if="tab.count !== undefined"
            class="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
            :class="activeTab === tab.key ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'">
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- ── TAB: Overview ── -->
      <div v-if="activeTab === 'overview'">

        <!-- Images strip -->
        <div v-if="item.images && item.images.length" class="mb-5">
          <div class="flex gap-3 overflow-x-auto pb-2">
            <img v-for="img in item.images" :key="img.id" :src="img.image_url"
              class="h-40 w-60 object-cover rounded-xl border border-gray-200 shrink-0 shadow-sm" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

          <!-- Unit info -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <i class="fas fa-door-open text-teal-400 text-xs"></i>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Unit Info</span>
            </div>
            <div class="p-5 space-y-3">
              <div class="detail-row"><span class="detail-label">Name</span><span class="detail-value font-medium">{{ item.name }}</span></div>
              <div class="detail-row"><span class="detail-label">Type</span><span class="detail-value">{{ item.Type?.name || '—' }}</span></div>
              <div class="detail-row"><span class="detail-label">Site</span>
                <button @click="$router.push({ name: 'Site-detail', params: { id: item.site_id } })"
                  class="text-orange-500 hover:underline text-xs">{{ item.Site?.name || '—' }}</button>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status</span>
                <span :class="statusClass(item.status)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">{{ item.status || '—' }}</span>
              </div>
              <div class="detail-row"><span class="detail-label">Price</span><span class="detail-value font-semibold text-gray-900">ETB {{ item.price || '—' }}</span></div>
              <div v-if="item.description" class="pt-1">
                <p class="text-xs text-gray-400 mb-1">Description</p>
                <p class="text-gray-700 text-xs leading-relaxed">{{ item.description }}</p>
              </div>
            </div>
          </div>

          <!-- Physical details -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <i class="fas fa-ruler-combined text-orange-400 text-xs"></i>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Physical Details</span>
            </div>
            <div class="p-5 space-y-3">
              <div class="detail-row"><span class="detail-label">Floor</span><span class="detail-value">{{ item.floor || '—' }}</span></div>
              <div class="detail-row"><span class="detail-label">House No.</span><span class="detail-value">{{ item.house_number || '—' }}</span></div>
              <div class="detail-row"><span class="detail-label">Block No.</span><span class="detail-value">{{ item.block_number || '—' }}</span></div>
              <div class="detail-row"><span class="detail-label">Bedrooms</span><span class="detail-value">{{ item.bedrooms || '—' }}</span></div>
              <div class="detail-row"><span class="detail-label">Bathrooms</span><span class="detail-value">{{ item.bathrooms || '—' }}</span></div>
              <div class="detail-row"><span class="detail-label">Size</span><span class="detail-value">{{ item.size || '—' }}</span></div>
            </div>
          </div>

          <!-- Team -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <i class="fas fa-users text-purple-400 text-xs"></i>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Team</span>
            </div>
            <div class="p-5 space-y-3">
              <div v-for="role in ['owner','manager','staff']" :key="role" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold uppercase shrink-0">
                  {{ item[role]?.first_name?.[0] || '?' }}
                </div>
                <div>
                  <p class="text-xs text-gray-400 capitalize">{{ role }}</p>
                  <p class="text-gray-800 font-medium text-xs">
                    {{ item[role] ? item[role].first_name + ' ' + item[role].last_name : '—' }}
                  </p>
                </div>
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
              <div class="detail-row"><span class="detail-label">Created</span><span class="detail-value">{{ formatDate(item.createdAt) }}</span></div>
              <div class="detail-row"><span class="detail-label">Updated</span><span class="detail-value">{{ formatDate(item.updatedAt) }}</span></div>
            </div>
          </div>

        </div>
      </div>

      <!-- ── TAB: Type ── -->
      <div v-if="activeTab === 'type'">
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="fas fa-tags text-teal-400 text-xs"></i>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Unit Type</span>
            </div>
            <button @click="showChangeTypeModal = true"
              class="flex items-center gap-1 text-xs bg-orange-500 hover:bg-orange-600 text-white px-2.5 py-1 rounded-lg transition-colors">
              <i class="fas fa-pen text-[10px]"></i> Change Type
            </button>
          </div>

          <div class="p-5">
            <template v-if="item.Type">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                  <i class="fas fa-tags text-xl"></i>
                </div>
                <div>
                  <p class="font-bold text-gray-800 text-base">{{ item.Type.name }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">Category: {{ item.Type.category || '—' }}</p>
                </div>
              </div>

              <!-- Type details -->
              <div class="mt-5 grid grid-cols-2 gap-4">
                <div class="bg-gray-50 rounded-xl p-4">
                  <p class="text-xs text-gray-400 mb-1">Type Name</p>
                  <p class="font-semibold text-gray-800">{{ item.Type.name }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-4">
                  <p class="text-xs text-gray-400 mb-1">Category</p>
                  <p class="font-semibold text-gray-800">{{ item.Type.category || '—' }}</p>
                </div>
              </div>
            </template>
            <div v-else class="text-center py-8 text-gray-400 text-xs italic">
              No type assigned to this unit.
              <button @click="showChangeTypeModal = true" class="block mx-auto mt-2 text-orange-500 hover:underline">Assign a type</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── TAB: Rentals ── -->
      <div v-if="activeTab === 'rentals'">
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="fas fa-house-user text-pink-400 text-xs"></i>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Rental History</span>
            </div>
            <button @click="$router.push({ name: 'Rent-view' })" class="text-xs text-orange-500 hover:underline">View all</button>
          </div>
          <div v-if="item.rents && item.rents.length" class="divide-y divide-gray-100">
            <div v-for="rent in item.rents" :key="rent.id" class="px-5 py-3 flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-800 text-xs">{{ rent.renter?.first_name }} {{ rent.renter?.last_name }}</p>
                <p class="text-xs text-gray-400">{{ rent.rent_period }} · From {{ formatDate(rent.start_date) }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-800 text-xs">ETB {{ rent.rent_amount }}</p>
                <span :class="rent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                  class="px-2 py-0.5 rounded-full text-[10px] font-medium capitalize">{{ rent.status }}</span>
              </div>
            </div>
          </div>
          <div v-else class="px-5 py-8 text-center text-gray-400 text-xs italic">No rental history for this unit.</div>
        </div>
      </div>

      <!-- ── TAB: Sales ── -->
      <div v-if="activeTab === 'sales'">
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="fas fa-handshake text-yellow-500 text-xs"></i>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Sale History</span>
            </div>
          </div>
          <div v-if="item.sales && item.sales.length" class="divide-y divide-gray-100">
            <div v-for="sale in item.sales" :key="sale.id" class="px-5 py-3 flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-800 text-xs">{{ sale.buyer?.first_name }} {{ sale.buyer?.last_name }}</p>
                <p class="text-xs text-gray-400">{{ formatDate(sale.sale_date) }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-800 text-xs">ETB {{ sale.sale_price }}</p>
                <span :class="sale.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                  class="px-2 py-0.5 rounded-full text-[10px] font-medium capitalize">{{ sale.status }}</span>
              </div>
            </div>
          </div>
          <div v-else class="px-5 py-8 text-center text-gray-400 text-xs italic">No sale history for this unit.</div>
        </div>
      </div>

      <!-- ── TAB: Maintenance ── -->
      <div v-if="activeTab === 'maintenance'">
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="fas fa-wrench text-red-400 text-xs"></i>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Maintenance Requests</span>
            </div>
            <button @click="showAddMaintenance = true"
              class="flex items-center gap-1 text-xs bg-orange-500 hover:bg-orange-600 text-white px-2.5 py-1 rounded-lg transition-colors">
              <i class="fas fa-plus text-[10px]"></i> New Request
            </button>
          </div>
          <div v-if="item.maintenanceRequests && item.maintenanceRequests.length" class="divide-y divide-gray-100">
            <div v-for="req in item.maintenanceRequests" :key="req.id" class="px-5 py-3 flex items-start justify-between gap-4">
              <div class="flex items-start gap-3">
                <div :class="priorityDot(req.priority)" class="w-2 h-2 rounded-full mt-1.5 shrink-0"></div>
                <div>
                  <p class="font-medium text-gray-800 text-xs">{{ req.title }}</p>
                  <p class="text-xs text-gray-400">{{ req.category }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">{{ req.requester?.first_name }} {{ req.requester?.last_name }}</p>
                </div>
              </div>
              <div class="text-right shrink-0">
                <span :class="maintenanceStatusClass(req.status)"
                  class="px-2 py-0.5 rounded-full text-[10px] font-medium capitalize">{{ req.status }}</span>
                <p class="text-[10px] text-gray-400 mt-1">{{ formatDate(req.createdAt) }}</p>
              </div>
            </div>
          </div>
          <div v-else class="px-5 py-8 text-center text-gray-400 text-xs italic">No maintenance requests for this unit.</div>
        </div>
      </div>

      <!-- ── TAB: Images ── -->
      <div v-if="activeTab === 'images'">
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="fas fa-images text-indigo-400 text-xs"></i>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Unit Images</span>
            </div>
            <button @click="showAddImage = true"
              class="flex items-center gap-1 text-xs bg-orange-500 hover:bg-orange-600 text-white px-2.5 py-1 rounded-lg transition-colors">
              <i class="fas fa-plus text-[10px]"></i> Add Image
            </button>
          </div>
          <div v-if="item.images && item.images.length" class="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div v-for="img in item.images" :key="img.id" class="relative group rounded-xl overflow-hidden border border-gray-200">
              <img :src="img.image_url" class="w-full h-32 object-cover" />
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button @click="editImage(img)" class="w-7 h-7 bg-white rounded-full flex items-center justify-center text-blue-500 text-xs shadow"><i class="fas fa-pen"></i></button>
                <button @click="deleteImage(img.id)" class="w-7 h-7 bg-white rounded-full flex items-center justify-center text-red-500 text-xs shadow"><i class="fas fa-trash"></i></button>
              </div>
            </div>
          </div>
          <div v-else class="px-5 py-8 text-center text-gray-400 text-xs italic">No images uploaded yet.</div>
        </div>
      </div>

    </template>

    <!-- Modals -->
    <edit-unit v-if="showEditModal" :data="item" @close="showEditModal=false" @saved="reload" />
    <AddUnitImage v-if="showAddImage" :data="{ unit_id: item.id }" @close="showAddImage=false" @saved="reload" />
    <EditUnitImage v-if="editingImage" :data="editingImage" @close="editingImage=null" @saved="reload" />
    <ChangeUnitTypeModal v-if="showChangeTypeModal" :unit="item" @close="showChangeTypeModal=false" @saved="reload" />
    <delete-confirm-modal :visible="deleteModalVisible" title="Delete Unit"
      message="Are you sure you want to delete this unit?"
      @confirm="confirmDelete" @cancel="deleteModalVisible=false" />
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
import EditUnit from "./EditUnit.vue";
import AddUnitImage from "../UnitImages/AddUnitImage.vue";
import EditUnitImage from "../UnitImages/EditUnitImage.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import ChangeUnitTypeModal from "./ChangeUnitTypeModal.vue";

export default {
  components: { Loading, EditUnit, AddUnitImage, EditUnitImage, DeleteConfirmModal, ChangeUnitTypeModal },
  data() {
    return {
      item: {},
      loading: false,
      activeTab: "overview",
      showEditModal: false,
      showAddImage: false,
      showAddMaintenance: false,
      editingImage: null,
      deleteModalVisible: false,
      showChangeTypeModal: false,
    };
  },
  computed: {
    tabs() {
      return [
        { key: "overview",    label: "Overview",    icon: "fas fa-info-circle" },
        { key: "type",        label: "Type",        icon: "fas fa-tags" },
        { key: "rentals",     label: "Rentals",     icon: "fas fa-house-user",  count: this.item.rents?.length || 0 },
        { key: "sales",       label: "Sales",       icon: "fas fa-handshake",   count: this.item.sales?.length || 0 },
        { key: "maintenance", label: "Maintenance", icon: "fas fa-wrench",      count: this.item.maintenanceRequests?.length || 0 },
        { key: "images",      label: "Images",      icon: "fas fa-images",      count: this.item.images?.length || 0 },
      ];
    },
  },
  methods: {
    async loadItem() {
      this.loading = true;
      try {
        const res = await this.$apiGetById('/unit', this.$route.params.id);
        this.item = res || {};
      } catch (e) { console.error(e); }
      finally { this.loading = false; }
    },
    reload() { this.showEditModal = false; this.showAddImage = false; this.editingImage = null; this.showChangeTypeModal = false; this.loadItem(); },
    editImage(img) { this.editingImage = img; },
    async deleteImage(id) {
      if (!confirm('Delete this image?')) return;
      try { await this.$apiDelete('/unitimage', id); this.reload(); } catch (e) { console.error(e); }
    },
    async confirmDelete() {
      try { await this.$apiDelete('/unit', this.item.id); this.$router.push({ name: 'Unit-view' }); }
      catch (e) { console.error(e); } finally { this.deleteModalVisible = false; }
    },
    statusClass(s) {
      return { available: 'bg-green-100 text-green-700', rented: 'bg-blue-100 text-blue-700', sold: 'bg-gray-100 text-gray-500', maintenance: 'bg-yellow-100 text-yellow-700' }[s] || 'bg-gray-100 text-gray-500';
    },
    maintenanceStatusClass(s) {
      return { pending: 'bg-yellow-100 text-yellow-700', in_progress: 'bg-blue-100 text-blue-700', resolved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-600' }[s] || 'bg-gray-100 text-gray-500';
    },
    priorityDot(p) {
      return { low: 'bg-gray-400', medium: 'bg-yellow-400', high: 'bg-orange-500', urgent: 'bg-red-500' }[p] || 'bg-gray-400';
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
