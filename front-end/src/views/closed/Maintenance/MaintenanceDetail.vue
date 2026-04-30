<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <Loading :visible="loading" message="Loading request..." />

    <!-- Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <div class="flex items-center gap-3">
        <button @click="$router.back()"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 shadow-sm transition-colors">
          <i class="fas fa-arrow-left text-xs"></i>
        </button>
        <div>
          <h1 class="text-lg font-bold text-gray-800">Maintenance Request</h1>
          <p class="text-xs text-gray-400">{{ item.title || '' }}</p>
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

      <!-- Status banner -->
      <div :class="statusBannerClass(item.status)" class="rounded-xl p-5 mb-5 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-white bg-opacity-60 flex items-center justify-center">
            <i :class="categoryIcon(item.category)" class="text-2xl"></i>
          </div>
          <div>
            <p class="font-bold text-lg">{{ item.title }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span :class="priorityBadge(item.priority)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">{{ item.priority }}</span>
              <span class="text-xs opacity-75">{{ item.category }}</span>
            </div>
          </div>
        </div>
        <div class="text-right">
          <span :class="statusBadge(item.status)" class="px-3 py-1 rounded-full text-sm font-semibold capitalize">
            {{ item.status.replace('_', ' ') }}
          </span>
          <p v-if="item.resolved_at" class="text-xs opacity-75 mt-1">Resolved {{ formatDate(item.resolved_at) }}</p>
        </div>
      </div>

      <!-- Quick status update bar -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Update Status</p>
        <div class="flex flex-wrap gap-2">
          <button v-for="s in statusOptions" :key="s.value"
            @click="updateStatus(s.value)"
            :disabled="item.status === s.value || updatingStatus"
            :class="[s.class, item.status === s.value ? 'opacity-100 ring-2 ring-offset-1' : 'opacity-60 hover:opacity-100']"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:cursor-default flex items-center gap-1.5">
            <i :class="s.icon" class="text-[10px]"></i>
            {{ s.label }}
            <i v-if="updatingStatus && pendingStatus === s.value" class="fas fa-spinner fa-spin text-[10px]"></i>
          </button>
        </div>
      </div>

      <!-- Detail grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

        <!-- Request details -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <i class="fas fa-file-lines text-orange-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Request Details</span>
          </div>
          <div class="p-5 space-y-3">
            <div class="detail-row"><span class="detail-label">Title</span><span class="detail-value font-medium">{{ item.title }}</span></div>
            <div class="detail-row"><span class="detail-label">Category</span><span class="detail-value">{{ item.category || '—' }}</span></div>
            <div class="detail-row"><span class="detail-label">Priority</span>
              <span :class="priorityBadge(item.priority)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">{{ item.priority }}</span>
            </div>
            <div class="detail-row"><span class="detail-label">Status</span>
              <span :class="statusBadge(item.status)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">{{ item.status.replace('_',' ') }}</span>
            </div>
            <div class="detail-row"><span class="detail-label">Requested</span><span class="detail-value">{{ formatDate(item.createdAt) }}</span></div>
            <div class="detail-row"><span class="detail-label">Resolved</span>
              <span :class="item.resolved_at ? 'text-green-600 font-medium' : 'text-gray-400'" class="text-xs text-right">
                {{ item.resolved_at ? formatDate(item.resolved_at) : 'Not yet resolved' }}
              </span>
            </div>
            <div v-if="item.description" class="pt-2 border-t border-gray-100">
              <p class="text-xs text-gray-400 mb-1">Description</p>
              <p class="text-gray-700 text-xs leading-relaxed bg-gray-50 rounded-lg p-3">{{ item.description }}</p>
            </div>
            <div v-if="item.notes" class="pt-2 border-t border-gray-100">
              <p class="text-xs text-gray-400 mb-1">Internal Notes</p>
              <p class="text-gray-700 text-xs leading-relaxed bg-yellow-50 border border-yellow-100 rounded-lg p-3">{{ item.notes }}</p>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <i class="fas fa-map-pin text-green-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Location</span>
          </div>
          <div class="p-5 space-y-4">
            <div v-if="item.site" class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                <i class="fas fa-map-pin text-sm"></i>
              </div>
              <div>
                <p class="text-xs text-gray-400">Site</p>
                <p class="font-semibold text-gray-800">{{ item.site.name }}</p>
                <p class="text-xs text-gray-400">{{ item.site.city }}</p>
              </div>
            </div>
            <div v-if="item.unit" class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                <i class="fas fa-door-open text-sm"></i>
              </div>
              <div>
                <p class="text-xs text-gray-400">Unit</p>
                <p class="font-semibold text-gray-800">{{ item.unit.name }}</p>
                <p class="text-xs text-gray-400">Floor {{ item.unit.floor }} · #{{ item.unit.house_number }}</p>
              </div>
            </div>
            <div v-if="!item.site && !item.unit" class="text-gray-400 text-xs">No location specified.</div>
          </div>
        </div>

        <!-- People -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <i class="fas fa-users text-purple-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">People</span>
          </div>
          <div class="p-5 space-y-4">
            <!-- Requester -->
            <div v-if="item.requester">
              <p class="text-xs text-gray-400 mb-1.5">Requester (Renter/Tenant)</p>
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm shrink-0">
                  {{ item.requester.first_name?.[0] }}{{ item.requester.last_name?.[0] }}
                </div>
                <div>
                  <p class="font-semibold text-gray-800 text-xs">{{ item.requester.first_name }} {{ item.requester.last_name }}</p>
                  <p class="text-xs text-gray-400">{{ item.requester.email }}</p>
                  <p class="text-xs text-gray-400">{{ item.requester.phone }}</p>
                </div>
              </div>
            </div>

            <!-- Assignee -->
            <div class="border-t border-gray-100 pt-3">
              <div class="flex items-center justify-between mb-1.5">
                <p class="text-xs text-gray-400">Assigned To</p>
                <button @click="showAssignModal = true"
                  class="text-xs text-orange-500 hover:underline flex items-center gap-1">
                  <i class="fas fa-user-plus text-[10px]"></i>
                  {{ item.assignee ? 'Reassign' : 'Assign' }}
                </button>
              </div>
              <div v-if="item.assignee" class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                  {{ item.assignee.first_name?.[0] }}{{ item.assignee.last_name?.[0] }}
                </div>
                <div>
                  <p class="font-semibold text-gray-800 text-xs">{{ item.assignee.first_name }} {{ item.assignee.last_name }}</p>
                  <p class="text-xs text-gray-400">{{ item.assignee.email }}</p>
                </div>
              </div>
              <p v-else class="text-xs text-gray-400 italic">Not yet assigned</p>
            </div>

            <!-- Owner -->
            <div v-if="item.owner" class="border-t border-gray-100 pt-3">
              <p class="text-xs text-gray-400 mb-1.5">Owner</p>
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm shrink-0">
                  {{ item.owner.first_name?.[0] }}{{ item.owner.last_name?.[0] }}
                </div>
                <p class="font-semibold text-gray-800 text-xs">{{ item.owner.first_name }} {{ item.owner.last_name }}</p>
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
            <div class="detail-row"><span class="detail-label">Created by</span>
              <span class="detail-value">{{ item.createdBy ? item.createdBy.first_name + ' ' + item.createdBy.last_name : '—' }}</span>
            </div>
            <div class="detail-row"><span class="detail-label">Updated by</span>
              <span class="detail-value">{{ item.updatedBy ? item.updatedBy.first_name + ' ' + item.updatedBy.last_name : '—' }}</span>
            </div>
            <div class="detail-row"><span class="detail-label">Created at</span><span class="detail-value">{{ formatDate(item.createdAt) }}</span></div>
            <div class="detail-row"><span class="detail-label">Updated at</span><span class="detail-value">{{ formatDate(item.updatedAt) }}</span></div>
          </div>
        </div>

      </div>
    </template>

    <!-- Modals -->
    <edit-maintenance v-if="showEditModal" :data="item" @close="showEditModal=false" @saved="reload" />
    <quick-assign-modal v-if="showAssignModal" :data="item" @close="showAssignModal=false" @saved="reload" />
    <delete-confirm-modal :visible="deleteModalVisible" title="Delete Request"
      message="Are you sure you want to delete this maintenance request?"
      @confirm="confirmDelete" @cancel="deleteModalVisible=false" />
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
import EditMaintenance from "./EditMaintenance.vue";
import QuickAssignModal from "./QuickAssignModal.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";

export default {
  components: { Loading, EditMaintenance, QuickAssignModal, DeleteConfirmModal },
  data() {
    return {
      item: {}, loading: false,
      showEditModal: false, showAssignModal: false, deleteModalVisible: false,
      updatingStatus: false, pendingStatus: '',
      statusOptions: [
        { value: 'pending',     label: 'Pending',     icon: 'fas fa-clock',        class: 'bg-yellow-100 text-yellow-700 border border-yellow-300' },
        { value: 'in_progress', label: 'In Progress', icon: 'fas fa-spinner',      class: 'bg-blue-100 text-blue-700 border border-blue-300' },
        { value: 'resolved',    label: 'Resolved',    icon: 'fas fa-circle-check', class: 'bg-green-100 text-green-700 border border-green-300' },
        { value: 'rejected',    label: 'Rejected',    icon: 'fas fa-ban',          class: 'bg-red-100 text-red-700 border border-red-300' },
      ],
    };
  },
  methods: {
    async loadItem() {
      this.loading = true;
      try {
        const res = await this.$apiGetById('/maintenance', this.$route.params.id);
        this.item = res || {};
      } catch (e) { console.error(e); }
      finally { this.loading = false; }
    },
    async updateStatus(status) {
      this.updatingStatus = true;
      this.pendingStatus = status;
      try {
        await this.$apiPatch('/maintenance', this.item.id, {
          status,
          updated_by: parseInt(localStorage.getItem('userId')) || null,
        });
        await this.loadItem();
      } catch (e) { console.error(e); }
      finally { this.updatingStatus = false; this.pendingStatus = ''; }
    },
    reload() { this.showEditModal = false; this.showAssignModal = false; this.loadItem(); },
    async confirmDelete() {
      try { await this.$apiDelete('/maintenance', this.item.id); this.$router.push({ name: 'Maintenance-view' }); }
      catch (e) { console.error(e); } finally { this.deleteModalVisible = false; }
    },
    statusBannerClass(s) { return { pending: 'bg-yellow-100 text-yellow-800', in_progress: 'bg-blue-100 text-blue-800', resolved: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' }[s] || 'bg-gray-100 text-gray-700'; },
    statusBadge(s) { return { pending: 'bg-yellow-100 text-yellow-700', in_progress: 'bg-blue-100 text-blue-700', resolved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-600' }[s] || 'bg-gray-100 text-gray-500'; },
    priorityBadge(p) { return { urgent: 'bg-red-100 text-red-700', high: 'bg-orange-100 text-orange-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-gray-100 text-gray-600' }[p] || 'bg-gray-100 text-gray-500'; },
    categoryIcon(c) { return { Plumbing: 'fas fa-faucet', Electrical: 'fas fa-bolt', HVAC: 'fas fa-wind', Structural: 'fas fa-building', Cosmetic: 'fas fa-paint-roller', Appliance: 'fas fa-blender', Security: 'fas fa-shield-halved' }[c] || 'fas fa-wrench'; },
    formatDate(ts) { if (!ts) return '—'; return new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); },
  },
  mounted() { this.loadItem(); },
};
</script>

<style scoped>
.detail-row { @apply flex items-center justify-between gap-4; }
.detail-label { @apply text-xs text-gray-400 shrink-0 w-24; }
.detail-value { @apply text-gray-800 text-xs text-right; }
</style>
