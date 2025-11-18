<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white w-full max-w-md rounded shadow-lg p-6 relative">
      <h3 class="text-xl font-semibold mb-4">Edit Groups</h3>

      <div class="max-h-64 overflow-auto border p-2 rounded bg-gray-50">
        <div
          v-for="group in allGroups"
          :key="group.name"
          class="flex items-center mb-2"
        >
          <input
            type="checkbox"
            :id="`group-${group.name}`"
            :value="group.name"
            v-model="selectedGroups"
            class="mr-2"
          />
          <label :for="`group-${group.name}`">{{ group.name }}</label>
        </div>
        <div v-if="allGroups.length === 0" class="text-gray-400">
          No groups available
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
          @click="saveGroups"
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
  name: "EditGroupsModal",
  props: {
    groups: { type: Array, default: () => [] }, // user groups
    userId: { type: [Number, String], required: true },
  },
  data() {
    return {
      allGroups: [],
      selectedGroups: [...this.groups],
    };
  },
  async mounted() {
    try {
      const response = await this.$apiGet("/get_groups", { page_size: 1000 });
      this.allGroups = response.data;
      // Pre-select user's current groups
      this.selectedGroups = this.groups.filter((g) =>
        this.allGroups.map((a) => a.name).includes(g)
      );
    } catch (err) {
      console.error("Failed to fetch groups:", err);
    }
  },
  methods: {
    async saveGroups() {
      try {
        const payload = {
          user_id: this.userId,
          groups: this.selectedGroups,
        };

        console.log("payload", payload);

        await this.$apiPost("/set_user_groups", payload);
        this.$emit("close");
      } catch (err) {
        console.error("Failed to save groups:", err);
        alert("Failed to save groups");
      }
    },
  },
};
</script>
