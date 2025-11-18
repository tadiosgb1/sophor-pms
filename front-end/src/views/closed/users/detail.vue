<template>
  <div class="bg-gray-100 p-6" v-if="user">
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <!-- Header -->
      <div
        class="bg-primary text-white px-6 py-4 flex justify-between items-center"
      >
        <h2 class="text-2xl font-bold">User Detail</h2>
      </div>

      <!-- General Profile -->
      <div class="p-6 border m-2">
        <h3 class="text-lg font-semibold mb-4">General Profile</h3>
        <form class="space-y-4 mx-5 border p-3">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-600 font-semibold mb-1"
                >First Name</label
              >
              <input
                type="text"
                v-model="user.first_name"
                class="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label class="block text-gray-600 font-semibold mb-1"
                >Middle Name</label
              >
              <input
                type="text"
                v-model="user.middle_name"
                class="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label class="block text-gray-600 font-semibold mb-1"
                >Last Name</label
              >
              <input
                type="text"
                v-model="user.last_name"
                class="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label class="block text-gray-600 font-semibold mb-1"
                >Email</label
              >
              <input
                type="email"
                v-model="user.email"
                class="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label class="block text-gray-600 font-semibold mb-1"
                >Phone</label
              >
              <input
                type="text"
                v-model="user.phone_number"
                class="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label class="block text-gray-600 font-semibold mb-1"
                >Address</label
              >
              <input
                type="text"
                v-model="user.address"
                class="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label class="block text-gray-600 font-semibold mb-1"
                >Date Joined</label
              >
              <input
                type="text"
                :value="formatDate(user.date_joined)"
                class="w-full border rounded px-3 py-2"
                readonly
              />
            </div>
            <!-- Checkboxes -->
            <div class="flex items-center space-x-2 mt-2">
              <input type="checkbox" v-model="user.is_active" />
              <label class="text-gray-600 font-semibold">Active</label>
            </div>
            <div class="flex items-center space-x-2 mt-2">
              <input type="checkbox" v-model="user.is_staff" />
              <label class="text-gray-600 font-semibold">Staff</label>
            </div>
            <div class="flex items-center space-x-2 mt-2">
              <input type="checkbox" v-model="user.is_superuser" />
              <label class="text-gray-600 font-semibold">Superuser</label>
            </div>
          </div>
          <div>
            <button
              @click.prevent="saveProfile(user)"
              class="bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow hover:bg-blue-700"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      <!-- Groups Section -->
      <div class="p-6 border-b">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-semibold">Groups</h3>
          <button
            type="button"
            @click="showGroupsModal = true"
            class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
          >
            Edit Groups
          </button>
        </div>
        <div
          class="flex flex-wrap gap-1 max-h-32 overflow-auto border p-2 rounded bg-gray-50"
        >
          <span
            v-for="group in user.groups"
            :key="group"
            class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
          >
            {{ group }}
          </span>
          <span v-if="user.groups.length === 0" class="text-gray-400"
            >No Groups</span
          >
        </div>
      </div>

      <!-- Permissions Section -->
      <div class="p-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-semibold">Permissions</h3>
          <button
            type="button"
            @click="showPermissionsModal = true"
            class="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
          >
            Edit Permissions
          </button>
        </div>
        <div
          class="flex flex-wrap gap-1 max-h-32 overflow-auto border p-2 rounded bg-gray-50"
        >
          <span
            v-for="perm in user.user_permissions"
            :key="perm"
            class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
          >
            {{ perm }}
          </span>
          <span v-if="user.user_permissions.length === 0" class="text-gray-400"
            >No Permissions</span
          >
        </div>
      </div>
    </div>

    <!-- Modals -->
    <EditGroupsModal
      v-if="showGroupsModal"
      :groups="user.groups"
      :userId="user.id"
      @close="
        showGroupsModal = false;
        fetchUser();
      "
    />
    <EditPermissionsModal
      v-if="showPermissionsModal"
      :permissions="user.user_permissions"
      :userId="user.id"
      @close="
        showPermissionsModal = false;
        fetchUser();
      "
    />
  </div>
</template>

<script>
import EditGroupsModal from "./EditGroupsModal.vue";
import EditPermissionsModal from "./EditPermissionsModal.vue";

export default {
  name: "UserDetail",
  components: { EditGroupsModal, EditPermissionsModal },
  data() {
    return {
      user: null,
      showGroupsModal: false,
      showPermissionsModal: false,
    };
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      try {
        const userId = this.$route.params.id;
        const res = await this.$apiGetById("/get_user", userId);
        this.user = res;
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    },
    async saveProfile(user) {
      console.log("user", user);
      const payload = {
        address: user.address,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        middle_name: user.middle_name,
        phone_number: user.phone_number,
        date_joined: user.date_joined,
        last_login: user.last_login,
        is_active: user.is_active,
        is_staff: user.is_staff,
        is_superuser: user.is_superuser,
      };
      try {
        // Custom API to update user profile
        await this.$apiPut(`/old_update_user`, user.id, payload).then((res) => {
          this.$root.$refs.toast.showToast(res.message, "success");
        });
      } catch (err) {
        console.error("Failed to save profile:", err);
        this.$root.$refs.toast.showToast(err.message, "error");
      }
    },
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleString();
    },
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>
