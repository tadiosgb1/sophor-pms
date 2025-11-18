<template>
  <!-- Root container -->
  <div class="flex flex-col h-screen bg-gray-100 font-sans">
    <!-- Header -->
    <header class="relative bg-white w-full shadow sticky top-0 z-20 px-4 py-3">
      <div class="flex items-center justify-between w-full">
        <!-- Left side: Toggle + Logo + Title -->
        <div class="flex items-center space-x-3">
          <!-- Sidebar toggle (mobile only) -->
          <button
            v-if="showToggleButton"
            @click="toggleSidebar"
            class="text-blue-500 hover:text-yellow-400 focus:outline-none sm:hidden"
            aria-label="Toggle sidebar"
          >
            <i class="fas fa-bars text-2xl"></i>
          </button>

          <!-- Logo and title -->
          <div class="flex items-center space-x-2">
            <img
              src="../../assets/img/logo1.jpg"
              alt="Logo"
              class="h-10 w-10 rounded-full flex-shrink-0"
            />
            <h1
              class="text-xl md:text-2xl font-extrabold text-blue-400 truncate"
              title="NePAF"
            >
              MLM
            </h1>
          </div>
        </div>

        <!-- Right side: Notifications + Welcome + Profile -->
        <div class="flex items-center space-x-4 text-blue-500">
          <!-- Notifications Dropdown -->
          <div
            class="relative inline-block"
            @click.stop="toggleNotificationDropdown"
          >
            <!-- Bell -->
            <i class="fas fa-bell text-gray-700 text-xl cursor-pointer"></i>

            <!-- Notification Badge -->
            <span
              v-if="notifications.length > 0"
              class="curosr-pointer absolute -top-3 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow"
            >
              {{ notifications.length }}
            </span>

            <!-- Dropdown -->
            <transition name="fade">
              <ul
                v-show="isNotificationDropdownOpen"
                class="absolute right-0 mt-2 w-72 bg-white shadow-md z-50 text-sm py-2 rounded max-h-80 overflow-y-auto"
                @click.outside="isNotificationDropdownOpen = false"
              >
                <li
                  v-for="(notif, index) in notifications"
                  :key="index"
                  class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-start space-x-2"
                  @click="goToNotification(notif.id)"
                >
                  <i class="fas fa-info-circle text-yellow-500 mt-1"></i>
                  <div class="flex-1">
                    <p class="text-gray-700 font-medium">
                      {{ notif.notification_type }} {{ notif.created_at }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ notif.message }}
                    </p>
                  </div>
                </li>

                <li
                  v-if="notifications.length === 0"
                  class="px-4 py-2 text-gray-500 text-center"
                >
                  No notifications
                </li>
              </ul>
            </transition>
          </div>

          <!-- Welcome -->
          <span class="whitespace-nowrap hidden sm:block">Welcome,</span>
          <h1
            class="font-extrabold text-blue-400 hidden sm:block"
            title="User Name"
          >
            {{ name }}
          </h1>

          <!-- Profile dropdown -->
          <div class="relative" @click.stop="toggleProfileDropdown">
            <div
              class="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-100"
              aria-haspopup="true"
              aria-expanded="isProfileDropdownOpen ? 'true' : 'false'"
              role="button"
              tabindex="0"
            >
              <i class="fas fa-user text-yellow-500"></i>
            </div>

            <transition name="fade">
              <ul
                v-show="isProfileDropdownOpen"
                class="absolute right-0 mt-2 w-44 bg-white shadow-md z-50 text-sm py-2 rounded"
                @click.outside="isProfileDropdownOpen = false"
              >
                <li>
                  <a
                    href="#"
                    class="flex items-center px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    <i class="fas fa-cog text-yellow-500 mr-2"></i>
                    <span>Change Password</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    @click="openProfile"
                    class="flex items-center px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    <i class="fas fa-user-cog text-yellow-500 mr-2"></i>
                    <span>Change Profile</span>
                  </a>
                </li>
                <li>
                  <a
                    @click="logout"
                    href="#"
                    class="flex items-center px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    <i class="fas fa-sign-out-alt text-yellow-500 mr-2"></i>
                    <span>Logout</span>
                  </a>
                </li>
              </ul>
            </transition>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
 <!-- Main Content -->
