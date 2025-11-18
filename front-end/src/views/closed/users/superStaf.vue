<template>
  <div class="min-h-screen bg-gray-100">
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <!-- Header with Add button -->
      <div
        class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
      >
        Super Staff Users
        <button
          @click="showAddModal = true"
          class="bg-white text-blue-700 font-semibold px-2 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300 flex items-center"
        >
          <span class="text-primary mr-1">+</span> Add
        </button>
      </div>

      <!-- Table -->
      <div class="p-6 overflow-x-auto">
        <table
          class="min-w-full table-auto border-collapse border border-gray-300 text-sm"
        >
          <thead>
            <tr class="bg-gray-200 text-gray-700">
              <th
                class="border border-gray-300 px-4 py-2 cursor-pointer"
                @click="sortBy('fullName')"
              >
                Full Name
                <SortIcon
                  :field="'fullName'"
                  :sort-key="sortKey"
                  :sort-asc="sortAsc"
                />
              </th>
              <th class="border border-gray-300 px-4 py-2">Groups</th>
              <th class="border border-gray-300 px-4 py-2">Active</th>
              <th class="border border-gray-300 px-4 py-2 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in sortedSuperStaffs"
              :key="user.id"
              class="hover:bg-gray-100"
            >
              <td class="border border-gray-300 px-4 py-2">
                {{ user.first_name }} {{ user.middle_name }} {{ user.last_name }}
              </td>
              <td class="border border-gray-300 px-4 py-2">
                {{ user.groups.join(", ") }}
              </td>
              <td class="border border-gray-300 px-4 py-2">
                {{ user.is_active ? "Yes" : "No" }}
              </td>
              <td class="flex flex row border border-gray-300 px-4 py-2 text-center space-x-2">
                <button
                    class="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                    @click="goToDetail(user.id)"
                  >
                    <i class="fas fa-info-circle"></i> Details
                  </button>

                  <!-- Activate / Deactivate -->
                  <button
                    v-if="!user.is_active"
                    @click="activateUser(user.id)"
                    class="flex items-center px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  >
                    <i class="fas fa-check-circle"></i> Activate
                  </button>
                  <button
                    v-else
                    @click="deactivateUser(user.id)"
                    class="flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 text-sm font-medium rounded-lg border border-orange-200 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
                  >
                    <i class="fas fa-ban mr-1"></i> Deactivate
                  </button>


                
              </td>


            </tr>
            <tr v-if="superStaffs.length === 0">
              <td colspan="4" class="text-center py-6 text-gray-500">
                No super staff found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add User Modal -->
    <Addsuperstaff
      v-if="showAddModal"
      :visible="showAddModal"
      @close="showAddModal = false"
      @success="fetchUsers"
    />
  </div>
</template>

<script>
import Addsuperstaff from "./addSuperStaff.vue";

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
  components: {
    Addsuperstaff,
    SortIcon,
  },
  data() {
    return {
      users: [],
      sortKey: "fullName",
      sortAsc: true,
      showAddModal: false, // ✅ only one variable now
    };
  },
  computed: {
    superStaffs() {
      return this.users.filter((u) => u.groups.includes("super_staff"));
    },
    sortedSuperStaffs() {
      return this.superStaffs.sort((a, b) => {
        const aName = `${a.first_name} ${a.middle_name} ${a.last_name}`.toLowerCase();
        const bName = `${b.first_name} ${b.middle_name} ${b.last_name}`.toLowerCase();
        if (aName < bName) return this.sortAsc ? -1 : 1;
        if (aName > bName) return this.sortAsc ? 1 : -1;
        return 0;
      });
    },
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const params = { page_size: 1000000 };
        const res = await this.$apiGet("/get_users", params);
        this.users = res.data;
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    },
    sortBy(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else this.sortKey = key;
    },
     activateUser(id) {
      this.$apiPost(`/activate_user/${id}`, { id }).then(() => {
        this.$root.$refs.toast.showToast("User activated successfully", "success");
        this.fetchUsers(this.pagination.current_page);
      });
    },

    deactivateUser(id) {
      this.$apiDelete(`/deactivate_user`, id).then(() => {
        this.$root.$refs.toast.showToast("User deactivated successfully", "success");
        this.fetchUsers(this.pagination.current_page);
      });
    },

    
    goToDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },
  },
};
</script>

<style scoped>
@media (max-width: 640px) {
  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>
