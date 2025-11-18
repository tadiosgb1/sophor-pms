<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-6 flex justify-center items-start">
    <div class="w-full">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Notification Details</h1>
        <router-link
          to="/notifications"
          class="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
        >
          Back
        </router-link>
      </div>

      <!-- Notification Card -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800 capitalize">
            {{ notification.notification_type }}
          </h2>
          <span
            class="px-2 py-1 text-xs rounded font-semibold"
            :class="notification.is_read ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
          >
            {{ notification.is_read ? 'Read' : 'Unread' }}
          </span>
        </div>

        <p class="text-gray-700 mb-4">{{ notification.message }}</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span class="font-semibold">Created At:</span>
            {{ formatDate(notification.created_at) }}
          </div>
          <div v-if="notification.read_at">
            <span class="font-semibold">Read At:</span>
            {{ formatDate(notification.read_at) }}
          </div>
          <div v-if="notification.user_id">
            <span class="font-semibold">User :</span>
            {{ notification.user_id.first_name }}   {{ notification.user_id.middle_name }}   {{ notification.user_id.last_name }} 
          </div>
          <div v-if="notification.maintenance_request_id">
            <span class="font-semibold">Maintenance Request ID:</span>
            {{ notification.maintenance_request_id }}
          </div>
          <div v-if="notification.payment_id">
            <span class="font-semibold">Payment ID:</span>
            {{ notification.payment_id }}
          </div>
          <div v-if="notification.rent_id">
            <span class="font-semibold">Rent ID:</span>
            {{ notification.rent_id }}
          </div>
        </div>

        <!-- Mark as Read Button -->
        <div class="mt-6 flex justify-end">
          <button
            v-if="!notification.is_read"
            @click="markAsRead(notification.id)"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Mark as Read
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotificationDetail",
  data() {
    return {
      notification: {},
    };
  },
  mounted() {
    this.fetchNotification();
  },
  methods: {
    async fetchNotification() {
      try {
        const id = this.$route.params.id;
        const res = await this.$apiGet(`/get_notification/${id}`);
        this.notification = res || {};
      } catch (error) {
        console.error("Failed to fetch notification:", error);
        this.notification = {};
      }
    },
    async markAsRead(id) {
      try {
        const payload = { 
          is_read: true ,
          id:id,
          user:localStorage.getItem('userId')
        };
        const res = await this.$apiPost(`/post_notification_user`,  payload);
        if (res) {
          this.notification.is_read = true;
          this.notification.read_at = new Date().toISOString();
           this.$root.$refs.toast.showToast("Successfully marked as red", "success");
        }
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    },
    formatDate(dateString) {
      if (!dateString) return "-";
      return new Date(dateString).toLocaleString();
    },
  },
};
</script>

<style scoped>
/* Optional: add subtle hover effect */
</style>
