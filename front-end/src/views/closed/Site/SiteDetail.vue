<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <Loading :visible="loading" message="Loading site..." />

    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <div class="flex items-center gap-3">
        <button @click="$router.back()"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 shadow-sm transition-colors">
          <i class="fas fa-arrow-left text-xs"></i>
        </button>
        <div>
          <h1 class="text-lg font-bold text-gray-800">Site Detail</h1>
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

        <!-- Images -->
        <div v-if="item.images && item.images.length" class="mb-5">
          <div class="flex gap-3 overflow-x-auto pb-2">
            <img v-for="img in item.images" :key="img.id" :src="img.image_url"
              class="h-40 w-60 object-cover rounded-xl border border-gray-200 shrink-0 shadow-sm" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

          <!-- Basic info -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <i class="fas fa-info-circle text-orange-400 text-xs"></i>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">General</span>
            </div>
            <div class="p-5 space-y-3">
              <div class="detail-row"><span class="detail-label">Name</span><span class="detail-value font-medium">{{ item.name }}</span></div>
              <div class="detail-row"><span class="detail-label">Type</span><span class="detail-value">{{ item.Type?.name || '—' }}</span></div>
              <div class="detail-row">
                <span class="detail-label">Status</span>
                <span :class="statusClass(item.status)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">{{ item.status || '—' }}</span>
              </div>
              <div class="detail-row"><span class="detail-label">Area Size</span><span class="detail-value">{{ item.area_size || '—' }}</span></div>
              <div class="detail-row"><span class="detail-label">Capacity</span><span class="detail-value">{{ item.capacity || '—' }}</span></div>
              <div v-if="item.description" class="pt-1">
                <p class="text-xs text-gray-400 mb-1">Description</p>
                <p class="text-gray-700 text-xs leading-relaxed">{{ item.description }}</p>
              </div>
            </div>
          </div>

          <!-- Location -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <i class="fas fa-map-marker-alt text-green-400 text-xs"></i>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Location</span>
            </div>
            <div class="p-5 space-y-3">
              <div class="detail-row"><span class="detail-label">Country</span><span class="detail-value">{{ item.country || '—' }}</span></div>
              <div class="detail-row"><span class="detail-label">State</span><span class="detail-value">{{ item.state || '—' }}</span></div>
              <div class="detail-row"><span class="detail-label">City</span><span class="detail-value">{{ item.city || '—' }}</span></div>
              <div class="detail-row"><span class="detail-label">Sub City</span><span class="detail-value">{{ item.sub_city || '—' }}</span></div>
              <div class="detail-row"><span class="detail-label">Street</span><span class="detail-value">{{ item.street || '—' }}</span></div>
              <div class="detail-row"><span class="detail-label">Postal Code</span><span class="detail-value">{{ item.postal_code || '—' }}</span></div>
              <div v-if="item.latitude && item.longitude" class="pt-1">
                <a :href="`https://www.google.com/maps?q=${item.latitude},${item.longitude}`" target="_blank"
                  class="inline-flex items-center gap-1.5 text-xs text-green-600 hover:underline">
                  <i class="fas fa-external-link-alt text-[10px]"></i> View on Google Maps
                </a>
              </div>
            </div>
          </div>

          <!-- Contact -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <i class="fas fa-address-card text-blue-400 text-xs"></i>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Contact</span>
            </div>
            <div class="p-5 space-y-3">
              <div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value">{{ item.contact_phone || '—' }}</span></div>
              <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">{{ item.contact_email || '—' }}</span></div>
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

        </div>
      </div>

      <!-- ── TAB: Rentals ── -->
      <div v-if="activeTab === 'rentals'">
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="fas fa-house-user text-pink-400 text-xs"></i>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Active Rentals</span>
            </div>
            <button @click="$router.push({ name: 'Rent-view' })" class="text-xs text-orange-500 hover:underline">View all</button>
          </div>
          <div v-if="item.rents && item.rents.length" class="divide-y divide-gray-100">
            <div v-for="rent in item.rents" :key="rent.id" class="px-5 py-3 flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-800 text-xs">{{ rent.Unit?.name || 'Unit #' + rent.unit_id }}</p>
                <p class="text-xs text-gray-400">{{ rent.renter?.first_name }} {{ rent.renter?.last_name }} · {{ rent.rent_period }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-800 text-xs">ETB {{ rent.rent_amount }}</p>
                <span :class="rent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                  class="px-2 py-0.5 rounded-full text-[10px] font-medium capitalize">{{ rent.status }}</span>
              </div>
            </div>
          </div>
          <div v-else class="px-5 py-8 text-center text-gray-400 text-xs italic">No rentals found for this site.</div>
        </div>
      </div>

      <!-- ── TAB: Sales ── -->
      <div v-if="activeTab === 'sales'">
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="fas fa-handshake text-yellow-500 text-xs"></i>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Sales</span>
            </div>
            <button @click="$router.push({ name: 'Sale-view' })" class="text-xs text-orange-500 hover:underline">View all</button>
          </div>
          <div v-if="item.sales && item.sales.length" class="divide-y divide-gray-100">
            <div v-for="sale in item.sales" :key="sale.id" class="px-5 py-3 flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-800 text-xs">{{ sale.Unit?.name || 'Unit #' + sale.unit_id }}</p>
                <p class="text-xs text-gray-400">{{ sale.buyer?.first_name }} {{ sale.buyer?.last_name }} · {{ formatDate(sale.sale_date) }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-800 text-xs">ETB {{ sale.sale_price }}</p>
                <span :class="sale.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                  class="px-2 py-0.5 rounded-full text-[10px] font-medium capitalize">{{ sale.status }}</span>
              </div>
            </div>
          </div>
          <div v-else class="px-5 py-8 text-center text-gray-400 text-xs italic">No sales found for this site.</div>
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
                  <p class="text-xs text-gray-400">{{ req.category }} · {{ req.unit?.name || 'Site-level' }}</p>
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
          <div v-else class="px-5 py-8 text-center text-gray-400 text-xs italic">No maintenance requests for this site.</div>
        </div>
      </div>

      <!-- ── TAB: Images ── -->
      <div v-if="activeTab === 'images'">
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="fas fa-images text-indigo-400 text-xs"></i>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Site Images</span>
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

      <!-- ── TAB: Amenities ── -->
      <div v-if="activeTab === 'amenities'">
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="fas fa-star text-yellow-400 text-xs"></i>
              <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Site Amenities</span>
            </div>
            <button @click="showAddAmenityModal = true"
              class="flex items-center gap-1 text-xs bg-orange-500 hover:bg-orange-600 text-white px-2.5 py-1 rounded-lg transition-colors">
              <i class="fas fa-plus text-[10px]"></i> Add Amenity
            </button>
          </div>

          <!-- Current amenities grid -->
          <div v-if="item.siteAmenities && item.siteAmenities.length" class="p-5">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <div v-for="sa in item.siteAmenities" :key="sa.id"
                class="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 group">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600 shrink-0">
                    <i class="fas fa-star text-xs"></i>
                  </div>
                  <span class="text-xs font-medium text-gray-700">{{ sa.Amenity?.name || '—' }}</span>
                </div>
                <button @click="removeSiteAmenity(sa.id)"
                  class="w-5 h-5 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                  <i class="fas fa-times text-[10px]"></i>
                </button>
              </div>
            </div>
          </div>
          <div v-else class="px-5 py-8 text-center text-gray-400 text-xs italic">No amenities assigned to this site yet.</div>
        </div>
      </div>

    </template>

    <!-- Modals -->
    <edit-site v-if="showEditModal" :data="item" @close="showEditModal=false" @saved="reload" />
    <AddSiteImage v-if="showAddImage" :data="{ site_id: item.id }" @close="showAddImage=false" @saved="reload" />
    <EditSiteImage v-if="editingImage" :data="editingImage" @close="editingImage=null" @saved="reload" />
    <AddSiteAmenityModal v-if="showAddAmenityModal" :site-id="item.id" :existing="item.siteAmenities || []" @close="showAddAmenityModal=false" @saved="reload" />
    <delete-confirm-modal :visible="deleteModalVisible" title="Delete Site"
      message="Are you sure you want to delete this site?"
      @confirm="confirmDelete" @cancel="deleteModalVisible=false" />
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
import EditSite from "./EditSite.vue";
import AddSiteImage from "../SiteImages/AddSiteImage.vue";
import EditSiteImage from "../SiteImages/EditSiteImage.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import AddSiteAmenityModal from "./AddSiteAmenityModal.vue";

export default {
  components: { Loading, EditSite, AddSiteImage, EditSiteImage, DeleteConfirmModal, AddSiteAmenityModal },
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
      showAddAmenityModal: false,
    };
  },
  computed: {
    tabs() {
      return [
        { key: "overview",    label: "Overview",    icon: "fas fa-info-circle" },
        { key: "amenities",   label: "Amenities",   icon: "fas fa-star",        count: this.item.siteAmenities?.length || 0 },
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
        const res = await this.$apiGetById('/site', this.$route.params.id);
        this.item = res || {};
      } catch (e) { console.error(e); }
      finally { this.loading = false; }
    },
    reload() { this.showEditModal = false; this.showAddImage = false; this.editingImage = null; this.loadItem(); },
    editImage(img) { this.editingImage = img; },
    async deleteImage(id) {
      if (!confirm('Delete this image?')) return;
      try { await this.$apiDelete('/siteimage', id); this.reload(); } catch (e) { console.error(e); }
    },
    async removeSiteAmenity(id) {
      if (!confirm('Remove this amenity from the site?')) return;
      try { await this.$apiDelete('/siteamenity', id); this.reload(); } catch (e) { console.error(e); }
    },
    async confirmDelete() {
      try { await this.$apiDelete('/site', this.item.id); this.$router.push({ name: 'Site-view' }); }
      catch (e) { console.error(e); } finally { this.deleteModalVisible = false; }
    },
    statusClass(s) {
      return { active: 'bg-green-100 text-green-700', inactive: 'bg-gray-100 text-gray-500', maintenance: 'bg-yellow-100 text-yellow-700' }[s] || 'bg-gray-100 text-gray-500';
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
