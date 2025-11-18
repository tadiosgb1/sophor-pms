<template>
  <div>
    <Toast ref="toast" />
    
    <div class="min-h-screen bg-gray-50 p-6 sm:p-6">
      <div class="max-w-7xl mx-auto">
    
        <div class="flex justify-between items-center border-b pb-4 mb-6 border-gray-200">
          <h1 class="text-xl font-bold text-gray-800">Permissions manegement</h1>
        </div>
        
        <div class="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200 p-6">
          
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search permissions..."
            class="w-full max-w-sm px-4 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150"
          />

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    @click="sortBy('name')"
                  >
                    Name
                    <SortIcon
                      :field="'name'"
                      :sort-key="sortKey"
                      :sort-asc="sortAsc"
                    />
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    @click="sortBy('codename')"
                  >
                    Codename
                    <SortIcon
                      :field="'codename'"
                      :sort-key="sortKey"
                      :sort-asc="sortAsc"
                    />
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="permission in filteredAndSortedPermissions"
                  :key="permission.id"
                  class="hover:bg-gray-50 transition duration-150"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ permission.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span class="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-mono border border-gray-300">
                        {{ permission.codename }}
                    </span>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-center text-sm space-x-3"
                  >
                    <button
                      @click="editPermission(permission)"
                      class="text-green-600 hover:text-green-800 transition duration-150"
                      title="Edit"
                    >
                      <svg class="h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="deletePermission(permission)"
                      class="text-red-600 hover:text-red-800 transition duration-150"
                      title="Delete"
                    >
                      <svg class="h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>

                <tr v-if="filteredAndSortedPermissions.length === 0">
                  <td colspan="3" class="text-center py-6 text-gray-500 italic">
                    No permissions found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddPermission
        v-if="addVisible"
        :visible="addVisible"
        @close="
          addVisible = false;
          fetchPermissions();
        "
      />
      <UpdatePermission
        v-if="updateVisible"
        :visible="updateVisible"
        :permission="permissionToEdit"
        @close="updateVisible = false"
        @refresh="fetchPermissions"
      />
      <ConfirmModal
        :visible="deleteModalVisible"
        title="Delete Permission"
        :message="`Are you sure you want to delete '${permissionToDelete?.name}'?`"
        @cancel="deleteModalVisible = false"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>

<script>
import Toast from "../../../components/Toast.vue";
import AddPermission from "./add.vue";
import UpdatePermission from "./update.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";

const SortIcon = {
  props: ["field", "sortKey", "sortAsc"],
  template: `
    <span class="inline-block ml-1 text-gray-500">
      <svg v-if="sortKey !== field" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
      </svg>
      <svg v-else-if="sortAsc" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 13l4 4 4-4m0-6l-4-4-4 4"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
      </svg>
    </span>
  `,
};

export default {
  name: "PermissionsView",
  components: {
    SortIcon,
    AddPermission,
    UpdatePermission,
    ConfirmModal,
    Toast,
  },
  data() {
    return {
      searchTerm: "",
      sortKey: "name",
      sortAsc: true,
      permissions: [],
      addVisible: false,
      updateVisible: false,
      permissionToEdit: null,
      deleteModalVisible: false,
      permissionToDelete: null,
    };
  },
  computed: {
    filteredAndSortedPermissions() {
      let filtered = this.permissions.filter(
        (p) =>
          p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          p.codename.toLowerCase().includes(this.searchTerm.toLowerCase())
      );

      filtered.sort((a, b) => {
        let res = 0;
        if (a[this.sortKey] < b[this.sortKey]) res = -1;
        if (a[this.sortKey] > b[this.sortKey]) res = 1;
        return this.sortAsc ? res : -res;
    });

      return filtered;
    },
  },
  mounted() {
    this.fetchPermissions();
  },
  methods: {
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    },
    async fetchPermissions() {
      const params = {
        page_size: 1000,
      };
      try {
        const response = await this.$apiGet("/get_permissions", params);
        this.permissions = response.data;
        console.log("permissions are",this.permissions)
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
        alert("Failed to load permissions.");
      }
    },
    editPermission(permission) {
      this.permissionToEdit = permission;
      this.updateVisible = true;
    },
    deletePermission(permission) {
      this.permissionToDelete = permission;
      this.deleteModalVisible = true;
    },
    async confirmDelete() {
      try {
        await this.$apiDelete(
          `/delete_permission/${this.permissionToDelete.id}`
        );
        this.$root.$refs.toast.showToast(
          "Permission deleted successfully",
          "success"
        );
        this.fetchPermissions();
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete permission.");
      } finally {
        this.permissionToDelete = null;
        this.deleteModalVisible = false;
      }
    },
  },
};
</script>