<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <Loading :visible="loading" message="Loading units..." />

    <!-- Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <div>
        <h1 class="text-xl font-bold text-gray-800">Units</h1>
        <p class="text-xs text-gray-400 mt-0.5">Manage all property units</p>
      </div>
      <button @click="openAddModal"
        class="flex items-center gap-2 bg-primary hover:bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition-colors">
        <i class="fas fa-plus text-xs"></i> Add Unit
      </button>
    </div>

    <!-- Search + page size -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
      <div class="relative w-full sm:max-w-xs">
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
        <input v-model="searchQuery" @input="fetchItems(1)" type="text" placeholder="Search by name, status…"
          class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <span>Show</span>
        <select v-model="pageSize" @change="fetchItems(1)"
          class="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white focus:ring-orange-400">
          <option v-for="s in [5,10,20,50]" :key="s" :value="s">{{ s }}</option>
        </select>
        <span>entries</span>
      </div>
    </div>

    <!-- Table (desktop) -->
    <div class="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <table class="min-w-full text-sm divide-y divide-gray-100">
        <thead class="bg-gray-50 text-xs uppercase text-gray-500 font-semibold tracking-wide">
          <tr>
            <th class="px-5 py-3 text-left">#</th>
            <th class="px-5 py-3 text-left">Unit</th>
            <th class="px-5 py-3 text-left">Site</th>
            <th class="px-5 py-3 text-left">Type</th>
            <th class="px-5 py-3 text-left">Details</th>
            <th class="px-5 py-3 text-left">Price</th>
            <th class="px-5 py-3 text-left">Status</th>
            <th class="px-5 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-orange-50 transition-colors">
            <td class="px-5 py-3 text-gray-400">{{ (currentPage-1)*pageSize + index + 1 }}</td>

            <!-- Unit name + thumbnail -->
            <td class="px-5 py-3">
              <div class="flex items-center gap-3">
                <img v-if="item.images && item.images[0]" :src="item.images[0].image_url"
                  class="w-9 h-9 rounded-lg object-cover border border-gray-200 shrink-0" />
                <div v-else
                  class="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center text-teal-500 shrink-0">
                  <i class="fas fa-door-open text-xs"></i>
                </div>
                <div>
                  <p class="font-medium text-gray-800">{{ item.name }}</p>
                  <p class="text-xs text-gray-400">Block {{ item.block_number || '—' }} · Floor {{ item.floor || '—' }}</p>
                </div>
              </div>
            </td>

            <!-- Site -->
            <td class="px-5 py-3 text-gray-600">{{ item.Site?.name || '—' }}</td>

            <!-- Type -->
            <td class="px-5 py-3 text-gray-600">{{ item.Type?.name || '—' }}</td>

            <!-- Details -->
            <td class="px-5 py-3">
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <span><i class="fas fa-bed text-gray-400 mr-0.5"></i>{{ item.bedrooms || 0 }}</span>
                <span><i class="fas fa-bath text-gray-400 mr-0.5"></i>{{ item.bathrooms || 0 }}</span>
                <span>{{ item.size || '—' }}</span>
              </div>
            </td>

            <!-- Price -->
            <td class="px-5 py-3 font-medium text-gray-800">ETB {{ item.price || '—' }}</td>

            <!-- Status -->
            <td class="px-5 py-3">
              <span :class="statusClass(item.status)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">
                {{ item.status || '—' }}
              </span>
            </td>

            <!-- Actions -->
            <td class="px-5 py-3 text-center">
              <div class="flex items-center justify-center gap-3">
                <button @click="viewDetails(item.id)" title="View" class="text-orange-500 hover:text-orange-700"><i class="fas fa-eye"></i></button>
                <button @click="editItem(item)" title="Edit" class="text-blue-500 hover:text-blue-700"><i class="fas fa-pen"></i></button>
                <button @click="openDeleteModal(item.id)" title="Delete" class="text-red-400 hover:text-red-600"><i class="fas fa-trash"></i></button>
              </div>
            </td>
          </tr>
          <tr v-if="items.length === 0 && !loading">
            <td colspan="8" class="text-center py-10 text-gray-400 italic">No units found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile cards -->
    <div class="md:hidden space-y-3">
      <div v-for="item in items" :key="item.id" class="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-500">
              <i class="fas fa-door-open text-xs"></i>
            </div>
            <div>
              <p class="font-semibold text-gray-800">{{ item.name }}</p>
              <p class="text-xs text-gray-400">{{ item.Site?.name }}</p>
            </div>
          </div>
          <div class="flex gap-3 text-sm">
            <button @click="viewDetails(item.id)" class="text-orange-500"><i class="fas fa-eye"></i></button>
            <button @click="editItem(item)" class="text-blue-500"><i class="fas fa-pen"></i></button>
            <button @click="openDeleteModal(item.id)" class="text-red-400"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <div class="flex items-center justify-between text-xs text-gray-500">
          <span><i class="fas fa-bed mr-1 text-gray-400"></i>{{ item.bedrooms }} bd · <i class="fas fa-bath mr-1 text-gray-400"></i>{{ item.bathrooms }} ba · {{ item.size }}</span>
          <span :class="statusClass(item.status)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">{{ item.status }}</span>
        </div>
      </div>
      <p v-if="items.length === 0 && !loading" class="text-center text-gray-400 py-8 italic">No units found.</p>
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

    <add-unit v-if="showModal && !editMode" @close="showModal=false" @saved="fetchItems" />
    <edit-unit v-if="showModal && editMode" :data="selectedItem" @close="showModal=false" @saved="fetchItems" />
    <delete-confirm-modal :visible="deleteModalVisible" title="Delete Unit"
      message="Are you sure you want to delete this unit?"
      @confirm="confirmDelete" @cancel="deleteModalVisible=false" />
  </div>