<div class="flex flex-1 overflow-hidden">
  <!-- Sidebar always visible on large screens (lg+), hidden on md and below -->
  <div class="hidden lg:block w-64 bg-white h-[calc(100vh-4rem)] overflow-y-auto sticky top-16">
    <Sidebar />
  </div>

  <!-- Overlay and Slide-in Sidebar for tablet and mobile -->
  <div
    v-if="showSidebar && screenWidth < 1024"
    class="fixed inset-0 bg-black bg-opacity-50 z-40"
    @click="toggleSidebar"
  ></div>
  <div
    v-if="showSidebar && screenWidth < 1024"
    class="fixed left-0 top-0 w-64 bg-white shadow-lg z-50 h-full overflow-y-auto"
  >
    <button
      class="absolute top-4 right-4 text-gray-600"
      @click="toggleSidebar"
    >
      <i class="fas fa-times text-xl"></i>
    </button>
    <Sidebar />
  </div>

  <!-- Main content slot -->
  <main class="flex-1 overflow-y-auto">
    <router-view />
  </main>
</div>


    <Profile
      :visible="showProfileModal"
      @close="closeProfile"
      @updated="onProfileUpdated"
    />
  </div>
</template>

<script>
import Sidebar from "@/components/layouts/leftSidevar.vue";
import Profile from "./Profile.vue";

export default {
  name: "AppLayout",
  components: { Sidebar, Profile },
  data() {
    return {
      showProfileModal: false,
      notifications: [],
      name: localStorage.getItem("name"),
      showSidebar: false,
      isLangOpen: false,
      isProfileDropdownOpen: false,
      isNotificationDropdownOpen: false,
      screenWidth: window.innerWidth,
      currentLanguage: "English",
      showToggleButton: window.innerWidth < 1024,
    };
  },
  async created() {
    window.addEventListener("resize", this.handleResize);
    this.name = localStorage.getItem("name");

    const params = { page_size: 1000000 };
    const res = await this.$apiGetById(
      `/get_unread_notifications`,
      localStorage.getItem("userId")
    );
    this.notifications = res.data;
    console.log("notifications", this.notifications);
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    openProfile() {
      this.isProfileDropdownOpen = false; // close dropdown
      this.showProfileModal = true;
    },
    closeProfile() {
      this.showProfileModal = false;
    },
    onProfileUpdated(updatedUser) {
      if (updatedUser?.name) {
        this.name = updatedUser.name;
        localStorage.setItem("name", updatedUser.name);
      }
    },
    goToNotification(id) {
      this.$router.push({ name: "notificationDetail", params: { id } });
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
      this.showToggleButton = this.screenWidth < 1024;
    },
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    toggleProfileDropdown() {
      this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    },
    toggleNotificationDropdown() {
      this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
    },
    getNotificationText(notif) {
      if (notif.user_id) return "New user activity";
      if (notif.maintenance_request_id) return "New maintenance request";
      if (notif.payment_id) return "New payment notification";
      if (notif.rent_id) return "New rent notification";
      return "General notification";
    },
    openNotification(notif) {
      if (notif.user_id) {
        this.$router.push(`/users/${notif.user_id}`);
      } else if (notif.maintenance_request_id) {
        this.$router.push(`/maintenance/${notif.maintenance_request_id}`);
      } else if (notif.payment_id) {
        this.$router.push(`/payments/${notif.payment_id}`);
      } else if (notif.rent_id) {
        this.$router.push(`/rents/${notif.rent_id}`);
      }
      this.isNotificationDropdownOpen = false;
    },
    changeLang(lang) {
      this.currentLanguage = lang;
      this.isLangOpen = false;
    },
    logout() {
      localStorage.clear();
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
