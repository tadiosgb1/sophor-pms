<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">
    <Loading :visible="loading" message="Loading companies..." />

    <!-- Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <div>
        <h1 class="text-xl font-bold text-gray-800">Companies</h1>
        <p class="text-xs text-gray-400 mt-0.5">Manage all registered companies</p>
      </div>
      <button
        @click="openAddModal"
        class="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition-colors"
      >
        <i class="fas fa-plus text-xs"></i>
        Add Company
      </button>
    </div>

    <!-- Search + page size -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
      <div class="relative w-full sm:max-w-xs">
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
        <input
          v-model="searchQuery"
          @input="fetchItems(1)"
          type="text"
          placeholder="Search by name, email, phone…"
          class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <span>Show</span>
        <select
          v-model="pageSize"
          @change="fetchItems(1)"
          class="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white focus:ring-orange-400"
        >
          <option v-for="s in [5, 10, 20, 50]" :key="s" :value="s">{{ s }}</option>
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
            <th class="px-5 py-3 text-left">Company</th>
            <th class="px-5 py-3 text-left">Contact</th>
            <th class="px-5 py-3 text-left">Address</th>
            <th class="px-5 py-3 text-left">Website</th>
            <th class="px-5 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="(item, index) in items"
            :key="item.id"
            class="hover:bg-orange-50 transition-colors"
          >
            <td class="px-5 py-3 text-gray-400">{{ (currentPage - 1) * pageSize + index + 1 }}</td>

            <!-- Company name + logo -->
            <td class="px-5 py-3">
              <div class="flex items-center gap-3">
                <img
                  v-if="item.logo"
                  :src="item.logo"
                  class="w-8 h-8 rounded-full object-cover border border-gray-200"
                  alt="logo"
                />
                <div
                  v-else
                  class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs uppercase"
                >
                  {{ item.name?.[0] || '?' }}
                </div>
                <span class="font-medium text-gray-800">{{ item.name }}</span>
              </div>
            </td>

            <!-- Contact -->
            <td class="px-5 py-3">
              <div class="text-gray-700">{{ item.phone }}</div>
              <div class="text-gray-400 text-xs">{{ item.official_email }}</div>
            </td>

            <!-- Address -->
            <td class="px-5 py-3 text-gray-600">{{ item.address || '—' }}</td>

            <!-- Website -->
            <td class="px-5 py-3">
              <a
                v-if="item.website"
                :href="item.website"
                target="_blank"
                class="text-orange-500 hover:underline truncate max-w-[140px] block"
              >{{ item.website }}</a>
              <span v-else class="text-gray-400">—</span>
            </td>

            <!-- Actions -->
            <td class="px-5 py-3 text-center">
              <div class="flex items-center justify-center gap-3">
                <button @click="viewDetails(item.id)" title="View" class="text-orange-500 hover:text-orange-700">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="editItem(item)" title="Edit" class="text-blue-500 hover:text-blue-700">
                  <i class="fas fa-pen"></i>
                </button>
                <button @click="openDeleteModal(item.id)" title="Delete" class="text-red-400 hover:text-red-600">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="items.length === 0 && !loading">
            <td colspan="6" class="text-center py-10 text-gray-400 italic">No companies found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile cards -->
    <div class="md:hidden space-y-3">
      <div
        v-for="item in items"
        :key="item.id"
        class="bg-white border border-gray-200 rounded-xl shadow-sm p-4"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <img
              v-if="item.logo"
              :src="item.logo"
              class="w-9 h-9 rounded-full object-cover border"
              alt="logo"
            />
            <div
              v-else
              class="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm uppercase"
            >
              {{ item.name?.[0] || '?' }}
            </div>
            <span class="font-semibold text-gray-800">{{ item.name }}</span>
          </div>
          <div class="flex gap-3 text-sm">
            <button @click="viewDetails(item.id)" class="text-orange-500"><i class="fas fa-eye"></i></button>
            <button @click="editItem(item)" class="text-blue-500"><i class="fas fa-pen"></i></button>
            <button @click="openDeleteModal(item.id)" class="text-red-400"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <div class="text-xs text-gray-500 space-y-1">
          <div><i class="fas fa-phone w-4 text-gray-400"></i> {{ item.phone || '—' }}</div>
          <div><i class="fas fa-envelope w-4 text-gray-400"></i> {{ item.official_email || '—' }}</div>
          <div><i class="fas fa-map-marker-alt w-4 text-gray-400"></i> {{ item.address || '—' }}</div>
        </div>
      </div>
      <p v-if="items.length === 0 && !loading" class="text-center text-gray-400 py-8 italic">No companies found.</p>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between mt-5 text-xs text-gray-500">
      <span>
        Showing {{ items.length ? (currentPage - 1) * pageSize + 1 : 0 }}–{{ Math.min(currentPage * pageSize, count) }}
        of {{ count }} entries
      </span>
      <div class="flex items-center gap-2">
        <button
          @click="fetchItems(currentPage - 1)"
          :disabled="!previousPage"
          class="px-3 py-1.5 border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >← Prev</button>
        <span class="px-3 py-1.5 bg-orange-500 text-white rounded-lg font-semibold">{{ currentPage }}</span>
        <button
          @click="fetchItems(currentPage + 1)"
          :disabled="!nextPage"
          class="px-3 py-1.5 border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >Next →</button>
      </div>
    </div>

    <!-- Modals -->
    <add-company v-if="showModal && !editMode" @close="showModal = false" @saved="fetchItems" />
    <edit-company v-if="showModal && editMode" :data="selectedItem" @close="showModal = false" @saved="fetchItems" />

    <delete-confirm-modal
      :visible="deleteModalVisible"
      title="Delete Company"
      message="Are you sure you want to delete this company? This action cannot be undone."
      @confirm="confirmDelete"
      @cancel="deleteModalVisible = false"
    />
  </div>
