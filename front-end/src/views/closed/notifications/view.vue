<template>
  <div class="p-6 bg-gray-50 min-h-screen text-sm text-gray-800">

    <!-- HEADER -->
    <div class="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
      <h1 class="text-lg font-bold text-gray-800">Notifications</h1>
    </div>

    <!-- SEARCH + PAGE SIZE -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
      <input
        v-model="searchTerm"
        @input="fetchNotifications(1)"
        type="text"
        placeholder="Search notifications..."
        class="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:max-w-xs 
               focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition duration-150"
      />

      <div class="flex items-center gap-2 text-sm text-gray-600">
        <label>Show</label>
        <select
          v-model="pageSize"
          @change="fetchNotifications(1)"
          class="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white 
          focus:ring-green-500 focus:border-green-500"
        >
          <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
        </select>
        <span>entries</span>
      </div>
    </div>

    <!-- DESKTOP TABLE -->
    <div class="bg-white overflow-hidden rounded-xl border border-gray-200 hidden md:block">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm divide-y divide-gray-200">
          <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th class="px-6 py-3 text-left">Message</th>
              <th class="px-6 py-3 text-left">Type</th>
              <th class="px-6 py-3 text-left">User</th>
              <th class="px-6 py-3 text-left">Maintenance</th>
              <th class="px-6 py-3 text-left">Payment</th>
              <th class="px-6 py-3 text-left">Rent</th>
              <th class="px-6 py-3 text-left">Created</th>
              <th class="px-6 py-3 text-left">Status</th>
              <th class="px-6 py-3 text-left">Read At</th>
              <th class="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="notif in filteredNotifications"
              :key="notif.id"
              class="hover:bg-green-50 transition duration-150"
            >
              <td class="px-6 py-4">{{ notif.message }}</td>
              <td class="px-6 py-4">{{ notif.notification_type }}</td>
              <td class="px-6 py-4">
                {{ notif.user_id.first_name }} {{ notif.user_id.middle_name }} {{ notif.user_id.last_name }}
              </td>
              <td class="px-6 py-4">{{ notif.maintenance_request_id || '-' }}</td>
              <td class="px-6 py-4">{{ notif.payment_id || '-' }}</td>
              <td class="px-6 py-4">{{ notif.rent_id || '-' }}</td>

              <td class="px-6 py-4 text-gray-500">{{ formatDate(notif.created_at) }}</td>

              <td class="px-6 py-4">
                <span 
                  :class="notif.is_read ? 'text-green-600 font-medium' : 'text-red-600 font-medium'"
                >
                  {{ notif.is_read ? "Read" : "Unread" }}
                </span>
              </td>

              <td class="px-6 py-4">{{ notif.read_at || '-' }}</td>

              <td class="px-6 py-4 text-center space-x-3">

                <button 
                  v-if="!notif.is_read"
                  @click="markAsRead(notif.id)"
                  class="text-blue-600 hover:text-blue-800 transition duration-150 text-sm"
                >
                  Mark as Read
                </button>

                <button 
                  @click="goToNotification(notif.id)"
                  class="text-green-600 hover:text-green-800 transition duration-150 text-sm"
                >
                  Detail
                </button>

              </td>
            </tr>

            <tr v-if="filteredNotifications.length === 0">
              <td colspan="10" class="text-center py-6 text-gray-400 italic">
                No notifications found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MOBILE CARD VIEW -->
    <div class="md:hidden space-y-4">
      <div 
        v-for="notif in filteredNotifications"
        :key="notif.id"
        class="bg-white border border-gray-200 rounded-xl shadow-md p-4"
      >
        <div class="flex justify-between items-start mb-3 border-b pb-2">
          <h2 class="font-bold text-gray-800">Notification</h2>
        </div>

        <div class="text-sm text-gray-700 space-y-2">
          <div><span class="font-medium text-gray-600">Message:</span> {{ notif.message }}</div>
          <div><span class="font-medium text-gray-600">Type:</span> {{ notif.notification_type }}</div>
          <div><span class="font-medium text-gray-600">User:</span> 
            {{ notif.user_id.first_name }} {{ notif.user_id.middle_name }} {{ notif.user_id.last_name }}
          </div>

          <div><span class="font-medium text-gray-600">Maintenance:</span> {{ notif.maintenance_request_id || '-' }}</div>
          <div><span class="font-medium text-gray-600">Payment:</span> {{ notif.payment_id || '-' }}</div>
          <div><span class="font-medium text-gray-600">Rent:</span> {{ notif.rent_id || '-' }}</div>

          <div><span class="font-medium text-gray-600">Created:</span> {{ formatDate(notif.created_at) }}</div>
          <div><span class="font-medium text-gray-600">Status:</span> 
            {{ notif.is_read ? "Read" : "Unread" }}
          </div>
          <div><span class="font-medium text-gray-600">Read At:</span> {{ notif.read_at || "-" }}</div>
        </div>

        <div class="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-3 text-xs">
          <button
            v-if="!notif.is_read"
            @click="markAsRead(notif.id)"
            class="text-blue-600 hover:text-blue-800"
          >
            Mark as Read
          </button>

          <button
            @click="goToNotification(notif.id)"
            class="text-green-600 hover:text-green-800"
          >
            Detail
          </button>
        </div>
      </div>

      <p v-if="filteredNotifications.length === 0" class="text-center text-gray-400 py-6 italic">
        No notifications found.
      </p>
    </div>

    <!-- PAGINATION -->
    <div class="flex items-center justify-between mt-6 text-sm text-gray-600">
      <span>
        Showing {{ (currentPage - 1) * pageSize + 1 }} 
        to {{ Math.min(currentPage * pageSize, totalCount) }} 
        of {{ totalCount }} total entries
      </span>

      <div class="flex items-center gap-2">
        <button
          @click="fetchNotifications(currentPage - 1)"
          :disabled="!previous"
          class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 
                 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
        >
          ← Previous
        </button>

        <span class="px-3 py-1 bg-green-600 text-white rounded-lg font-medium">
          {{ currentPage }}
        </span>

        <button
          @click="fetchNotifications(currentPage + 1)"
          :disabled="!next"
          class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 
                 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
        >
          Next →
        </button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      notifications: [],
      searchTerm: "",
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      next: null,
      previous: null,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50, 100],
    };
  },

  computed: {
    filteredNotifications() {
      const t = this.searchTerm.toLowerCase();
      return this.notifications.filter(n =>
        n.message.toLowerCase().includes(t) ||
        n.notification_type.toLowerCase().includes(t) ||
        (n.is_read ? "read" : "unread").includes(t)
      );
    },
  },

  mounted() {
    this.fetchNotifications();
  },

  methods: {
    async fetchNotifications(page = 1) {
      try {
        const params = { 
          page, 
          page_size: this.pageSize,
          user_id__email: localStorage.getItem("email")
        };

        const res = await this.$apiGet("/get_notifications", params);

        this.notifications = res.data || [];
        this.currentPage = res.current_page;
        this.totalPages = res.total_pages;
        this.totalCount = res.count || this.notifications.length;
        this.next = res.next;
        this.previous = res.previous;

      } catch (err) {
        console.error("Fetch error:", err);
        this.notifications = [];
      }
    },

    async markAsRead(id) {
      try {
        await this.$apiPatch(`/update_notification/${id}/`, { is_read: true });
        this.fetchNotifications(this.currentPage);
      } catch (err) {
        console.error("Failed to update:", err);
      }
    },

    goToNotification(id) {
      this.$router.push({ name: "notificationDetail", params: { id } });
    },

    formatDate(date) {
      return new Date(date).toLocaleString();
    },
  }
};
</script>

<style scoped>
.overflow-x-auto table th,
.overflow-x-auto table td {
  white-space: nowrap;
}
</style>
