<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white w-full max-w-lg rounded shadow-lg p-6 relative">
      <h3 class="text-xl font-semibold mb-4">Edit Permissions</h3>

      <div class="max-h-64 overflow-auto border p-2 rounded bg-gray-50">
        <div
          v-for="perm in allPermissions"
          :key="perm.codename"
          class="flex items-center mb-2"
        >
          <input
            type="checkbox"
            :id="`perm-${perm.codename}`"
            :value="perm.codename"
            v-model="selectedPermissions"
            class="mr-2"
          />
          <label :for="`perm-${perm.codename}`">{{ perm.codename }}</label>
        </div>
        <div v-if="allPermissions.length === 0" class="text-gray-400">
          No permissions available
        </div>
      </div>

      <div class="mt-4 flex justify-end space-x-2">
        <button
          @click="$emit('close')"
          class="px-4 py-2 rounded border hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          @click="savePermissions"
          class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditPermissionsModal",
  props: {
    permissions: { type: Array, default: () => [] }, // current user permissions
    userId: { type: [Number, String], required: true },
  },
  data() {
    return {
      allPermissions: [],
      selectedPermissions: [],
    };
  },
  async mounted() {
    try {
      const params = {
        page_size: 1000,
      };
      const response = await this.$apiGet("/get_permissions", params);
      this.allPermissions = response.data || [];
      const allCodenames = this.allPermissions.map((p) => p.codename);
      // Preselect user permissions that exist in the full list
      this.selectedPermissions = this.permissions.filter((p) =>
        allCodenames.includes(p)
      );
    } catch (err) {
      console.error("Failed to fetch permissions:", err);
    }
  },
  methods: {
    async savePermissions() {
      try {
        const payload = {
          user_id: this.userId,
          permissions: this.selectedPermissions,
        };

        console.log("Permissions", this.permissions);

        await this.$apiPost("/set_user_permissions", payload);
        this.$emit("close");
      } catch (err) {
        console.error("Failed to save permissions:", err);
        alert("Failed to save permissions");
      }
    },
  },
};
</script>