</template>

<script>
import AddCompany from "./AddCompany.vue";
import EditCompany from "./EditCompany.vue";
import Loading from "@/components/Loading.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";

export default {
  components: { AddCompany, EditCompany, Loading, DeleteConfirmModal },

  data() {
    return {
      items: [],
      count: 0,
      nextPage: null,
      previousPage: null,
      currentPage: 1,
      pageSize: 10,
      searchQuery: "",
      showModal: false,
      editMode: false,
      selectedItem: null,
      loading: false,
      deleteModalVisible: false,
      deleteId: null,
    };
  },

  methods: {
    async fetchItems(page = 1) {
      this.loading = true;
      this.currentPage = page;
      try {
        const res = await this.$apiGet("/company", {
          page: this.currentPage,
          page_size: this.pageSize,
          search: this.searchQuery,
        });
        this.items = res.data || [];
        this.count = res.count || 0;
        this.nextPage = res.next || null;
        this.previousPage = res.previous || null;
      } catch (e) {
        console.error("fetchItems error:", e);
      } finally {
        this.loading = false;
      }
    },

    openAddModal() {
      this.editMode = false;
      this.selectedItem = null;
      this.showModal = true;
    },

    editItem(item) {
      this.editMode = true;
      this.selectedItem = { ...item };
      this.showModal = true;
    },

    viewDetails(id) {
      this.$router.push({ name: "Company-detail", params: { id } });
    },

    openDeleteModal(id) {
      this.deleteId = id;
      this.deleteModalVisible = true;
    },

    async confirmDelete() {
      try {
        await this.$apiDelete("/company", this.deleteId);
        this.fetchItems(this.currentPage);
      } catch (e) {
        console.error("delete error:", e);
      } finally {
        this.deleteModalVisible = false;
      }
    },
  },

  mounted() {
    this.fetchItems();
  },
};
</script>