</template>

<script>
import AddUnit from "./AddUnit.vue";
import EditUnit from "./EditUnit.vue";
import Loading from "@/components/Loading.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";

export default {
  components: { AddUnit, EditUnit, Loading, DeleteConfirmModal },
  data() {
    return {
      items: [], count: 0, nextPage: null, previousPage: null,
      currentPage: 1, pageSize: 10, searchQuery: "",
      showModal: false, editMode: false, selectedItem: null,
      loading: false, deleteModalVisible: false, deleteId: null,
    };
  },
  methods: {
    async fetchItems(page = 1) {
      this.loading = true;
      this.currentPage = page;
      try {
        const res = await this.$apiGet('/unit', { page: this.currentPage, page_size: this.pageSize, search: this.searchQuery });
        this.items = res.data || [];
        this.count = res.count || 0;
        this.nextPage = res.next || null;
        this.previousPage = res.previous || null;
      } catch (e) { console.error(e); }
      finally { this.loading = false; }
    },
    openAddModal() { this.editMode = false; this.selectedItem = null; this.showModal = true; },
    editItem(item) { this.editMode = true; this.selectedItem = { ...item }; this.showModal = true; },
    viewDetails(id) { this.$router.push({ name: 'Unit-detail', params: { id } }); },
    openDeleteModal(id) { this.deleteId = id; this.deleteModalVisible = true; },
    async confirmDelete() {
      try { await this.$apiDelete('/unit', this.deleteId); this.fetchItems(this.currentPage); }
      catch (e) { console.error(e); } finally { this.deleteModalVisible = false; }
    },
    statusClass(s) {
      return { available: 'bg-green-100 text-green-700', rented: 'bg-blue-100 text-blue-700', sold: 'bg-gray-100 text-gray-500', maintenance: 'bg-yellow-100 text-yellow-700' }[s] || 'bg-gray-100 text-gray-500';
    },
  },
  mounted() { this.fetchItems(); }
};
</script>
