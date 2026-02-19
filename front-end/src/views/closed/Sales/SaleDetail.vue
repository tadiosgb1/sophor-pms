<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <!-- Loading -->
    <Loading :visible="loading" message="Loading Sale..." />

    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <h1 class="text-lg font-bold text-gray-800">Sale Detail</h1>
      <button @click="$router.back()" class="text-blue-600 hover:underline">Back</button>
    </div>

    <!-- Sale Info -->
    <div class="bg-white overflow-hidden rounded-md border border-gray-200 p-4 hidden md:block space-y-2">
      <div><strong>ID:</strong> {{ item.id }}</div>
      <div><strong>Unit_id:</strong> {{ item.unit_id }}</div>
      <div><strong>Site_id:</strong> {{ item.site_id }}</div>
      <div><strong>Buyer_id:</strong> {{ item.buyer_id }}</div>
      <div><strong>Sale_price:</strong> {{ item.sale_price }}</div>
      <div><strong>Sale_date:</strong> {{ item.sale_date }}</div>
      <div><strong>Status:</strong> {{ item.status }}</div>
      <div><strong>Notes:</strong> {{ item.notes }}</div>
      <div><strong>Owner_id:</strong> {{ item.owner_id }}</div>
      <div><strong>Created_by:</strong> {{ item.created_by }}</div>
      <div><strong>Updated_by:</strong> {{ item.updated_by }}</div>
    </div>

    <!-- Sale Documents Section -->
    <div class="mt-6">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-md font-semibold">Sale Documents</h2>
        <button @click="showAddDocument = true" class="px-3 py-1 bg-green-500 text-white rounded-lg">Add Document</button>
      </div>

      <div v-if="saleDocuments.length" class="space-y-2">
        <div v-for="doc in saleDocuments" :key="doc.id" class="bg-white border rounded-md p-2 flex justify-between items-center">
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
    <AddSaleDocument 
      v-if="showAddDocument" 
      :data="{ sale_id: item.id }"
      @close="showAddDocument = false" 
      @saved="fetchDocuments"
    />
    <EditSaleDocument 
      v-if="editingDocument" 
      :data="editingDocument"
      @close="editingDocument=null" 
      @saved="fetchDocuments"
    />
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
import AddSaleDocument from "../Saledocuments/AddSaleDocument.vue";
import EditSaleDocument from "../Saledocuments/EditSaleDocument.vue";

export default {
  components: { Loading, AddSaleDocument, EditSaleDocument },
  data() {
    return {
      item: {},
      loading: false,
      saleDocuments: [],
      showAddDocument: false,
      editingDocument: null,
    };
  },
  async mounted() {
    await this.fetchSale();
    await this.fetchDocuments();
  },
  methods: {
    async fetchSale() {
      this.loading = true;
      const id = this.$route.params.id;
      try {
        const response = await this.$apiGetById('/sale', id);
        this.item = response || {};
      } catch (e) { console.error(e); }
      finally { this.loading = false; }
    },
    async fetchDocuments() {
      try {
        const res = await this.$apiGet('/saledocument', { sale_id: this.item.id });
        this.saleDocuments = res || [];
      } catch (e) { console.error(e); }
    },
    editDocument(doc) {
      this.editingDocument = doc;
    },
    async deleteDocument(id) {
      if (!confirm('Are you sure you want to delete this document?')) return;
      try {
        await this.$apiDelete(`/saledocument/${id}`);
        this.$root.$refs.toast.showToast('Deleted successfully', 'success');
        await this.fetchDocuments();
      } catch (e) { console.error(e); }
    },
  }
};
</script>
