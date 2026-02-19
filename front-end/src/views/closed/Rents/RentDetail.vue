<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <Loading :visible="loading" message="Loading Rent..." />

    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <h1 class="text-lg font-bold text-gray-800">Rent Detail</h1>
      <button @click="$router.back()" class="text-blue-600 hover:underline">Back</button>
    </div>

    <!-- Rent Info -->
    <div class="bg-white overflow-hidden rounded-md border border-gray-200 p-4 hidden md:block space-y-2">
      <div><strong>ID:</strong> {{ item.id }}</div>
      <div><strong>Unit_id:</strong> {{ item.unit_id }}</div>
      <div><strong>Site_id:</strong> {{ item.site_id }}</div>
      <div><strong>Renter_id:</strong> {{ item.renter_id }}</div>
      <div><strong>Rent_amount:</strong> {{ item.rent_amount }}</div>
      <div><strong>Deposit_amount:</strong> {{ item.deposit_amount }}</div>
      <div><strong>Rent_period:</strong> {{ item.rent_period }}</div>
      <div><strong>Start_date:</strong> {{ item.start_date }}</div>
      <div><strong>Next_due_date:</strong> {{ item.next_due_date }}</div>
      <div><strong>Status:</strong> {{ item.status }}</div>
      <div><strong>Notes:</strong> {{ item.notes }}</div>
      <div><strong>Owner_id:</strong> {{ item.owner_id }}</div>
      <div><strong>Created_by:</strong> {{ item.created_by }}</div>
      <div><strong>Updated_by:</strong> {{ item.updated_by }}</div>
    </div>

    <div class="md:hidden bg-white rounded-md border border-gray-200 p-4 space-y-2">
      <div><strong>ID:</strong> {{ item.id }}</div>
      <div><strong>Unit_id:</strong> {{ item.unit_id }}</div>
      <div><strong>Site_id:</strong> {{ item.site_id }}</div>
      <div><strong>Renter_id:</strong> {{ item.renter_id }}</div>
      <div><strong>Rent_amount:</strong> {{ item.rent_amount }}</div>
      <div><strong>Deposit_amount:</strong> {{ item.deposit_amount }}</div>
      <div><strong>Rent_period:</strong> {{ item.rent_period }}</div>
      <div><strong>Start_date:</strong> {{ item.start_date }}</div>
      <div><strong>Next_due_date:</strong> {{ item.next_due_date }}</div>
      <div><strong>Status:</strong> {{ item.status }}</div>
      <div><strong>Notes:</strong> {{ item.notes }}</div>
      <div><strong>Owner_id:</strong> {{ item.owner_id }}</div>
      <div><strong>Created_by:</strong> {{ item.created_by }}</div>
      <div><strong>Updated_by:</strong> {{ item.updated_by }}</div>
    </div>

    <!-- Rent Documents -->
    <div class="mt-6">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-md font-semibold">Rent Documents</h2>
        <button 
          @click="showAddDocument = true" 
          class="px-3 py-1 bg-green-500 text-white rounded-lg"
          :disabled="!item.id"
        >
          Add Document
        </button>
      </div>

      <div v-if="rentDocuments.length" class="space-y-2">
        <div v-for="doc in rentDocuments" :key="doc.id" class="bg-white border rounded-md p-2 flex justify-between items-center">
          <div>
            <strong>{{ doc.document_name }}</strong>
            <a :href="doc.document_url" target="_blank" class="text-blue-600 hover:underline ml-2">View</a>
          </div>
          <div class="flex gap-2">
            <button @click="editDocument(doc)" class="px-2 py-1 bg-blue-500 text-white rounded text-xs">Edit</button>
            <button @click="deleteDocument(doc.id)" class="px-2 py-1 bg-red-500 text-white rounded text-xs">Delete</button>
          </div>
        </div>
      </div>
      <div v-else class="text-gray-500">No documents added yet.</div>
    </div>

    <!-- Add/Edit Modals -->
    <AddRentDocument 
      v-if="showAddDocument && item.id" 
      :data="{ rent_id: item.id }"
      @close="showAddDocument = false"
      @saved="fetchDocuments"
    />
    <EditRentDocument
      v-if="editingDocument"
      :data="editingDocument"
      @close="editingDocument = null"
      @saved="fetchDocuments"
    />
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";

// ✅ Correct import paths
import AddRentDocument from "../Rentdocuments/AddRentDocument.vue";
import EditRentDocument from "../Rentdocuments/EditRentDocument.vue";

export default {
  components: { Loading, AddRentDocument, EditRentDocument },
  data() {
    return {
      item: {},
      loading: false,
      rentDocuments: [],
      showAddDocument: false,
      editingDocument: null,
    };
  },
  async mounted() {
    await this.fetchRent();
    if (this.item.id) await this.fetchDocuments();
  },
  methods: {
    async fetchRent() {
      this.loading = true;
      const id = this.$route.params.id;
      try {
        const response = await this.$apiGetById('/rent', id);
        this.item = response || {};
      } catch (e) { console.error(e); }
      finally { this.loading = false; }
    },
    async fetchDocuments() {
      if (!this.item.id) return;
      try {
        const res = await this.$apiGet('/rentdocument', { rent_id: this.item.id });
        this.rentDocuments = res || [];
      } catch (e) { console.error(e); }
    },
    editDocument(doc) {
      this.editingDocument = doc;
    },
    async deleteDocument(id) {
      if (!confirm('Are you sure you want to delete this document?')) return;
      try {
        await this.$apiDelete(`/rentdocument/${id}`);
        this.$root.$refs.toast.showToast('Deleted successfully', 'success');
        await this.fetchDocuments();
      } catch (e) { console.error(e); }
    },
  }
};
</script>
