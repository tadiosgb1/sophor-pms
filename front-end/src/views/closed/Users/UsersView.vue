<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800 relative">
    
    <!-- Loading -->
    <Loading :visible="loading" message="Loading Users..." />

    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <h1 class="text-lg font-bold text-gray-800">Users</h1>
      <button
        @click="openAddModal"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-md flex items-center space-x-1 text-sm"
      >
        <svg
          class="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>Add User</span>
      </button>
    </div>

    <!-- Search + Page Size -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4"
    >
      <input
        v-model="searchQuery"
        @input="fetchItems(1)"
        type="text"
        placeholder="Search..."
        class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition"
      />

      <div class="flex items-center gap-2 text-sm text-gray-600">
        <label>Show</label>
        <select
          v-model="pageSize"
          @change="fetchItems(1)"
          class="border border-gray-300 rounded-lg px-2 py-1 bg-white focus:ring-green-500 focus:border-green-500"
        >
          <option v-for="size in [5, 10, 20, 50, 100]" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
        <span>entries</span>
      </div>
    </div>

    <!-- Desktop Table -->
    <div class="bg-white overflow-hidden rounded-xl border border-gray-200 hidden md:block">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm divide-y divide-gray-200">
          <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th class="px-6 py-3 text-left">#</th>
              <th class="px-6 py-3 text-left">First Name</th>
              <th class="px-6 py-3 text-left">Middle Name</th>
              <th class="px-6 py-3 text-left">Last Name</th>
              <th class="px-6 py-3 text-left">Email</th>
              <th class="px-6 py-3 text-left">Phone</th>
              <th class="px-6 py-3 text-left">Address</th>
              <th class="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(item, index) in items"
              :key="item.id"
              class="hover:bg-green-50 transition"
            >
              <td class="px-6 py-4">{{ index + 1 }}</td>
              <td class="px-6 py-4">{{ item.first_name }}</td>
              <td class="px-6 py-4">{{ item.middle_name }}</td>
              <td class="px-6 py-4">{{ item.last_name }}</td>
              <td class="px-6 py-4">{{ item.email }}</td>
              <td class="px-6 py-4">{{ item.phone }}</td>
              <td class="px-6 py-4">{{ item.address }}</td>

              <td class="px-6 py-4 space-x-3 text-center">
                <button @click="viewRoles(item.id)" class="text-green-500 hover:text-green-700">View Roles</button>
                <button @click="viewPermissions(item.id)" class="text-green-500 hover:text-green-700">View Permissions</button>
                <button @click="viewDetails(item.id)" class="text-green-500 hover:text-green-700"><i class="fas fa-eye"></i></button>
                <button @click="editItem(item)" class="text-blue-500 hover:text-blue-700"><i class="fas fa-edit"></i></button>
                <button @click="openDeleteModal(item.id)" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
              </td>
            </tr>

            <tr v-if="items.length === 0">
              <td colspan="8" class="text-center py-6 text-gray-400 italic">No data found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Pagination -->
    <div class="flex items-center justify-between mt-6 text-sm text-gray-600">
      <span>
        Showing {{ (currentPage - 1) * pageSize + 1 }}
        to {{ Math.min(currentPage * pageSize, count) }}
        of {{ count }} entries
      </span>

      <div class="flex items-center gap-2">
        <button
          @click="fetchItems(currentPage - 1)"
          :disabled="!previousPage"
          class="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >← Previous</button>

        <span class="px-3 py-1 bg-green-600 text-white rounded">{{ currentPage }}</span>

        <button
          @click="fetchItems(currentPage + 1)"
          :disabled="!nextPage"
          class="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >Next →</button>
      </div>
    </div>

    <!-- Add/Edit Modals -->
    <add-users v-if="showModal && !editMode" :data="selectedItem" @close="showModal=false" @saved="fetchItems" />
    <edit-users v-if="showModal && editMode" :data="selectedItem" @close="showModal=false" @saved="fetchItems" />

    <!-- Delete Modal -->
    <delete-confirm-modal
      :visible="deleteModalVisible"
      title="Delete User"
      message="Are you sure you want to delete this user?"
      @confirm="confirmDelete"
      @cancel="deleteModalVisible=false"
    />

    <!-- View Roles Modal -->
    <view-roles-modal
      v-if="showRolesModal"
      :roles="selectedRoles"
      :userId="selectedUserId"
      @close="showRolesModal = false"
    />

    <!-- View Permissions Modal -->
    <view-permissions-modal
      v-if="showPermissionsModal"
      :permissions="selectedPermissions"
      @close="showPermissionsModal = false"
    />

  </div>
</template>

<script>
import AddUsers from "./AddUsers.vue";
import EditUsers from "./EditUsers.vue";
import Loading from "@/components/Loading.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import ViewRolesModal from "./ViewRolesModal.vue";
import ViewPermissionsModal from "./ViewPermissionsModal.vue";

export default {
  components: {
    AddUsers,
    EditUsers,
    Loading,
    DeleteConfirmModal,
    ViewRolesModal,
    ViewPermissionsModal,
  },

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
      selectedUserId:"",

      deleteModalVisible: false,
      deleteId: null,

      // NEW
      showRolesModal: false,
      showPermissionsModal: false,
      selectedRoles: [],
      selectedPermissions: [],
    };
  },

  methods: {
    async fetchItems(page = 1) {
      this.loading = true;
      this.currentPage = page;

      const params = {
        page: this.currentPage,
        page_size: this.pageSize,
        search: this.searchQuery,
      };

      try {
        const response = await this.$apiGet("/users/", params);
        this.items = response.data;
        this.count = response.count;
        this.nextPage = response.next;
        this.previousPage = response.previous;
      } catch (e) {
        console.error(e);
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
      this.selectedItem = item;
      this.showModal = true;
    },

    viewDetails(id) {
      this.$router.push({ name: "Users-detail", params: { id } });
    },

    openDeleteModal(id) {
      this.deleteId = id;
      this.deleteModalVisible = true;
    },

    async confirmDelete() {
      const res = await this.$apiDelete("/users", this.deleteId);
      if (res) this.$root.$refs.toast.showToast("User deleted", "success");

      this.deleteModalVisible = false;
      this.fetchItems(this.currentPage);
    },

    // NEW - show roles
    viewRoles(id) {
      const user = this.items.find((u) => u.id === id);
      this.selectedRoles = user?.Roles || [];
      this.showRolesModal = true;
      this.selectedUserId=id;
    },

    // NEW - show permissions
    viewPermissions(id) {
      const user = this.items.find((u) => u.id === id);
      this.selectedPermissions = user?.effectivePermissions || [];
      this.showPermissionsModal = true;
    },
  },

  mounted() {
    this.fetchItems();
  },
};
</script>
