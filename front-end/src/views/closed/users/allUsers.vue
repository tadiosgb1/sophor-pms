<template>
  <div class="text-sm text-gray-800 ">
    <div class="flex items-center justify-between border-b pb-4 mb-4 border-gray-200">
      <h1 class="text-xl font-semibold text-gray-800">All Users</h1>
      <button
        @click="showAdd = true"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition duration-150 flex items-center"
      >
        + Add User
      </button>
    </div>

    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3"
    >
      <input
        v-model="searchQuery"
        @input="fetchUsers(1)"
        type="text"
        placeholder="Search by name or email..."
        class="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
      />
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <label>Show</label>
        <select
          v-model="pageSize"
          @change="fetchUsers(1)"
          class="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-green-500"
        >
          <option v-for="size in [1, 5, 10, 20, 100]" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
        <span>entries</span>
      </div>
    </div>

    <div class="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
      <table class="min-w-full text-sm hidden sm:table divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Full Name</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Wallet</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Level</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Active</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(user, index) in users"
            :key="user.id"
            class="hover:bg-gray-50 transition duration-150"
          >
            <td class="px-6 py-3 whitespace-nowrap">
              {{ (currentPage - 1) * pageSize + index + 1 }}
            </td>
            <td class="px-6 py-3 whitespace-nowrap font-medium text-green-700">{{ user.email }}</td>
            <td class="px-6 py-3 whitespace-nowrap">
              {{ user.first_name }} {{ user.middle_name }} {{ user.last_name }}
            </td>
            <td class="px-6 py-3 whitespace-nowrap">{{ user.phone_number || "-" }}</td>
            <td class="px-6 py-3 whitespace-nowrap font-bold">{{ user.wallet_balance }}</td>
            <td class="px-6 py-3 whitespace-nowrap">{{ user.level}}</td>

            <td class="px-6 py-3 whitespace-nowrap">
              <span :class="user.is_active ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'">
                {{ user.is_active ? "Yes" : "No" }}
              </span>
            </td>
            <td class="px-6 py-3 whitespace-nowrap text-gray-500">
              {{ formatDate(user.date_joined) }}
            </td>
            <td class="px-6 py-3 whitespace-nowrap flex gap-3">
              <button
                class="text-green-500 hover:text-green-700 transition duration-150"
                @click="openEdit(user)"
                title="Edit"
              >
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                class="text-red-500 hover:text-red-700 transition duration-150"
                @click="deleteUser(user.id)"
                title="Delete"
              >
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </td>
          </tr>

          <tr v-if="users.length === 0">
            <td colspan="9" class="text-center py-8 text-gray-400 italic">
              No users found.
            </td>
          </tr>
        </tbody>
      </table>

      <div class="sm:hidden flex flex-col gap-3 p-3">
        <div
          v-for="(user, index) in users"
          :key="user.id"
          class="  "
        >
          <div class="flex justify-between items-start mb-2 border-b pb-2">
            <span class="text-base font-bold text-green-700">{{ user.email }}</span>
            <div class="flex gap-3 text-sm">
              <button
                @click="openEdit(user)"
                class="text-green-500 hover:text-green-700 transition duration-150"
                title="Edit"
              >
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button
                @click="deleteUser(user.id)"
                class="text-red-500 hover:text-red-700 transition duration-150"
                title="Delete"
              >
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>

          <div class="text-sm space-y-1">
            <div class="flex justify-between"><span class="font-medium text-gray-600">Full Name:</span> {{ user.first_name }} {{ user.last_name }}</div>
            <div class="flex justify-between"><span class="font-medium text-gray-600">Phone:</span> {{ user.phone_number || "-" }}</div>
            <div class="flex justify-between"><span class="font-medium text-gray-600">Wallet:</span> <span class="font-bold">{{ user.wallet_balance }}</span></div>
            <div class="flex justify-between"><span class="font-medium text-gray-600">Level:</span> {{ user.level}}</div>
            <div class="flex justify-between"><span class="font-medium text-gray-600">Status:</span> 
              <span :class="user.is_active ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'">
                {{ user.is_active ? "Active" : "Inactive" }}
              </span>
            </div>
            <div class="flex justify-between text-xs text-gray-500 border-t pt-2 mt-2"><span class="font-medium text-gray-600">Joined:</span> {{ formatDate(user.date_joined) }}</div>
          </div>
        </div>
        <div v-if="users.length === 0" class="text-center py-6 text-gray-400 italic">
          No users found.
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mt-6 text-sm">
      <span class="text-gray-600"
        >Showing Page **{{ currentPage }}** of **{{ totalPages }}** ({{ count }} total entries)</span
      >
      <div class="flex items-center gap-2">
        <button
          @click="fetchUsers(currentPage - 1)"
          :disabled="!previousPage"
          class="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition duration-150"
        >
          &larr; Prev
        </button>
        <button
          @click="fetchUsers(currentPage + 1)"
          :disabled="!nextPage"
          class="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition duration-150"
        >
          Next &rarr;
        </button>
      </div>
    </div>

    <AddUser v-if="showAdd" @close="showAdd = false" @saved="fetchUsers" />
    <EditUser
      v-if="showEdit"
      :user="selectedUser"
      @close="showEdit = false"
      @saved="fetchUsers"
    />
  </div>
</template>

<script>
import AddUser from "./AddUser.vue";
import EditUser from "./EditUser.vue";

export default {
  components: { AddUser, EditUser },
  data() {
    return {
      users: [],
      count: 0,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10,
      nextPage: null,
      previousPage: null,
      searchQuery: "",
      showAdd: false,
      showEdit: false,
      selectedUser: null,
    };
  },
  methods: {
    async fetchUsers(page = 1) {
      try {
        const params = {
          page,
          page_size: this.pageSize,
          search: this.searchQuery || undefined,
        };
        const res = await this.$apiGet("/get_users", params);

        console.log("res of users", res);

        this.users = res.data || [];
        this.count = res.count;
        this.totalPages = res.total_pages;
        this.currentPage = res.current_page;
        this.nextPage = res.next;
        this.previousPage = res.previous;
      } catch (err) {
        console.error(err);
      }
    },
    openEdit(user) {
      this.selectedUser = user;
      this.showEdit = true;
    },
    async deleteUser(id) {
      if (!confirm("Are you sure you want to delete this user?")) return;
      try {
        await this.$apiDelete(`/delete_user/${id}/`);
        this.fetchUsers(this.currentPage);
        this.$root.$refs.toast.showToast(
          "User deleted successfully",
          "success"
        );
      } catch (err) {
        console.error(err);
        this.$root.$refs.toast.showToast("Failed to delete user", "error");
      }
    },
    formatDate(dateStr) {
      // Defensive check for dateStr
      if (!dateStr) return '-';
      // Assuming dateStr is in a format compatible with Date constructor
      try {
        return new Date(dateStr).toLocaleDateString();
      } catch (e) {
        return dateStr; // Return original if parsing fails
      }
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>