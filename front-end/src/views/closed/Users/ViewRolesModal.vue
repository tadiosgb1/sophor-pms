<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-lg font-bold mb-4">Assign Roles</h2>

      <!-- All roles -->
      <div class="space-y-2">
        <label v-for="role in allRoles" :key="role.id" class="flex items-center gap-2">
          <input
            type="checkbox"
            :value="role.id"
            v-model="selectedRoleIds"
            class="w-4 h-4"
          />
          <span>{{ role.name }}</span>
        </label>
      </div>

      <!-- Buttons -->
      <div class="mt-5 flex justify-between">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-600 text-white rounded"
        >Close</button>

        <button
          @click="assignRoles"
          class="px-4 py-2 bg-green-600 text-white rounded"
        >Save</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["userId", "roles"],
  data() {
    return {
      allRoles: [],
      selectedRoleIds: [],
      loading: false,
    };
  },

  async mounted() {
    // Pre-select roles user already has
    this.selectedRoleIds = this.roles.map(r => r.id);

    // Fetch ALL roles
    const response = await this.$apiGet("/roles", { page_size: 1000 });

    // `response.data` contains list of roles
    this.allRoles = response.data;
  },

  methods: {
    async assignRoles() {
      try {
        const payload = { roleIds: this.selectedRoleIds };

        await this.$apiPut(`/users/${this.userId}/roles`,'', payload);

        this.$root.$refs.toast.showToast("Roles updated successfully", "success");
        this.$emit("close");
      } catch (e) {
        console.error(e);
        this.$root.$refs.toast.showToast("Failed to assign roles", "error");
      }
    },
  },
};
</script>
