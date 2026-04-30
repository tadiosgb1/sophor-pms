<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <Loading :visible="loading" message="Loading rental..." />

    <!-- Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <div class="flex items-center gap-3">
        <button @click="$router.back()"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 shadow-sm transition-colors">
          <i class="fas fa-arrow-left text-xs"></i>
        </button>
        <div>
          <h1 class="text-lg font-bold text-gray-800">Rental Detail</h1>
          <p class="text-xs text-gray-400">{{ item.Unit?.name || '' }} · {{ item.renter?.first_name }} {{ item.renter?.last_name }}</p>
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
            <i class="fas fa-house-user text-2xl"></i>
          </div>
          <div>
            <p class="font-bold text-lg">{{ item.Unit?.name || 'Rental' }}</p>
            <p class="text-xs opacity-75">{{ item.Site?.name }} · {{ item.rent_period }}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-3xl font-bold">ETB {{ Number(item.rent_amount).toLocaleString() }}</p>
          <p class="text-xs opacity-75">per {{ item.rent_period }}</p>
          <span :class="statusBadge(item.status)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize mt-1 inline-block">
            {{ item.status }}
          </span>
        </div>
      </div>

      <!-- Overdue alert -->
      <div v-if="isOverdue" class="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-3 mb-5">
        <i class="fas fa-triangle-exclamation text-red-500"></i>
        <div>
          <p class="font-semibold text-red-700 text-xs">Payment Overdue</p>
          <p class="text-xs text-red-500">Next due date was {{ formatDate(item.next_due_date) }}</p>
        </div>
      </div>

      <!-- Detail grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

        <!-- Lease info -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <i class="fas fa-file-contract text-pink-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Lease Info</span>
          </div>
          <div class="p-5 space-y-3">
            <div class="detail-row"><span class="detail-label">Rent Amount</span>
              <span class="font-bold text-gray-900 text-sm">ETB {{ Number(item.rent_amount).toLocaleString() }}</span>
            </div>
            <div class="detail-row"><span class="detail-label">Deposit</span>
              <span class="detail-value">ETB {{ Number(item.deposit_amount).toLocaleString() }}</span>
            </div>
            <div class="detail-row"><span class="detail-label">Period</span>
              <span class="detail-value capitalize">{{ item.rent_period }}</span>
            </div>
            <div class="detail-row"><span class="detail-label">Start Date</span>
              <span class="detail-value">{{ formatDate(item.start_date) }}</span>
            </div>
            <div class="detail-row"><span class="detail-label">Next Due</span>
              <span :class="isOverdue ? 'text-red-600 font-semibold' : 'text-gray-800'" class="text-xs text-right">
                {{ formatDate(item.next_due_date) }}
              </span>
            </div>
            <div class="detail-row"><span class="detail-label">Status</span>
              <span :class="statusBadge(item.status)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">{{ item.status }}</span>
            </div>
            <div v-if="item.notes" class="pt-2 border-t border-gray-100">
              <p class="text-xs text-gray-400 mb-1">Notes</p>
              <p class="text-gray-700 text-xs leading-relaxed bg-gray-50 rounded-lg p-3">{{ item.notes }}</p>
            </div>
          </div>
        </div>

        <!-- Property -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <i class="fas fa-building text-teal-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Property</span>
          </div>
          <div class="p-5 space-y-4">
            <div v-if="item.Unit" class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                <i class="fas fa-door-open text-sm"></i>
              </div>
              <div>
                <p class="text-xs text-gray-400">Unit</p>
                <p class="font-semibold text-gray-800">{{ item.Unit.name }}</p>
                <p class="text-xs text-gray-400">Floor {{ item.Unit.floor }} · #{{ item.Unit.house_number }}</p>
              </div>
            </div>
            <div v-if="item.Site" class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                <i class="fas fa-map-pin text-sm"></i>
              </div>
              <div>
                <p class="text-xs text-gray-400">Site</p>
                <p class="font-semibold text-gray-800">{{ item.Site.name }}</p>
                <p class="text-xs text-gray-400">{{ item.Site.city }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Renter -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <i class="fas fa-user text-orange-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Renter / Tenant</span>
          </div>
          <div class="p-5">
            <template v-if="item.renter">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm shrink-0">
                  {{ item.renter.first_name?.[0] }}{{ item.renter.last_name?.[0] }}
                </div>
                <div>
                  <p class="font-semibold text-gray-800">{{ item.renter.first_name }} {{ item.renter.last_name }}</p>
                  <p class="text-xs text-gray-400">{{ item.renter.email }}</p>
                  <p class="text-xs text-gray-400">{{ item.renter.phone }}</p>
                </div>
              </div>
            </template>
            <p v-else class="text-gray-400 text-xs">Renter ID: {{ item.renter_id || '—' }}</p>
          </div>
        </div>

        <!-- Record info -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <i class="fas fa-clock text-gray-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Record Info</span>
          </div>
          <div class="p-5 space-y-3">
            <div class="detail-row"><span class="detail-label">Owner</span>
              <span class="detail-value">{{ item.owner ? item.owner.first_name + ' ' + item.owner.last_name : '—' }}</span>
            </div>
            <div class="detail-row"><span class="detail-label">Created by</span>
              <span class="detail-value">{{ item.createdBy ? item.createdBy.first_name + ' ' + item.createdBy.last_name : '—' }}</span>
            </div>
            <div class="detail-row"><span class="detail-label">Updated by</span>
              <span class="detail-value">{{ item.updatedBy ? item.updatedBy.first_name + ' ' + item.updatedBy.last_name : '—' }}</span>
            </div>
            <div class="detail-row"><span class="detail-label">Created at</span>
              <span class="detail-value">{{ formatDate(item.createdAt) }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Documents section -->
      <div class="mt-5 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i class="fas fa-file-lines text-indigo-400 text-xs"></i>
            <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Rent Documents</span>
          </div>
          <button @click="showAddDocument = true"
            class="flex items-center gap-1 text-xs bg-orange-500 hover:bg-orange-600 text-white px-2.5 py-1 rounded-lg transition-colors">
            <i class="fas fa-plus text-[10px]"></i> Add Document
          </button>
        </div>

        <div v-if="item.documents && item.documents.length" class="divide-y divide-gray-100">
          <div v-for="doc in item.documents" :key="doc.id"
            class="px-5 py-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <i class="fas fa-file-pdf text-xs"></i>
              </div>
              <div>
                <p class="font-medium text-gray-800 text-xs">{{ doc.document_name }}</p>
                <a v-if="doc.document_url" :href="doc.document_url" target="_blank"
                  class="text-xs text-orange-500 hover:underline">View document</a>
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="editDocument(doc)"
                class="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 text-xs">
                <i class="fas fa-pen"></i>
              </button>
              <button @click="deleteDocument(doc.id)"
                class="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-xs">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="px-5 py-8 text-center text-gray-400 text-xs italic">No documents uploaded yet.</div>
      </div>

    </template>

    <!-- Modals -->
    <edit-rent v-if="showEditModal" :data="item" @close="showEditModal=false" @saved="reload" />
    <AddRentDocument v-if="showAddDocument" :data="{ rent_id: item.id }" @close="showAddDocument=false" @saved="reload" />
    <EditRentDocument v-if="editingDocument" :data="editingDocument" @close="editingDocument=null" @saved="reload" />
    <delete-confirm-modal :visible="deleteModalVisible" title="Delete Rental"
      message="Are you sure you want to delete this rental?"
      @confirm="confirmDelete" @cancel="deleteModalVisible=false" />
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
import EditRent from "./EditRent.vue";
import AddRentDocument from "../Rentdocuments/AddRentDocument.vue";
import EditRentDocument from "../Rentdocuments/EditRentDocument.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";

export default {
  components: { Loading, EditRent, AddRentDocument, EditRentDocument, DeleteConfirmModal },
  data() {
    return {
      item: {}, loading: false,
      showEditModal: false, showAddDocument: false,
      editingDocument: null, deleteModalVisible: false,
    };
  },
  computed: {
    isOverdue() {
      return this.item.status === 'active' && this.item.next_due_date && new Date(this.item.next_due_date) < new Date();
    },
  },
  methods: {
    async loadItem() {
      this.loading = true;
      try {
        const res = await this.$apiGetById('/rent', this.$route.params.id);
        this.item = res || {};
      } catch (e) { console.error(e); }
      finally { this.loading = false; }
    },
    reload() { this.showEditModal = false; this.showAddDocument = false; this.editingDocument = null; this.loadItem(); },
    editDocument(doc) { this.editingDocument = doc; },
    async deleteDocument(id) {
      if (!confirm('Delete this document?')) return;
      try { await this.$apiDelete('/rentdocument', id); this.reload(); } catch (e) { console.error(e); }
    },
    async confirmDelete() {
      try { await this.$apiDelete('/rent', this.item.id); this.$router.push({ name: 'Rent-view' }); }
      catch (e) { console.error(e); } finally { this.deleteModalVisible = false; }
    },
    statusBannerClass(s) {
      return { active: 'bg-green-100 text-green-800', expired: 'bg-gray-100 text-gray-700', terminated: 'bg-red-100 text-red-800', pending: 'bg-yellow-100 text-yellow-800' }[s] || 'bg-gray-100 text-gray-700';
    },
    statusBadge(s) {
      return { active: 'bg-green-100 text-green-700', expired: 'bg-gray-100 text-gray-500', terminated: 'bg-red-100 text-red-600', pending: 'bg-yellow-100 text-yellow-700' }[s] || 'bg-gray-100 text-gray-500';
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
